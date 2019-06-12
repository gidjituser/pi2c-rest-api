//@flow
import type { PinMode, Pin } from '../types'
import rpio from 'rpio'
import isBase64 from 'is-base64'

export type PinModeRPIO = rpio.INPUT | rpio.OUTPUT | rpio.PWM;
export type PinInputModePullupRPIO = rpio.PULL_DOWN | rpio.PULL_UP | rpio.PULL_OFF;
export type PinOutputValueRPIO = rpio.HIGH | rpio.LOW;
export type PinOptionRPIO = PinInputModePullupRPIO | PinOutputValueRPIO;
export type ValidMappedPin = 5 | 3 | 21 | 23 | 19 | 24 | 8 | 29 | 10 | 31 | 12 | 35 | 33;

export const RED_LED_PIN = 36;
export const GREEN_LED_PIN = 40;

export type ValidLedPin = 36 | 40;

const validSentPins = new Map([[1, 5], [3, 3], [5, 21], [7, 23], [8, 19], [9, 24], [12, 8], [13, 29], [14, 10], [15, 31], [16, 12], [17, 35], [18, 33]]);
export function validInstructionSetName(name: string): boolean {
  if(name.length < 32 && name.length > 6 && name.match(/^[a-zA-Z0-9_]+$/)) {
    return true
  }
  return false;
}

function validOutput(option: any): PinOutputValueRPIO | Error {
  let retValue: PinOutputValueRPIO | null = null;
  if(typeof option === 'string') {
    option = option.toUpperCase();
    switch (option) {
      case 'HIGH':
        retValue = rpio.HIGH;
        break;
      case 'LOW':
        retValue = rpio.LOW;
        break;
    }
    if(retValue !== null) {
        return retValue;
    }
  }
  if(typeof option === 'number') {
    switch (option) {
      case 1:
        retValue = rpio.HIGH;
        break;
      case 0:
        retValue = rpio.LOW;
        break;
    }
    if(retValue !== null) {
        return retValue;
    }
  }
  return Error(`No valid option HIGH/1 or LOW/0 passed`);
}
function validInput(option: any): PinInputModePullupRPIO | Error {
  let retValue: PinInputModePullupRPIO | null = null;
  if(typeof option === 'string') {
    option = option.toUpperCase();
    switch (option) {
      case 'PULL_DOWN':
        retValue = rpio.PULL_DOWN;
        break;
      case 'PULL_UP':
        retValue = rpio.PULL_UP;
        break;
      case 'PULL_OFF':
        retValue = rpio.PULL_OFF;
        break;
    }
    if(retValue !== null) {
      return retValue;
    }
  }
  return Error(`No valid option PULL_UP or PULL_DOWN passed`);
}
function validOption(option: any, mode: PinModeRPIO | null = null): PinOptionRPIO | null {
  if(mode !== null && mode === rpio.INPUT) {
    return validInput(option);
  } else if(mode !== null && mode === rpio.OUTPUT) {
    return validOutput(option);
  }
  const r = validInput(option);
  if(r instanceof Error === false) {
    return r;
  }
  return validOutput(option);
}
function validMode(mode: any): PinModeRPIO | Error {
  if(typeof mode === 'string') {
    mode = mode.toUpperCase();
    switch (mode) {
      case 'INPUT':
        return rpio.INPUT;
      case 'OUTPUT':
        return rpio.OUTPUT;
      case 'PWM':
        return rpio.PWM;
    }
  }
  return Error(`Incorrect mode specified. Need INPUT, OUTPUT, PWM`);
}
function validPin(pin: any): ValidMappedPin | Error {
  if(typeof pin === 'number') {
    const physPin = validSentPins.get(pin)
    if(typeof physPin !== 'undefined') {
      return physPin;
    }
  }
  return Error(`Incorrect pin value specified`);
}
function validLed(led: any): ValidLedPin | Error {
  if(typeof led === 'string') {
    const checkVal = led.toLowerCase();
    if(checkVal === 'red') {
      return RED_LED_PIN;
    } else if(checkVal === 'green') {
      return GREEN_LED_PIN;
    }
  }
  return Error(`Incorrect led value specified. Need red or green.`);
}
function modeToRPIO(mode: PinMode): PinModeRPIO {
  switch (mode) {
    case 'INPUT':
      return rpio.INPUT;
    case 'OUTPUT':
      return rpio.OUTPUT;
    case 'PWM':
      return rpio.PWM;
  }
}
function isObject(obj) {
  return obj === Object(obj);
}

