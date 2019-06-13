// @flow

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import generalHandler from './GeneralHandler'
const cors = require('cors');
const auth = require('basic-auth');
const compare = require('tsscmp')
import { logger } from './logger';


import InstructionRouter from './routers/InstructionRouter';
import GeneralRouter from './routers/GeneralRouter';

export default class Api {

  // annotate with the express $Application type
  express: express$Application;

  // create the express instance, attach app-level middleware, attach routers
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // register middlewares
  middleware(): void {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: false}));
    this.express.use(cors());
    // $FlowFixMe: express libdef issue
    this.express.use((req, res, next) => {
      //If localhost or link local allow without authorization header (Authorization: Basic <_base64_token_>)
      // <_base64_token_> is username:password in base64 format
      let ip = req.ip;
      logger.info(`Received request from ${ip}`);
      if (req.ip && req.ip.startsWith('::ffff:')) {
        ip = req.ip.substr(7);
      }
      if(ip && (ip.startsWith('169.254.') || ip.startsWith('fe80::') || ip === '::1' || ip === '127.0.0.1')) {
        next();
        return;
      }
      if(generalHandler.settings.password.length === 0 || generalHandler.settings.password === 'none') {
        next();
        return;
      }
      const credentials = auth(req);
      if(!credentials || !credentials.pass || typeof credentials.pass !== 'string' || !compare(credentials.pass, generalHandler.settings.password)) {
        res.set('WWW-Authenticate', 'Basic realm="401"') // change this
        res.status(401).json({message:'Password Authentication required.', code: 4}) // custom message
        return
      }
      next()
    })
  }
  // connect resource routers
  routes(): void {
    const instructionRouter = new InstructionRouter();
    const generalRouter = new GeneralRouter();
    // attach it to our express app
    this.express.use(instructionRouter.path, instructionRouter.router);
    this.express.use(generalRouter.path, generalRouter.router);
  }

}
