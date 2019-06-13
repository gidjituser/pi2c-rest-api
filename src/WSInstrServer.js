//@flow
import type {Instructions, InstructionsResponse, InstructionResponse} from './types';
import type { $Request, $Response, NextFunction }  from 'express';
import { parseInstructions } from './util/parsers';
import { logger } from './logger';
import instructionHandler from './InstrHandler'

const WebSocket = require('ws');

const debug = require('debug')('ws:instr');

module.exports = class WSInstrServer {
  wsServer: any
  constructor() {
    this.wsServer = null;
  }
  setup(httpServer: http.Server) {
    //this.wsServer = new WebSocket.Server({ server:  port: process.env.WS_PORT || 8080 });
    this.wsServer = new WebSocket.Server({ path: "/ws/instr/exec", server: httpServer });
    this.wsServer.on('connection', (ws, request) => {
      if(request.connection && typeof request.connection.remoteAddress === 'string') {
        logger.info(`WS Server connection from ${request.connection.remoteAddress}`);
      }
      ws.on('message', (message) => {
				debug(`WSMESSAGE ${message}`);
        if (typeof message === 'string') {
          try {
            const val = JSON.parse(message);
            const received:  boolean = parseInstructions(val);
            if (!received) {
              ws.send(JSON.stringify({
                code: 400,
                message: 'Bad Request. Make sure that you submit valid Instructions. Array of Instruction stringified' 
              }));
              logger.error('Malformed WS message');
              return;
            }
            const newInstructions = (val : Array<{func: string}>);
            instructionHandler.executeInstructions(newInstructions).then(instrResp => {
              ws.send(JSON.stringify(instrResp));
            }).catch(error => {
              ws.send(JSON.stringify({
                code: 401,
                message: `Could not execute instructions ${error.message}`
              }));
            });
          } catch(error) {
            ws.send(JSON.stringify({
              code: 402,
              message: `Bad Request. Could not parse instructions. Require array of Instruction stringified. ${error.message}`
            }));
          }
        } else {
            ws.send(JSON.stringify({
              code: 400,
              message: `Cannot process data with type ${typeof message}`
            }));
        }
      });
    });
  }
  close() {
		if(this.wsServer) {
			this.wsServer.close((error) => {

      });
			this.wsServer = null;
		}
  }
}