export function validBase64Buffer(input : any, min: number, max: number): Buffer | Error {
  if(typeof input === 'string' && isBase64(input)) {
    const origLength = input.length * (3/4);
    if(origLength >= min && origLength <= max) {
      try {
        return Buffer.from(input, 'base64');
      } catch(error) {
        return Error(`Invalid data format. Needs to be base64 string`);
      }
    }
    return Error(`Argument is not valid base64 string with length in range from ${min} to ${max}`);
  }
  return Error(`Invalid data format. Needs to be base64 string`);
}
export function validStringInteger(num : any, min: number, max: number): number | Error {
  if(typeof num === 'string') {
    const pNum = parseInt(num);
    if(pNum !== NaN && pNum >= min && pNum <= max) {
      return pNum;
    }
  }
  return Error(`Argument is not valid String Integer in range ${min} to ${max}`);
}
export function validInteger(num : any, min: number, max: number): number | Error {
  if(typeof num === 'number' && Number.isInteger(num) && num >= min && num <= max) {
    return num;
  }
  return Error(`Argument is not valid integer in range ${min} to ${max}`);
}
export function parseInstructions(input: any): boolean {
  if(Array.isArray(input) === false) {
    return false;
  }
  return input.every((instr) => { return instr.func && typeof instr.func === 'string' });
}
//This also makes sure that there are no nested stored instructions that could cause infinite recursion
export function parseStoredInstructions(input: any): boolean {
  if(Array.isArray(input) === false) {
    return false;
  }
  return input.every((instr) => { return instr.func && typeof instr.func === 'string' && instr.func !== 'stored' });
}

//Sleep parsing
export function parseSleep(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 5);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [value];
}
export function parseMSleep(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 5000);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [value];
}

//SPI parsing
export function parseSpiSetCSPolarity(input: any): [0, PinOutputValueRPIO] | Error {
  let ret = null, value : PinOutputValueRPIO | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validOutput(input.arg1);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [0, value];

}
export function parseSpiSetClockDivider(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 65536);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [value];
}

export function parseSpiSetDataMode(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 0, 3);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [value];
}
export function parseSpiTransfer(input: any): [Buffer] | Error {
  let ret = null, buffer: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 64000);
    if(ret instanceof Error) {
      return ret;
    }
    buffer = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [buffer];
}
export function parseSpiWrite(input: any): [Buffer] | Error {
  let ret = null, buffer: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 64000);
    if(ret instanceof Error) {
      return ret;
    }
    buffer = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [buffer];
}


