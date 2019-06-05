"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validInstructionSetName = validInstructionSetName;
exports.validBase64Buffer = validBase64Buffer;
exports.validStringInteger = validStringInteger;
exports.validInteger = validInteger;
exports.parseInstructions = parseInstructions;
exports.parseStoredInstructions = parseStoredInstructions;
exports.parseSleep = parseSleep;
exports.parseMSleep = parseMSleep;
exports.parseSpiSetCSPolarity = parseSpiSetCSPolarity;
exports.parseSpiSetClockDivider = parseSpiSetClockDivider;
exports.parseSpiSetDataMode = parseSpiSetDataMode;
exports.parseSpiTransfer = parseSpiTransfer;
exports.parseSpiWrite = parseSpiWrite;
exports.parseI2cUpdateReg = parseI2cUpdateReg;
exports.parseI2cWrite = parseI2cWrite;
exports.parseI2cRead = parseI2cRead;
exports.parseI2cSetBaudrate = parseI2cSetBaudrate;
exports.parseI2cSetSlaveAddress = parseI2cSetSlaveAddress;
exports.parsePwmData = parsePwmData;
exports.parsePwmRange = parsePwmRange;
exports.parsePwmClockDivider = parsePwmClockDivider;
exports.parseWriteBuf = parseWriteBuf;
exports.parseReadBuf = parseReadBuf;
exports.parseRead = parseRead;
exports.parseLed = parseLed;
exports.parseWrite = parseWrite;
exports.parseMode = parseMode;
exports.parsePud = parsePud;
exports.parseOpen = parseOpen;
exports.parseStored = parseStored;
exports.GREEN_LED_PIN = exports.RED_LED_PIN = void 0;

var _rpio = _interopRequireDefault(require("rpio"));

