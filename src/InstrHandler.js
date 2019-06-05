//@flow
import type {Instructions, InstructionsResponse, InstructionResponse} from './types';
import {
   RED_LED_PIN, GREEN_LED_PIN, parseLed,
   parseInstructions, parseOpen, parseMode, parseRead, parseWrite,
   parseReadBuf, parseWriteBuf, parsePud,
   parsePwmClockDivider, parsePwmRange, parsePwmData,
   parseI2cSetSlaveAddress, parseI2cSetBaudrate, parseI2cRead, parseI2cWrite, parseI2cUpdateReg,
   parseSpiSetCSPolarity, parseSpiSetClockDivider, parseSpiSetDataMode, parseSpiTransfer, parseSpiWrite,
   parseSleep, parseMSleep,
   validInstructionSetName, parseStored
} from './util/parsers';
import { logger } from './logger';
import rpio from 'rpio'
import PouchDB from 'pouchdb'
import mkdirp from 'mkdirp';
import path from 'path';

const debug = require('debug')('instr:handler');
const sleep = require('util').promisify(setTimeout)


const bcm2835I2CReasonCodes = {
  BCM2835_I2C_REASON_OK : 0x00,
  BCM2835_I2C_REASON_ERROR_NACK : 0x01,
  BCM2835_I2C_REASON_ERROR_CLKT : 0x02,
  BCM2835_I2C_REASON_ERROR_DATA : 0x04
}

export class InstructionHandler {
  db: PouchDB;
  views: {};
  viewVersion: ?number;
  constructor() {
    const dbPath = process.env.DB_PATH || '/data/db'
    mkdirp.sync(dbPath);
    this.db = new PouchDB(`${path.join(dbPath, 'instr')}`);
    this.viewVersion = null;
    this.views = {
      storedInstr: {
        listNames: {
          map: function (doc) {
            if(doc.name && doc._id.startsWith('instrSet_')) {
              emit(doc.name, doc._id);
            }
          }.toString()
        }
      }
    };
    this.setup().then(() => {

    }).catch((err) => {

    })
  }
  async query(view: string, params: ?{}) : Promise<any> {
    const namespace = view.split('/')[0]
    try {
      const ret = await this.db.query(view, params)
      return ret;
    } catch(err) {
      if (!this.views[namespace]) {
        throw new Error(`View ${namespace} is not defined.`)
      }
      // if view doesn't exist, create it, and try again
      if (err.status === 404) {
        try {
          await this.db.put({
            _id: `_design/${namespace}`,
            views: this.views[namespace]
          });
          return await this.db.query(view, params)
        } catch(subError) {
          throw subError;
        }
      }
    }
  }
  async setupViewsForQuery() {
    let viewVersion: {_id: string, version: number, _rev?: string} = {_id: 'instrViewsVersion', version: 4};
    let removeViews = false;
    if(this.viewVersion === null) {
      try {
        const curr = await this.db.get(viewVersion._id);
        if(curr.version !== viewVersion.version) {
          viewVersion._rev = curr._rev;
          removeViews = true;
          await this.db.put(viewVersion);
        }
      } catch(err) {
        try {
          await this.db.put(viewVersion);
        } catch(subError) {
          //ignore
        }
      }
    }
    this.viewVersion = viewVersion.version;
    if(removeViews) {
      const allViews = await this.db.allDocs({startkey: '_design/', endkey: '_design/\uffff'});
      for(const k of allViews.rows) {
        try {
          const doc = await this.db.get(k.id);
          await this.db.remove(doc);
        } catch(error) {
          //ignore
        }
      }
    }
  }
  async setup() {
    await this.setupViewsForQuery();
    try {
      rpio.open(RED_LED_PIN, rpio.OUTPUT, rpio.LOW);
      rpio.open(GREEN_LED_PIN, rpio.OUTPUT, rpio.LOW);
      const instructions = await this.getStoredInstructionSet(`initialize`);
      const resp = await this.executeInstructions(instructions);
      await this.updateLastNamedInstructionExec(`initialize`, resp);
      rpio.write(RED_LED_PIN, rpio.HIGH);
      await sleep(1000);
      rpio.write(RED_LED_PIN, rpio.LOW);
    } catch(error) {
      //No initialize instruction set
    }

  }
  dbNamedInstrLastExecId(name: string) {
    return `instrNamedExec_${name}`
  }
  dbInstrId(name: string) {
    return `instrSet_${name}`;
  }
  /*
  Log the last occurence of each named set execution
  */
  async updateLastNamedInstructionExec(name: string, instructionResponse: InstructionsResponse) : Promise<boolean> {
    if(!validInstructionSetName(name)) {
      return false;
    }
    let newObj: {_id: string, name: string, _rev?: string, resp?: InstructionsResponse} = {_id: this.dbNamedInstrLastExecId(name), name};
    try {
      const doc = await this.db.get(newObj._id);
      newObj._rev = doc._rev;
    } catch (err) {
      //does not exist
    }
    newObj.resp = instructionResponse;
    try {
      const doc = await this.db.put(newObj);
    } catch (err) {
      //Ignore errors here, should still be able to work without updating instr logs
      return false;
      //throw new Error(`Cannot store last executed instruction set response for name ${name}`);
    }
    return true;
  }
  async getNamesOfInstructionSets(): Promise<Array<string>> {
    try {
      //allDocs works also, need to parse .rows*.doc.name
      //const allResp = await this.db.allDocs({startkey: 'instrSet_', endkey: 'instrSet_\uffff', 'include_docs': true});
      const queryResp = await this.query('storedInstr/listNames');
      return queryResp.rows.map(e => e.key);
    } catch (err) {
      //does not exist
      throw new Error(`Could not load stored instruction sets`);
    }
  }
  async addStoredInstructionSet(name: string, instructions: Array<{func: string}>): Promise<boolean> {
    if(!validInstructionSetName(name)) {
      throw new Error(`Invalid instruction set name ${name}. Make sure > 6 characters < 32.`)
    }
    if(instructions.length > 400) {
      throw new Error(`Instruction count is greater than ${400}.`)
    }
    if(instructions.length == 0) {
      throw new Error(`Instruction count is equal to ${0}.`)
    }
    let newObj: {_id: string, name: string, _rev?: string, instr?: Array<{func: string}> } = {_id: this.dbInstrId(name), name};
    try {
      const doc = await this.db.get(newObj._id);
      newObj._rev = doc._rev;
    } catch (err) {
      //does not exist
    }
    newObj.instr = instructions;
    try {
      const doc = await this.db.put(newObj);
    } catch (err) {
      throw new Error(`Cannot store instruction set for name ${name}`);
    }
    return true;
  }
  async getStoredInstructionSet(name: string): Promise<Array<{func: string}>>  {
    if(!validInstructionSetName(name)) {
      throw new Error(`Invalid instruction set name ${name}. `)
    }
    try {
      const doc = await this.db.get(this.dbInstrId(name));
      if(!doc.instr) {
        throw new Error(`Instructions not found in set`);
      }
      return doc.instr;
    } catch (err) {
      //does not exist
      throw new Error(`Cannot find instruction set for name ${name}`);
    }
  }
  async getStoredInstructionSetLog(name: string): Promise<InstructionsResponse | null>  {
    if(!validInstructionSetName(name)) {
      throw new Error(`Invalid instruction set name ${name}. `)
    }
    try {
      const doc = await this.db.get(this.dbInstrId(name));
    } catch(error) {
      throw new Error(`Cannot find instruction set for name ${name}`);
    }
    try {
      const doc = await this.db.get(this.dbNamedInstrLastExecId(name));
      const {resp, ...otherKeys} = doc;
      return resp;
    } catch (err) {
      //Does not exist
      return null;
    }
  }
  async execStoredInstructionSet(name: string): Promise<InstructionsResponse> {
    let resp = null;
    try {
      const instructions = await this.getStoredInstructionSet(name);
      resp = await this.executeInstructions(instructions);
    } catch(err) {
      throw err;
    }
    try {
      await this.updateLastNamedInstructionExec(name, resp);
    } catch(err) {
      //ignore
    }
    return resp;
  }

