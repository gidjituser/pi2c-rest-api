"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _GeneralHandler = _interopRequireDefault(require("../GeneralHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = require('debug')('wifi:router');

const util = require('util');

const path = require('path');

const exec = util.promisify(require('child_process').exec);

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function isObject(obj) {
  return obj === Object(obj);
}

function parseSettings(input) {
  let retObj = {};

  if (!isObject(input)) {
    return Error(`Invalid settings object. Need {"name": "Some name", "password": "wifi passphrase"}`);
  }

  if (input.name !== undefined && typeof input.name === 'string') {
    if (input.name.length > 32 || input.name.length < 5) {
      return Error(`Invalid name length. Should be < 33 and > 4`);
    }

    retObj.name = input.name;
  }

  if (input.password !== undefined && typeof input.password === 'string') {
    if (input.password.length > 32 || input.password.length < 5) {
      return Error(`Invalid password length. Should be < 33 and > 4`);
    }

    retObj.password = input.password;
  }

  if (input.webURL !== undefined && typeof input.webURL === 'string') {
    if (input.webURL.length > 512 || input.webURL.length < 5) {
      return Error(`Invalid webURL length. Should be < 513 and > 4`);
    }

    retObj.webURL = input.webURL;
  }

  return retObj;
}

class GeneralRouter {
  // these fields must be type annotated, or Flow will complain!
  // take the mount path as the constructor argument
  constructor(path = '/api/v1') {
    _defineProperty(this, "router", void 0);

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "getGeneralSettings", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        //Do not return password
        const {
          password,
          ...settings
        } = _GeneralHandler.default.settings;
        res.status(200).json(settings);
      });

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "updateGeneralSettings", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        const received = parseSettings(req.body);

        if (received instanceof Error) {
          res.status(400).json({
            code: 400,
            message: received.message
          });
          logger.error('Malformed POST to settings update.');
          return;
        }

        try {
          const succ = yield _GeneralHandler.default.updateGeneralSettings(received);

          if (succ) {
            res.status(200).json({
              success: true
            });
          } else {
            res.status(200).json({
              success: false,
              error: {
                code: -2,
                message: 'Could not update the settings'
              }
            });
          }
        } catch (error) {
          res.status(200).json({
            success: false,
            error: {
              message: 'Unknown exception while updating settings',
              code: -1
            }
          });
        }
      });

      return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }()));

    _defineProperty(this, "getVersion", asyncMiddleware(
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (req, res, next) {
        //(req: $Request, res: $Response): void {
        res.status(200).json({
          "version": _GeneralHandler.default.version
        });
      });

      return function (_x7, _x8, _x9) {
        return _ref3.apply(this, arguments);
      };
    }()));

    // instantiate the express.Router
    this.router = (0, _express.Router)();
    this.path = path; // glue it all together

    this.init();
  }

  /**
   * Attach route handlers to their endpoints.
   */
  init() {
    this.router.post('/general', this.updateGeneralSettings);
    this.router.get('/general', this.getGeneralSettings);
    this.router.get('/version', this.getVersion);
  }

}

exports.default = GeneralRouter;
//# sourceMappingURL=GeneralRouter.js.map
