// @flow
import type { $Request, $Response, NextFunction }  from 'express';
import { Router }  from 'express';
const debug = require('debug')('wifi:router');
import generalHandler from '../GeneralHandler'
const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

const asyncMiddleware = fn =>
  (req : $Request, res : $Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

function isObject(obj) {
  return obj === Object(obj);
}

function parseSettings(input: any): {password?: string, name?: string, webURL?: string} | Error {
  let retObj = {};
  if(!isObject(input)) {
    return Error(`Invalid settings object. Need {"name": "Some name", "password": "wifi passphrase"}`);
  }
  if(input.name !== undefined && typeof input.name === 'string') {
    if(input.name.length > 32 || input.name.length < 5) {
      return Error(`Invalid name length. Should be < 33 and > 4`);
    }
    retObj.name = input.name;
  }
  if(input.password !== undefined && typeof input.password === 'string') {
    if(input.password.length > 32 || input.password.length < 5) {
      return Error(`Invalid password length. Should be < 33 and > 4`);
    }
    retObj.password = input.password;
  }
  if(input.webURL !== undefined && typeof input.webURL === 'string') {
    if(input.webURL.length > 512 || input.webURL.length < 5) {
      return Error(`Invalid webURL length. Should be < 513 and > 4`);
    }
    retObj.webURL = input.webURL;
  }
  return retObj;
}
export default class GeneralRouter {
  // these fields must be type annotated, or Flow will complain!
  router: Router;
  path: string;

  // take the mount path as the constructor argument
  constructor(path: string = '/api/v1') {
    // instantiate the express.Router
    this.router = Router();
    this.path = path;
    // glue it all together
    this.init();
  }

  getGeneralSettings = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    //Do not return password
    const {password, ...settings} = generalHandler.settings;
    res.status(200).json(settings);
  })
  updateGeneralSettings = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    const received = parseSettings(req.body);
    if(received instanceof Error) {
      res.status(400).json({
        code: 400,
        message: received.message
      });
      logger.error('Malformed POST to settings update.');
      return;
    }
    try {
      const succ = await generalHandler.updateGeneralSettings(received);
      if(succ) {
        res.status(200).json({
          success: true
        });
      } else {
        res.status(200).json({
          success: false,
          error: { code: -2, message: 'Could not update the settings' }
        });
      }
    } catch(error) {
      res.status(200).json({
        success: false,
        error: {message: 'Unknown exception while updating settings', code: -1}
      });
    }
  });
  getVersion = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    res.status(200).json({
      "version": generalHandler.version
    });
  });
  /**
   * Attach route handlers to their endpoints.
   */
  init(): void {
    this.router.post('/general', this.updateGeneralSettings);
    this.router.get('/general', this.getGeneralSettings);
    this.router.get('/version', this.getVersion);
  }

}