  async executeInstructions(instructions: Array<{func: string}>): Promise<InstructionsResponse> {
    let instResp : InstructionsResponse = {
      success: true,
      beginTime: new Date().toISOString(),
      completeTime: new Date().toISOString(),
      instructions: new Array(instructions.length).fill().map((val, index) : InstructionResponse => ({
        success: false,
        index
      }))
    }
    for(const k of instructions.keys()) {
      let returnValue: any = null;
      const instr = instructions[k];
      let error : Error | null = null;
      logger.info(`executing ${instr.func}`);
      switch (instr.func) {
        case 'stored': {
          const r = parseStored(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              const [name] = r;
              const resp = await this.execStoredInstructionSet(name);
              returnValue = resp;
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
          break;
        }
        case 'led': {
          const r = parseLed(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.write(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
          break;
        }
        case 'open': {
          const r = parseOpen(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.open(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
          break;
        }
        case 'mode': {
          const r = parseMode(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.mode(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'pud': {
          const r = parsePud(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.pud(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'read': {
          const r = parseRead(instr);
          let v = 0;
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              v = rpio.read(...r);
              returnValue = v;
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'readBuf': {
          const r = parseReadBuf(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              let [pin, buff] = r;
              returnValue = buff;
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'write': {
          const r = parseWrite(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.write(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'writeBuf': {
          const r = parseWriteBuf(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.writebuf(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'pwmSetClockDivider': {
          const r = parsePwmClockDivider(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.pwmSetClockDivider(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'pwmSetRange': {
          const r = parsePwmRange(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.pwmSetRange(...r);
            } catch(e) {
              error = Error(`${instr.func}: Ensure correct pins 16 or 18 and value`);
            }
          }
        break;
        }
        case 'pwmSetData': {
          const r = parsePwmData(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.pwmSetData(...r);
            } catch(e) {
              error = Error(`${instr.func}: Ensure correct pins 16 or 18 and value`);
            }
          }
        break;
        }
        case 'i2cBegin': {
          try {
            const ret = rpio.i2cBegin();
            if(typeof ret !== 'undefined' && ret !== 1) {
              error = Error(`${instr.func}: Error setting up i2c`);
            }
          } catch(e) {
            error = Error(`${instr.func}: Error executing ${e.message}`);
          }
        break;
        }
        case 'i2cSetSlaveAddress': {
          const r = parseI2cSetSlaveAddress(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.i2cSetSlaveAddress(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'i2cSetBaudRate': {
          const r = parseI2cSetBaudrate(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.i2cSetBaudRate(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'i2cRead': {
          const r = parseI2cRead(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              let [buff] = r;
              const ret = rpio.i2cRead(...r);
              if(typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                error = Error(`${instr.func}: Error executing i2c read with code ${ret}`);
              } else {
                returnValue = buff;
              }
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'i2cWrite': {
          const r = parseI2cWrite(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              const ret = rpio.i2cWrite(...r);
              if(typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                error = Error(`${instr.func}: Error executing i2c write with code ${ret}`);
              }
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'i2cUpdateReg': {
          const r = parseI2cUpdateReg(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            const [reg, mask, value] = r;
            let readBuf = Buffer.alloc(value.length);
            let newValue = Buffer.alloc(value.length);
            try {
              let ret = rpio.i2cWrite(reg);
              if(typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                error = Error(`${instr.func}: Error executing i2c write with code ${ret}`);
                break;
              }
              ret = rpio.i2cRead(readBuf);
              if(typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                error = Error(`${instr.func}: Error executing i2c read with code ${ret}`);
                break;
              }
              for(let i = 0; i < value.length; i++) {
                newValue.writeUInt8((readBuf.readUInt8(i) & ~mask.readUInt8(i)) | (value.readUInt8(i) & mask.readUInt8(i)), i);
              }
              ret = rpio.i2cWrite(Buffer.concat([reg, newValue]));
              if(typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                error = Error(`${instr.func}: Error executing i2c write with code ${ret}`);
              } else {
                returnValue = newValue;
              }
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'i2cEnd': {
          try {
            rpio.i2cEnd();
          } catch(e) {
            error = Error(`${instr.func}: Error executing ${e.message}`);
          }
        break;
        }
        case 'spiBegin': {
          try {
            const ret = rpio.spiBegin();
            if(typeof ret !== 'undefined' && ret !== 1) {
              error = Error(`${instr.func}: Error setting up spi`);
            }
            rpio.spiChipSelect(0); //only one possible with board
          } catch(e) {
            error = Error(`${instr.func}: Error executing ${e.message}`);
          }
        break;
        }
        case 'spiSetCSPolarity': {
          const r = parseSpiSetCSPolarity(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.spiSetCSPolarity(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'spiSetClockDivider': {
          const r = parseSpiSetClockDivider(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.spiSetClockDivider(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'spiSetDataMode': {
          const r = parseSpiSetDataMode(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.spiSetDataMode(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'spiTransfer': {
          const r = parseSpiTransfer(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              const [writeBuf] = r;
              let readBuf = Buffer.alloc(writeBuf.length);
              rpio.spiTransfer(writeBuf, readBuf, writeBuf.length);
              returnValue = readBuf;
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'spiWrite': {
          const r = parseSpiWrite(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              const [writeBuf] = r;
              rpio.spiWrite(writeBuf, writeBuf.length);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'spiEnd': {
          try {
            rpio.spiEnd();
          } catch(e) {
            error = Error(`${instr.func}: Error executing ${e.message}`);
          }
        break;
        }
        case 'sleep': {
          const r = parseSleep(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.sleep(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
        case 'msleep': {
          const r = parseMSleep(instr);
          if(r instanceof Error) {
            error = Error(`${instr.func}: ${r.message}`);
          } else {
            try {
              rpio.msleep(...r);
            } catch(e) {
              error = Error(`${instr.func}: Error executing ${e.message}`);
            }
          }
        break;
        }
      }
      if(error) {
        instResp.success = false;
        instResp.instructions[k].error = error.message;
        break;
      } else {
        instResp.instructions[k].success = true;
        if(returnValue !== null) {
          if(Buffer.isBuffer(returnValue)) {
            instResp.instructions[k].returnValue = returnValue.toString('base64');
          } else {
            instResp.instructions[k].returnValue = returnValue;
          }
        }
      }
    } //end for instructions
    instResp.completeTime = new Date().toISOString();
    return instResp;

  }
}
const instructionHandler = new InstructionHandler();
export default instructionHandler;
