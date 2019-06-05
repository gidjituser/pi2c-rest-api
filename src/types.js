// @flow
export type base64 = string
export type PinResetType = "PIN_RESET" | "PIN_PRESERVE";
export type PollPinDirection = "POLL_LOW" | "POLL_HIGH" | "POLL_BOTH";
export type Pin = 1 | 3 | 5 | 7 | 8 | 9 | 12 | 13 | 14 | 15 | 16 | 17 | 18;
export type PinMode = "INPUT" | "OUTPUT" | "PWM";
export type PinInputModePullup = "PULL_UP" | "PULL_DOWN" | "PULL_OFF";
export type PinOutputModeValue = "HIGH" | "LOW";
export type open = {| func: "open", arg1: Pin, arg2: PinMode, arg3: (PinInputModePullup | PinOutputModeValue) |};
export type mode = {| func: "mode", arg1: Pin, arg2: PinMode |};
export type read = {| func: "read", arg1: Pin |};
export type readBuf = {| func: "readBuf", arg1: Pin, arg2: number |};
export type write = {| func: "write", arg1: Pin, arg2: PinOutputModeValue |};
export type writeBuf = {| func: "writeBuf", arg1: Pin, arg2: string |};
export type pud = {| func: "pud", arg1: Pin, arg2: PinInputModePullup |};
export type pwmSetClockDivider = {| func: "pwmSetClockDivider", arg1: number |};
export type pwmSetRange = {| func: "pwmSetRange", arg1: Pin, arg2: number |};
export type pwmSetData = {| func: "pwmSetData", arg1: Pin, arg2: number |};
export type i2cBegin = {| func: "i2cBegin" |};
export type i2cSetSlaveAddress = {| func: "i2cSetSlaveAddress", arg1: number |};
export type i2cSetBaudRate = {| func: "i2cSetBaudRate", arg1: number |};
export type i2cRead = {| func: "i2cRead", arg1: number |};
export type i2cWrite = {| func: "i2cWrite", arg1: string |};
export type i2cUpdateReg = {| func: "i2cUpdateReg", arg1: number, arg2: number, arg3: number |};
export type i2cEnd = {| func: "i2cEnd" |};
export type spiBegin = {| func: "spiBegin" |};
export type spiChipSelect = {| func: "spiChipSelect" |};
export type spiSetCSPolarity = {| func: "spiSetCSPolarity", arg1: "HIGH" |};
export type spiSetClockDivider = {| func: "spiSetClockDivider", arg1: number |};
export type spiSetDataMode = {| func: "spiSetDataMode", arg1: number |};
export type spiTransfer = {| func: "spiTransfer", arg1: string |};
export type spiWrite = {| func: "spiWrite", arg1: string |};
export type spiEnd = {| func: "spiEnd" |};
export type sleep = {| func: "sleep", arg1: number |};
export type msleep = {| func: "msleep", arg1: number |};
export type usleep = {| func: "usleep", arg1: number |};
export type Instructions = Array<
  | open
  | mode
  | read
  | readBuf
  | write
  | writeBuf
  | pud
  | pwmSetClockDivider
  | pwmSetRange
  | pwmSetData
  | i2cBegin
  | i2cSetSlaveAddress
  | i2cSetBaudRate
  | i2cRead
  | i2cWrite
  | i2cUpdateReg
  | i2cEnd
  | spiBegin
  | spiChipSelect
  | spiSetCSPolarity
  | spiSetClockDivider
  | spiSetDataMode
  | spiTransfer
  | spiWrite
  | spiEnd
  | sleep
  | msleep
  | usleep
>;
export type InstructionResponse = {|
  success: boolean,
  index: number,
  returnValue?: string,
  error?: string
|};
export type InstructionsResponse = {|
  success: boolean,
  beginTime: string,
  completeTime: string,
  name?: string,
  instructions: Array<InstructionResponse>
|};
export type Error = {| code: number, message: string |};
