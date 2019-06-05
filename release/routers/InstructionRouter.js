"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _save = _interopRequireWildcard(require("../util/save"));

var _parsers = require("../util/parsers");

var _logger = require("../logger");

var _rpio = _interopRequireDefault(require("rpio"));

var _InstrHandler = _interopRequireDefault(require("../InstrHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = require('debug')('instr:router');

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class InstructionRouter {
  // these fields must be type annotated, or Flow will complain!
  // take the mount path as the constructor argument
  constructor(path = '/api/v1/instr') {
    _defineProperty(this, "router", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "execPost", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        const received = (0, _parsers.parseInstructions)(req.body);

        if (!received) {
          res.status(400).json({
            code: 400,
            message: 'Bad Request. Make sure that you submit valid Instructions.'
          });

          _logger.logger.error('Malformed POST to /exec.');

          return;
        }

        const newInstructions = req.body;
        let instResp = yield _InstrHandler.default.executeInstructions(newInstructions);
        res.status(200).json(instResp);
      });

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "addStored", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        const received = (0, _parsers.parseInstructions)(req.body);

        if (!received) {
          res.status(400).json({
            code: 400,
            message: 'Bad Request. Make sure that you submit valid Instructions.'
          });

          _logger.logger.error('Malformed POST to /stored.');

          return;
        }

        const newInstructions = req.body;

        try {
          const succ = yield _InstrHandler.default.addStoredInstructionSet(req.params.instructionsName, newInstructions);
          res.status(200).json({
            success: succ ? true : false
          });
        } catch (error) {
          res.status(200).json({
            success: false,
            error: {
              message: error.message,
              code: -1
            }
          });
        }
      });

      return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "getStored", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        try {
          const instr = yield _InstrHandler.default.getStoredInstructionSet(req.params.instructionsName);
          res.status(200).json(instr);
        } catch (error) {
          res.status(200).json([]);
        }
      });

      return function (_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "getStoredLog", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        try {
          const log = yield _InstrHandler.default.getStoredInstructionSetLog(req.params.instructionsName);

          if (log) {
            res.status(200).json({
              hasLog: true,
              log
            });
          } else {
            res.status(200).json({
              hasLog: false
            });
          }
        } catch (error) {
          res.status(200).json({
            hasLog: 'false',
            error: {
              message: error.message,
              code: -1
            }
          });
        }
      });

      return function (_x10, _x11, _x12) {
        return _ref4.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "getStoredList", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        try {
          const list = yield _InstrHandler.default.getNamesOfInstructionSets();
          res.status(200).json(list);
        } catch (error) {
          res.status(200).json([]);
        }
      });

      return function (_x13, _x14, _x15) {
        return _ref5.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "execStored", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        try {
          const resp = yield _InstrHandler.default.execStoredInstructionSet(req.params.instructionsName);
          res.status(200).json(resp);
        } catch (error) {
          res.status(400).json({
            code: 400,
            message: `Bad Request. ${error.message}.`
          });
        }
      });

      return function (_x16, _x17, _x18) {
        return _ref6.apply(this, arguments);
      };
    }()));

    // instantiate the express.Router
    this.router = (0, _express.Router)();
    this.path = path; // glue it all together

    this.init();
    let initConfig = {
      gpiomem: false,

      /* Use /dev/gpiomem */
      mapping: 'physical'
      /* Use the P1-P40 numbering scheme */

    };

    if (process.platform === 'darwin') {
      initConfig = { ...initConfig,
        mock: 'raspi-3'
      };
    }

    _rpio.default.init(initConfig); //const InstructionsType = (reify: Type<Instructions>);
    //console.log(InstructionsType.toString(true)); // No errors

  }

  /**
   * Attach route handlers to their endpoints.
   */
  init() {
    this.router.post('/exec', this.execPost);
    this.router.get('/stored', this.getStoredList);
    this.router.post('/stored/:instructionsName', this.addStored);
    this.router.get('/stored/:instructionsName', this.getStored);
    this.router.get('/stored/:instructionsName/log', this.getStoredLog);
    this.router.post('/stored/:instructionsName/exec', this.execStored);
  }

}

exports.default = InstructionRouter;
//# sourceMappingURL=InstructionRouter.js.map