// I2c Parsing
export function parseI2cUpdateReg(input: any): [Buffer, Buffer, Buffer] | Error {
  let ret = null, reg: Buffer | null, mask: Buffer | null = null, value: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 4);
    if(ret instanceof Error) {
      return ret;
    }
    reg = ret;
  } else {
    return Error(`Missing arg1`);
  }
  if(input.arg2 !== undefined) {
    const ret = validBase64Buffer(input.arg2, 1, 8);
    if(ret instanceof Error) {
      return ret;
    }
    mask = ret;
  } else {
    return Error(`Missing arg2`);
  }
  if(input.arg3 !== undefined) {
    const ret = validBase64Buffer(input.arg3, 1, 8);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg3`);
  }
  if(mask.length !== value.length) {
    return Error(`Mask and Value are not the same number of bytes`);
  }
  return [reg, mask, value];
}
export function parseI2cWrite(input: any): [Buffer] | Error {
  let ret = null, buffer: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validBase64Buffer(input.arg1, 1, 64000);
    if(ret instanceof Error) {
      return ret;
    }
    buffer = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [buffer];
}
export function parseI2cRead(input: any): [Buffer] | Error {
  let ret = null, buffer: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    const ret = validInteger(input.arg1, 1, 64000);
    if(ret instanceof Error) {
      return ret;
    }
    buffer = Buffer.alloc(ret);
  } else {
    return Error(`Missing arg1`);
  }
  return [buffer];
}
export function parseI2cSetBaudrate(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(typeof input.arg1 === 'number') {
    const ret = validInteger(input.arg1, 1000, 1000000);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else if(typeof input.arg1 === 'string') {
    const ret = validStringInteger(input.arg1, 1000, 1000000);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [value];
}
export function parseI2cSetSlaveAddress(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(typeof input.arg1 === 'number') {
    const ret = validInteger(input.arg1, 0, 0x7F);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else if(typeof input.arg1 === 'string') {
    const ret = validStringInteger(input.arg1, 0, 0x7F);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg1`);
  }
  return [value];
}
// PWM Parsing
export function parsePwmData(input: any): [ValidMappedPin, number] | Error {
  let ret = null, pin: ValidMappedPin | null = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    const ret = validInteger(input.arg2, 1, 4096);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg2`);
  }
  return [pin, value];
}
export function parsePwmRange(input: any): [ValidMappedPin, number] | Error {
  let ret = null, pin: ValidMappedPin | null = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    const ret = validInteger(input.arg2, 1, 4096);
    if(ret instanceof Error) {
      return ret;
    }
    value = ret;
  } else {
    return Error(`Missing arg2`);
  }
  return [pin, value];
}
export function parsePwmClockDivider(input: any): [number] | Error {
  let ret = null, value: number | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validInteger(input.arg1, 1, 4096);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  value = ret;
  return [value];
}
export function parseWriteBuf(input: any): [ValidMappedPin, Buffer] | Error {
  let ret = null, pin: ValidMappedPin | null = null, buffer: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    const ret = validBase64Buffer(input.arg2, 1, 10000);
    if(ret instanceof Error) {
      return ret;
    }
    buffer = ret;
  } else {
    return Error(`Missing arg2`);
  }
  return [pin, buffer];
}
export function parseReadBuf(input: any): [ValidMappedPin, Buffer] | Error {
  let ret = null, pin: ValidMappedPin | null = null, buffer: Buffer | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    const ret = validInteger(input.arg2, 1, 10000);
    if(ret instanceof Error) {
      return ret;
    }
    buffer = Buffer.alloc(ret);
  } else {
    return Error(`Missing arg2`);
  }
  return [pin, buffer];
}
export function parseRead(input: any): [ValidMappedPin] | Error {
  let ret = null, pin: ValidMappedPin | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  return [pin];
}
export function parseLed(input: any): [ValidLedPin, PinOutputValueRPIO] | Error {
  let ret = null, pin: ValidLedPin | null = null, output: PinOutputValueRPIO | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validLed(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    ret = validOutput(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  output = ret;
  return [pin, output];
}
export function parseWrite(input: any): [ValidMappedPin, PinOutputValueRPIO] | Error {
  let ret = null, pin: ValidMappedPin | null = null, output: PinOutputValueRPIO | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    ret = validOutput(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  output = ret;
  return [pin, output];
}
export function parseMode(input: any): [ValidMappedPin, PinModeRPIO] | Error {
  let ret = null, pin: ValidMappedPin | null = null, mode: PinModeRPIO | null = null, option: PinOptionRPIO | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    ret = validMode(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  mode = ret;
  return [pin, mode];
}
export function parsePud(input: any): [ValidMappedPin, PinInputModePullupRPIO] | Error {
  let ret = null, pin: ValidMappedPin | null = null, mode: PinInputModePullupRPIO | null = null;
  if(!isObject(input)) {
    return Error(`Invalid instruction format`);
  }
  if(input.arg1 !== undefined) {
    ret = validPin(input.arg1);
  } else {
    return Error(`Missing arg1`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  pin = ret;
  if(input.arg2 !== undefined) {
    ret = validInput(input.arg2);
  } else {
    return Error(`Missing arg2`);
  }
  if(ret instanceof Error) {
    return ret;
  }
  mode = ret;
  return [pin, mode];
}
export function parseOpen(input: any): [ValidMappedPin, PinModeRPIO] | [ValidMappedPin, PinModeRPIO, PinOptionRPIO] | Error {
  let ret, option: PinOptionRPIO | null = null;
  let m = parseMode(input);
  if(m instanceof Error) {
    return m;
  }
  if(input.arg3) {
    ret = validOption(input.arg3, m[1]);
  } else {
    return m;
  }
  if(ret instanceof Error) {
    return ret;
  }
  option = ret;
  return [...m, option];
}
export function parseStored(input: any): [string] | Error {
  let ret, name: string | null = null;
  if(input.arg1 !== undefined) {
    if(typeof input.arg1 === 'string' && validInstructionSetName(input.arg1)) {
      name = input.arg1;
    } else {
      return new Error(`Invalid instruction set name ${input.arg1}. Make sure > 6 characters < 32.`)
    }
  } else {
    return new Error(`Missing arg1`);
  }
  return [name];
}
