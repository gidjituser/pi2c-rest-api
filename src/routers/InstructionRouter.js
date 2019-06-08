// @flow
import type {Instructions, InstructionsResponse, InstructionResponse} from '../types';
import type { $Request, $Response, NextFunction }  from 'express';
import { Router }  from 'express';
import { parseInstructions, parseStoredInstructions, parseOpen, parseMode }
from '../util/parsers';
import { logger } from '../logger';
const debug = require('debug')('instr:router');
import rpio from 'rpio'
import instructionHandler from '../InstrHandler'


const asyncMiddleware = fn =>
  (req : $Request, res : $Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

export default class InstructionRouter {
  // these fields must be type annotated, or Flow will complain!
  router: Router;
  path: string;

  // take the mount path as the constructor argument
  constructor(path: string = '/api/v1/instr') {
    // instantiate the express.Router
    this.router = Router();
    this.path = path;
    // glue it all together
    this.init();
    let initConfig = {
      gpiomem: false,          /* Use /dev/gpiomem */
      mapping: 'physical',    /* Use the P1-P40 numbering scheme */
    }
    if(process.platform === 'darwin') {
      initConfig = {...initConfig, mock: 'raspi-3' };
    }
    rpio.init(initConfig);
    //const InstructionsType = (reify: Type<Instructions>);
    //console.log(InstructionsType.toString(true)); // No errors
  }

  execPost = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    const received:  boolean = parseInstructions(req.body);
    if (!received) {
      res.status(400).json({
        code: 400,
        message: 'Bad Request. Make sure that you submit valid Instructions.'
      });
      logger.error('Malformed POST to /exec.');
      return;
    }
    const newInstructions = (req.body : Array<{func: string}>);
    let instResp : InstructionsResponse = await instructionHandler.executeInstructions(newInstructions);
    res.status(200).json(
      instResp
    );
  })
  addStored = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    const received:  boolean = parseInstructions(req.body);
    if (!received) {
      res.status(400).json({
        code: 400,
        message: 'Bad Request. Make sure that you submit valid Instructions.'
      });
      logger.error('Malformed POST to /stored.');
      return;
    }
    const newInstructions = (req.body : Array<{func: string}>);
    try {
      const succ = await instructionHandler.addStoredInstructionSet(req.params.instructionsName, newInstructions);
      res.status(200).json({
        success: (succ) ? true : false
      });
    } catch(error) {
      res.status(200).json({
        success: false,
        error: {message: error.message, code: -1}
      });
    }
  })
  getStored = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    try {
      const instr = await instructionHandler.getStoredInstructionSet(req.params.instructionsName);
      res.status(200).json(instr);
    } catch(error) {
      res.status(200).json([]);
    }

  });
  getStoredLog = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    try {
      const log = await instructionHandler.getStoredInstructionSetLog(req.params.instructionsName);
      if(log) {
        res.status(200).json({hasLog: true, log});
      } else {
        res.status(200).json({hasLog: false});
      }
    } catch(error) {
      res.status(200).json(
        {
          hasLog: 'false',
          error: {message: error.message, code: -1}
        });
    }

  });
  getStoredList = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    try {
      const list = await instructionHandler.getNamesOfInstructionSets();
      res.status(200).json(list);
    } catch(error) {
      res.status(200).json([]);
    }
  });
  execStored = asyncMiddleware(async (req, res, next) => { //(req: $Request, res: $Response): void {
    try {
      const resp = await instructionHandler.execStoredInstructionSet(req.params.instructionsName);
      res.status(200).json(resp);
    } catch(error) {
      res.status(400).json({
        code: 400,
        message: `Bad Request. ${error.message}.`
      });
    }

  });
  /**
   * Attach route handlers to their endpoints.
   */
  init(): void {
    this.router.post('/exec', this.execPost);
    this.router.get('/stored', this.getStoredList);
    this.router.post('/stored/:instructionsName', this.addStored);
    this.router.get('/stored/:instructionsName', this.getStored);
    this.router.get('/stored/:instructionsName/log', this.getStoredLog);
    this.router.post('/stored/:instructionsName/exec', this.execStored);
  }

}