var _isBase = _interopRequireDefault(require("is-base64"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RED_LED_PIN = 36;
exports.RED_LED_PIN = RED_LED_PIN;
const GREEN_LED_PIN = 40;
exports.GREEN_LED_PIN = GREEN_LED_PIN;
const validSentPins = new Map([[1, 5], [3, 3], [5, 21], [7, 23], [8, 19], [9, 24], [12, 8], [13, 29], [14, 10], [15, 31], [16, 12], [17, 35], [18, 33]]);

function validInstructionSetName(name) {
  if (name.length < 32 && name.length > 6 && name.match(/^[a-zA-Z0-9_]+$/)) {
    return true;
  }

  return false;
}

function validOutput(option) {
  let retValue = null;

  if (typeof option === 'string') {
    option = option.toUpperCase();

    switch (option) {
      case 'HIGH':
        retValue = _rpio.default.HIGH;
        break;

      case 'LOW':
        retValue = _rpio.default.LOW;
        break;
    }

    if (retValue !== null) {
      return retValue;
    }
  }

  if (typeof option === 'number') {
    switch (option) {
      case 1:
        retValue = _rpio.default.HIGH;
        break;

      case 0:
        retValue = _rpio.default.LOW;
        break;
    }

    if (retValue !== null) {
      return retValue;
    }
  }

  return Error(`No valid option HIGH/1 or LOW/0 passed`);
}

function validInput(option) {
  let retValue = null;

  if (typeof option === 'string') {
    option = option.toUpperCase();

    switch (option) {
      case 'PULL_DOWN':
        retValue = _rpio.default.PULL_DOWN;
        break;

      case 'PULL_UP':
        retValue = _rpio.default.PULL_UP;
        break;

      case 'PULL_OFF':
        retValue = _rpio.default.PULL_OFF;
        break;
    }

    if (retValue !== null) {
      return retValue;
    }
  }

  return Error(`No valid option PULL_UP or PULL_DOWN passed`);
}

function validOption(option, mode = null) {
  if (mode !== null && mode === _rpio.default.INPUT) {
    return validInput(option);
  } else if (mode !== null && mode === _rpio.default.OUTPUT) {
    return validOutput(option);
  }

  const r = validInput(option);

  if (r instanceof Error === false) {
    return r;
  }

  return validOutput(option);
}

function validMode(mode) {
  if (typeof mode === 'string') {
    mode = mode.toUpperCase();

    switch (mode) {
      case 'INPUT':
        return _rpio.default.INPUT;

      case 'OUTPUT':
        return _rpio.default.OUTPUT;

      case 'PWM':
        return _rpio.default.PWM;
    }
  }

  return Error(`Incorrect mode specified. Need INPUT, OUTPUT, PWM`);
}

function validPin(pin) {
  if (typeof pin === 'number') {
    const physPin = validSentPins.get(pin);

    if (typeof physPin !== 'undefined') {
      return physPin;
    }
  }

  return Error(`Incorrect pin value specified`);
}

function validLed(led) {
  if (typeof led === 'string') {
    const checkVal = led.toLowerCase();

    if (checkVal === 'red') {
      return RED_LED_PIN;
    } else if (checkVal === 'green') {
      return GREEN_LED_PIN;
    }
  }

  return Error(`Incorrect led value specified. Need red or green.`);
}

function modeToRPIO(mode) {
  switch (mode) {
    case 'INPUT':
      return _rpio.default.INPUT;

    case 'OUTPUT':
      return _rpio.default.OUTPUT;

    case 'PWM':
      return _rpio.default.PWM;
  }
}

function isObject(obj) {
  return obj === Object(obj);
}

function validBase64Buffer(input, min, max) {
  if (typeof input === 'string' && (0, _isBase.default)(input)) {
    const origLength = input.length * (3 / 4);

    if (origLength >= min && origLength <= max) {
      try {
        return Buffer.from(input, 'base64');
      } catch (error) {
        return Error(`Invalid data format. Needs to be base64 string`);
      }
    }

    return Error(`Argument is not valid base64 string with length in range from ${min} to ${max}`);
  }

  return Error(`Invalid data format. Needs to be base64 string`);
}

function validStringInteger(num, min, max) {
  if (typeof num === 'string') {
    const pNum = parseInt(num);

    if (pNum !== NaN && pNum >= min && pNum <= max) {
      return pNum;
    }
  }

  return Error(`Argument is not valid String Integer in range ${min} to ${max}`);
}

function validInteger(num, min, max) {
  if (typeof num === 'number' && Number.isInteger(num) && num >= min && num <= max) {
    return num;
  }

  return Error(`Argument is not valid integer in range ${min} to ${max}`);
}

function parseInstructions(input) {
  if (Array.isArray(input) === false) {
    return false;
  }

  return input.every(instr => {
    return instr.func && typeof instr.func === 'string';
  });
} //This also makes sure that there are no nested stored instructions that could cause infinite recursion


function parseStoredInstructions(input) {
  if (Array.isArray(input) === false) {
    return false;
  }

  return input.every(instr => {
    return instr.func && typeof instr.func === 'string' && instr.func !== 'stored';
  });
} //Sleep parsing


function parseSleep(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 5);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [value];
}

function parseMSleep(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 5000);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [value];
} //SPI parsing


function parseSpiSetCSPolarity(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validOutput(input.arg1);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [0, value];
}

function parseSpiSetClockDivider(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 65536);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [value];
}

function parseSpiSetDataMode(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 0, 3);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [value];
}

function parseSpiTransfer(input) {
  let ret = null,
      buffer = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 64000);

    if (ret instanceof Error) {
      return ret;
    }

    buffer = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [buffer];
}

function parseSpiWrite(input) {
  let ret = null,
      buffer = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 64000);

    if (ret instanceof Error) {
      return ret;
    }

    buffer = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [buffer];
} // I2c Parsing


