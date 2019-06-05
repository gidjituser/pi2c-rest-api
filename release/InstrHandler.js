"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.InstructionHandler = void 0;

var _parsers = require("./util/parsers");

var _logger = require("./logger");

var _rpio = _interopRequireDefault(require("rpio"));

var _pouchdb = _interopRequireDefault(require("pouchdb"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = require('debug')('instr:handler');

const sleep = require('util').promisify(setTimeout);

const bcm2835I2CReasonCodes = {
  BCM2835_I2C_REASON_OK: 0x00,
  BCM2835_I2C_REASON_ERROR_NACK: 0x01,
  BCM2835_I2C_REASON_ERROR_CLKT: 0x02,
  BCM2835_I2C_REASON_ERROR_DATA: 0x04
};

class InstructionHandler {
  constructor() {
    _defineProperty(this, "db", void 0);

    _defineProperty(this, "views", void 0);

    _defineProperty(this, "viewVersion", void 0);

    const dbPath = process.env.DB_PATH || '/data/db';

    _mkdirp.default.sync(dbPath);

    this.db = new _pouchdb.default(`${_path.default.join(dbPath, 'instr')}`);
    this.viewVersion = null;
    this.views = {
      storedInstr: {
        listNames: {
          map: function (doc) {
            if (doc.name && doc._id.startsWith('instrSet_')) {
              emit(doc.name, doc._id);
            }
          }.toString()
        }
      }
    };
    this.setup().then(() => {}).catch(err => {});
  }

  query(view, params) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const namespace = view.split('/')[0];

      try {
        const ret = yield _this.db.query(view, params);
        return ret;
      } catch (err) {
        if (!_this.views[namespace]) {
          throw new Error(`View ${namespace} is not defined.`);
        } // if view doesn't exist, create it, and try again


        if (err.status === 404) {
          try {
            yield _this.db.put({
              _id: `_design/${namespace}`,
              views: _this.views[namespace]
            });
            return yield _this.db.query(view, params);
          } catch (subError) {
            throw subError;
          }
        }
      }
    })();
  }

  setupViewsForQuery() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let viewVersion = {
        _id: 'instrViewsVersion',
        version: 4
      };
      let removeViews = false;

      if (_this2.viewVersion === null) {
        try {
          const curr = yield _this2.db.get(viewVersion._id);

          if (curr.version !== viewVersion.version) {
            viewVersion._rev = curr._rev;
            removeViews = true;
            yield _this2.db.put(viewVersion);
          }
        } catch (err) {
          try {
            yield _this2.db.put(viewVersion);
          } catch (subError) {//ignore
          }
        }
      }

      _this2.viewVersion = viewVersion.version;

      if (removeViews) {
        const allViews = yield _this2.db.allDocs({
          startkey: '_design/',
          endkey: '_design/\uffff'
        });

        for (const k of allViews.rows) {
          try {
            const doc = yield _this2.db.get(k.id);
            yield _this2.db.remove(doc);
          } catch (error) {//ignore
          }
        }
      }
    })();
  }

  setup() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3.setupViewsForQuery();

      try {
        _rpio.default.open(_parsers.RED_LED_PIN, _rpio.default.OUTPUT, _rpio.default.LOW);

        _rpio.default.open(_parsers.GREEN_LED_PIN, _rpio.default.OUTPUT, _rpio.default.LOW);

        const instructions = yield _this3.getStoredInstructionSet(`initialize`);
        const resp = yield _this3.executeInstructions(instructions);
        yield _this3.updateLastNamedInstructionExec(`initialize`, resp);

        _rpio.default.write(_parsers.RED_LED_PIN, _rpio.default.HIGH);

        yield sleep(1000);

        _rpio.default.write(_parsers.RED_LED_PIN, _rpio.default.LOW);
      } catch (error) {//No initialize instruction set
      }
    })();
  }

  dbNamedInstrLastExecId(name) {
    return `instrNamedExec_${name}`;
  }

  dbInstrId(name) {
    return `instrSet_${name}`;
  }
  /*
  Log the last occurence of each named set execution
  */


  updateLastNamedInstructionExec(name, instructionResponse) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (!(0, _parsers.validInstructionSetName)(name)) {
        return false;
      }

      let newObj = {
        _id: _this4.dbNamedInstrLastExecId(name),
        name
      };

      try {
        const doc = yield _this4.db.get(newObj._id);
        newObj._rev = doc._rev;
      } catch (err) {//does not exist
      }

      newObj.resp = instructionResponse;

      try {
        const doc = yield _this4.db.put(newObj);
      } catch (err) {
        //Ignore errors here, should still be able to work without updating instr logs
        return false; //throw new Error(`Cannot store last executed instruction set response for name ${name}`);
      }

      return true;
    })();
  }

  getNamesOfInstructionSets() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      try {
        //allDocs works also, need to parse .rows*.doc.name
        //const allResp = await this.db.allDocs({startkey: 'instrSet_', endkey: 'instrSet_\uffff', 'include_docs': true});
        const queryResp = yield _this5.query('storedInstr/listNames');
        return queryResp.rows.map(e => e.key);
      } catch (err) {
        //does not exist
        throw new Error(`Could not load stored instruction sets`);
      }
    })();
  }

  addStoredInstructionSet(name, instructions) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!(0, _parsers.validInstructionSetName)(name)) {
        throw new Error(`Invalid instruction set name ${name}. Make sure > 6 characters < 32.`);
      }

      if (instructions.length > 400) {
        throw new Error(`Instruction count is greater than ${400}.`);
      }

      if (instructions.length == 0) {
        throw new Error(`Instruction count is equal to ${0}.`);
      }

      let newObj = {
        _id: _this6.dbInstrId(name),
        name
      };

      try {
        const doc = yield _this6.db.get(newObj._id);
        newObj._rev = doc._rev;
      } catch (err) {//does not exist
      }

      newObj.instr = instructions;

      try {
        const doc = yield _this6.db.put(newObj);
      } catch (err) {
        throw new Error(`Cannot store instruction set for name ${name}`);
      }

      return true;
    })();
  }

  getStoredInstructionSet(name) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      if (!(0, _parsers.validInstructionSetName)(name)) {
        throw new Error(`Invalid instruction set name ${name}. `);
      }

      try {
        const doc = yield _this7.db.get(_this7.dbInstrId(name));

        if (!doc.instr) {
          throw new Error(`Instructions not found in set`);
        }

        return doc.instr;
      } catch (err) {
        //does not exist
        throw new Error(`Cannot find instruction set for name ${name}`);
      }
    })();
  }

  getStoredInstructionSetLog(name) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      if (!(0, _parsers.validInstructionSetName)(name)) {
        throw new Error(`Invalid instruction set name ${name}. `);
      }

      try {
        const doc = yield _this8.db.get(_this8.dbInstrId(name));
      } catch (error) {
        throw new Error(`Cannot find instruction set for name ${name}`);
      }

      try {
        const doc = yield _this8.db.get(_this8.dbNamedInstrLastExecId(name));
        const {
          resp,
          ...otherKeys
        } = doc;
        return resp;
      } catch (err) {
        //Does not exist
        return null;
      }
    })();
  }

  execStoredInstructionSet(name) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      let resp = null;

      try {
        const instructions = yield _this9.getStoredInstructionSet(name);
        resp = yield _this9.executeInstructions(instructions);
      } catch (err) {
        throw err;
      }

      try {
        yield _this9.updateLastNamedInstructionExec(name, resp);
      } catch (err) {//ignore
      }

      return resp;
    })();
  }

  executeInstructions(instructions) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      let instResp = {
        success: true,
        beginTime: new Date().toISOString(),
        completeTime: new Date().toISOString(),
        instructions: new Array(instructions.length).fill().map((val, index) => ({
          success: false,
          index
        }))
      };

      for (const k of instructions.keys()) {
        let returnValue = null;
        const instr = instructions[k];
        let error = null;

        _logger.logger.info(`executing ${instr.func}`);

        switch (instr.func) {
          case 'stored':
            {
              const r = (0, _parsers.parseStored)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  const [name] = r;
                  const resp = yield _this10.execStoredInstructionSet(name);
                  returnValue = resp;
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'led':
            {
              const r = (0, _parsers.parseLed)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.write(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'open':
            {
              const r = (0, _parsers.parseOpen)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.open(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'mode':
            {
              const r = (0, _parsers.parseMode)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.mode(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'pud':
            {
              const r = (0, _parsers.parsePud)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.pud(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'read':
            {
              const r = (0, _parsers.parseRead)(instr);
              let v = 0;

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  v = _rpio.default.read(...r);
                  returnValue = v;
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'readBuf':
            {
              const r = (0, _parsers.parseReadBuf)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  let [pin, buff] = r;
                  returnValue = buff;
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'write':
            {
              const r = (0, _parsers.parseWrite)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.write(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'writeBuf':
            {
              const r = (0, _parsers.parseWriteBuf)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.writebuf(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'pwmSetClockDivider':
            {
              const r = (0, _parsers.parsePwmClockDivider)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.pwmSetClockDivider(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'pwmSetRange':
            {
              const r = (0, _parsers.parsePwmRange)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.pwmSetRange(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Ensure correct pins 16 or 18 and value`);
                }
              }

              break;
            }

          case 'pwmSetData':
            {
              const r = (0, _parsers.parsePwmData)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.pwmSetData(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Ensure correct pins 16 or 18 and value`);
                }
              }

              break;
            }

          case 'i2cBegin':
            {
              try {
                const ret = _rpio.default.i2cBegin();

                if (typeof ret !== 'undefined' && ret !== 1) {
                  error = Error(`${instr.func}: Error setting up i2c`);
                }
              } catch (e) {
                error = Error(`${instr.func}: Error executing ${e.message}`);
              }

              break;
            }

          case 'i2cSetSlaveAddress':
            {
              const r = (0, _parsers.parseI2cSetSlaveAddress)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.i2cSetSlaveAddress(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'i2cSetBaudRate':
            {
              const r = (0, _parsers.parseI2cSetBaudrate)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.i2cSetBaudRate(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'i2cRead':
            {
              const r = (0, _parsers.parseI2cRead)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  let [buff] = r;

                  const ret = _rpio.default.i2cRead(...r);

                  if (typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                    error = Error(`${instr.func}: Error executing i2c read with code ${ret}`);
                  } else {
                    returnValue = buff;
                  }
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'i2cWrite':
            {
              const r = (0, _parsers.parseI2cWrite)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  const ret = _rpio.default.i2cWrite(...r);

                  if (typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                    error = Error(`${instr.func}: Error executing i2c write with code ${ret}`);
                  }
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'i2cUpdateReg':
            {
              const r = (0, _parsers.parseI2cUpdateReg)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                const [reg, mask, value] = r;
                let readBuf = Buffer.alloc(value.length);
                let newValue = Buffer.alloc(value.length);

                try {
                  let ret = _rpio.default.i2cWrite(reg);

                  if (typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                    error = Error(`${instr.func}: Error executing i2c write with code ${ret}`);
                    break;
                  }

                  ret = _rpio.default.i2cRead(readBuf);

                  if (typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                    error = Error(`${instr.func}: Error executing i2c read with code ${ret}`);
                    break;
                  }

                  for (let i = 0; i < value.length; i++) {
                    newValue.writeUInt8(readBuf.readUInt8(i) & ~mask.readUInt8(i) | value.readUInt8(i) & mask.readUInt8(i), i);
                  }

                  ret = _rpio.default.i2cWrite(Buffer.concat([reg, newValue]));

                  if (typeof ret !== 'undefined' && ret !== bcm2835I2CReasonCodes.BCM2835_I2C_REASON_OK) {
                    error = Error(`${instr.func}: Error executing i2c write with code ${ret}`);
                  } else {
                    returnValue = newValue;
                  }
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'i2cEnd':
            {
              try {
                _rpio.default.i2cEnd();
              } catch (e) {
                error = Error(`${instr.func}: Error executing ${e.message}`);
              }

              break;
            }

          case 'spiBegin':
            {
              try {
                const ret = _rpio.default.spiBegin();

                if (typeof ret !== 'undefined' && ret !== 1) {
                  error = Error(`${instr.func}: Error setting up spi`);
                }

                _rpio.default.spiChipSelect(0); //only one possible with board

              } catch (e) {
                error = Error(`${instr.func}: Error executing ${e.message}`);
              }

              break;
            }

          case 'spiSetCSPolarity':
            {
              const r = (0, _parsers.parseSpiSetCSPolarity)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.spiSetCSPolarity(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'spiSetClockDivider':
            {
              const r = (0, _parsers.parseSpiSetClockDivider)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.spiSetClockDivider(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'spiSetDataMode':
            {
              const r = (0, _parsers.parseSpiSetDataMode)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.spiSetDataMode(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'spiTransfer':
            {
              const r = (0, _parsers.parseSpiTransfer)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  const [writeBuf] = r;
                  let readBuf = Buffer.alloc(writeBuf.length);

                  _rpio.default.spiTransfer(writeBuf, readBuf, writeBuf.length);

                  returnValue = readBuf;
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'spiWrite':
            {
              const r = (0, _parsers.parseSpiWrite)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  const [writeBuf] = r;

                  _rpio.default.spiWrite(writeBuf, writeBuf.length);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'spiEnd':
            {
              try {
                _rpio.default.spiEnd();
              } catch (e) {
                error = Error(`${instr.func}: Error executing ${e.message}`);
              }

              break;
            }

          case 'sleep':
            {
              const r = (0, _parsers.parseSleep)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.sleep(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }

          case 'msleep':
            {
              const r = (0, _parsers.parseMSleep)(instr);

              if (r instanceof Error) {
                error = Error(`${instr.func}: ${r.message}`);
              } else {
                try {
                  _rpio.default.msleep(...r);
                } catch (e) {
                  error = Error(`${instr.func}: Error executing ${e.message}`);
                }
              }

              break;
            }
        }

        if (error) {
          instResp.success = false;
          instResp.instructions[k].error = error.message;
          break;
        } else {
          instResp.instructions[k].success = true;

          if (returnValue !== null) {
            if (Buffer.isBuffer(returnValue)) {
              instResp.instructions[k].returnValue = returnValue.toString('base64');
            } else {
              instResp.instructions[k].returnValue = returnValue;
            }
          }
        }
      } //end for instructions


      instResp.completeTime = new Date().toISOString();
      return instResp;
    })();
  }

}

exports.InstructionHandler = InstructionHandler;
const instructionHandler = new InstructionHandler();
var _default = instructionHandler;
exports.default = _default;
//# sourceMappingURL=InstrHandler.js.map
