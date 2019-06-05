//@flow

import { logger } from './logger';
import PouchDB from 'pouchdb';
import mkdirp from 'mkdirp';
import path from 'path';

const debug = require('debug')('gen:handler');
const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);
const packageVersion = require('../package.json').version;

export class GeneralHandler {
  db: PouchDB;
  version: string;
  settings: {
    password: string,
    webURL: string,
    name: string
  }
  dbGeneralKeyId: string
  constructor() {
    const dbPath = process.env.DB_PATH || '/data/db'
    mkdirp.sync(dbPath);
    this.dbGeneralKeyId = `generalConfig`;
    this.version = process.env.APP_VERSION || packageVersion;
    this.settings = {
      webURL: "",
      password: "",
      name: ""
    }
    this.db = new PouchDB(`${path.join(dbPath, 'general')}`);
    this.setup().then(() => {

    }).catch((err) => {

    })
  }
  async setup() {
    try {
      const gen = await this.db.get(this.dbGeneralKeyId);
      const {password, name, webURL} = gen;
      this.settings = {...this.settings, password, name, webURL};
    } catch(error) {
      //await this.db.put({_id: this.dbGeneralKeyId, password: this.settings.password, name: this.settings.name, webURL: this.settings.webURL});
      try {
        await this.db.put({_id: this.dbGeneralKeyId, ...this.settings});
      } catch(subErr) {
        //ignore
      }
      //No initialize instruction set
    }
  }
  async updateGeneralSettings(newSettings: {}) : Promise<boolean> {
    const obj = {...this.settings, ...newSettings};
    let newObj: {_id: string, _rev?: string, name: string, webURL: string, password: string} =
      {_id: this.dbGeneralKeyId, ...obj};
    try {
      const doc = await this.db.get(this.dbGeneralKeyId);
      newObj._rev = doc._rev;
    } catch (err) {
      //does not exist
    }
    try {
      const doc = await this.db.put(newObj);
      await this.setup();
    } catch (err) {
      //Ignore errors here, should still be able to work without updating instr logs
      return false;
      //throw new Error(`Cannot store last executed instruction set response for name ${name}`);
    }
    return true;
  }
}
const generalHandler = new GeneralHandler();
export default generalHandler;