function parseI2cUpdateReg(input) {
  let ret = null,
      reg,
      mask = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 4);

    if (ret instanceof Error) {
      return ret;
    }

    reg = ret;
  } else {
    return Error(`Missing arg1`);
  }

  if (input.arg2 !== undefined) {
    const ret = validBase64Buffer(input.arg2, 1, 8);

    if (ret instanceof Error) {
      return ret;
    }

    mask = ret;
  } else {
    return Error(`Missing arg2`);
  }

  if (input.arg3 !== undefined) {
    const ret = validBase64Buffer(input.arg3, 1, 8);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg3`);
  }

  if (mask.length !== value.length) {
    return Error(`Mask and Value are not the same number of bytes`);
  }

  return [reg, mask, value];
}

function parseI2cWrite(input) {
  let ret = null,
      buffer = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 64000);

    if (ret instanceof Error) {
      return ret;
    }

    buffer = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [buffer];
}

function parseI2cRead(input) {
  let ret = null,
      buffer = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 64000);

    if (ret instanceof Error) {
      return ret;
    }

    buffer = Buffer.alloc(ret);
  } else {
    return Error(`Missing arg1`);
  }

  return [buffer];
}

function parseI2cSetBaudrate(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (typeof input.arg1 === 'number') {
    const ret = validInteger(input.arg1, 1000, 400000);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else if (typeof input.arg1 === 'string') {
    const ret = validStringInteger(input.arg1, 1000, 400000);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [value];
}

function parseI2cSetSlaveAddress(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (typeof input.arg1 === 'number') {
    const ret = validInteger(input.arg1, 0, 0x7F);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else if (typeof input.arg1 === 'string') {
    const ret = validStringInteger(input.arg1, 0, 0x7F);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg1`);
  }

  return [value];
} // PWM Parsing


function parsePwmData(input) {
  let ret = null,
      pin = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    const ret = validInteger(input.arg2, 1, 4096);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg2`);
  }

  return [pin, value];
}

function parsePwmRange(input) {
  let ret = null,
      pin = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    const ret = validInteger(input.arg2, 1, 4096);

    if (ret instanceof Error) {
      return ret;
    }

    value = ret;
  } else {
    return Error(`Missing arg2`);
  }

  return [pin, value];
}

function parsePwmClockDivider(input) {
  let ret = null,
      value = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validInteger(input.arg1, 1, 4096);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  value = ret;
  return [value];
}

function parseWriteBuf(input) {
  let ret = null,
      pin = null,
      buffer = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    const ret = validBase64Buffer(input.arg2, 1, 10000);

    if (ret instanceof Error) {
      return ret;
    }

    buffer = ret;
  } else {
    return Error(`Missing arg2`);
  }

  return [pin, buffer];
}

function parseReadBuf(input) {
  let ret = null,
      pin = null,
      buffer = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    const ret = validInteger(input.arg2, 1, 10000);

    if (ret instanceof Error) {
      return ret;
    }

    buffer = Buffer.alloc(ret);
  } else {
    return Error(`Missing arg2`);
  }

  return [pin, buffer];
}

function parseRead(input) {
  let ret = null,
      pin = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;
  return [pin];
}

function parseLed(input) {
  let ret = null,
      pin = null,
      output = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validLed(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    ret = validOutput(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  output = ret;
  return [pin, output];
}

function parseWrite(input) {
  let ret = null,
      pin = null,
      output = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    ret = validOutput(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  output = ret;
  return [pin, output];
}

function parseMode(input) {
  let ret = null,
      pin = null,
      mode = null,
      option = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    ret = validMode(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  mode = ret;
  return [pin, mode];
}

function parsePud(input) {
  let ret = null,
      pin = null,
      mode = null;

  if (!isObject(input)) {
    return Error(`Invalid instruction format`);
  }

  if (input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  pin = ret;

  if (input.arg2 !== undefined) {
    ret = validInput(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }

  if (ret instanceof Error) {
    return ret;
  }

  mode = ret;
  return [pin, mode];
}

function parseOpen(input) {
  let ret,
      option = null;
  let m = parseMode(input);

  if (m instanceof Error) {
    return m;
  }

  if (input.arg3) {
    ret = validOption(input.arg3, m[1]);
  } else {
    return m;
  }

  if (ret instanceof Error) {
    return ret;
  }

  option = ret;
  return [...m, option];
}

function parseStored(input) {
  let ret,
      name = null;

  if (input.arg1 !== undefined) {
    if (typeof input.arg1 === 'string' && validInstructionSetName(input.arg1)) {
      name = input.arg1;
    } else {
      return new Error(`Invalid instruction set name ${input.arg1}. Make sure > 6 characters < 32.`);
    }
  } else {
    return new Error(`Missing arg1`);
  }

  return [name];
}
//# sourceMappingURL=parsers.js.map
