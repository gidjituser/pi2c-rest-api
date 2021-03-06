# PI2c - REST Server

This application allows you to control the i2c, spi, and gpio your PI over a simple REST API.

- [PI2c - REST Server](#pi2c---rest-server)
  - [General Info](#general-info)
  - [Example](#example)
  - [Pinout & Wiring](#pinout--wiring)
    - [Saving named instruction sets](#saving-named-instruction-sets)
  - [Installing and Running](#installing-and-running)

## General Info

PI2c is a ready to use linux image for a Raspberry Pi that enables it to act as a bridge between a PC
, tablet, or phone and electronic devices or sensors. A PI2c hat allows the module to be enclosed with
pluggable connectors. These will become available at some future date. This repo contains the source for
the REST service. This will allow you to control and make i2c, spi, pwm, and gpio requests on your PI from
any device including a browser. You can run this on your own PI with the caveat you will
have to use the pin mapping below as the expected pin numbers are for the Hat. It also contains a WebSocket
Server for executing instructions for rapid requests.  

It is intended that your PI is on the same local network or plugged into your computer directly.
There is a complimentary repo providing the ability for UART over TCP or Websockets
for the Raspberry PI. Basically makes the PI act as a serial over network adapter.

[PI2c - Serial](https://github.com/gidjituser/pi2c-serial)

## Example

Nothing beats a quick example

```javascript
async function run() {
  try {
    const MCP9808_I2CADDR_DEFAULT        = 0x18
    const MCP9808_REG_MANUF_ID             = 0x06
    const meta = new Map();
    const user = 'none';
    const password = 'none';
    const deviceHost = 'GO-1234567.local'; //or ip address if your OS does not support this
    meta.set('Authorization', 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'));
    meta.set('Content-Type', 'application/json');
    const headers = new Headers(meta);
    const instructions = [
      {
        func: 'i2cBegin',
      }, {
        func: 'i2cSetSlaveAddress',
        arg1: MCP9808_I2CADDR_DEFAULT
      }, {
        func: 'i2cSetBaudRate',
        arg1: 100000
      }, {
        func: 'i2cWrite',
        arg1: Buffer.from([MCP9808_REG_MANUF_ID]).toString('base64')
      }, {
        func: 'i2cRead',
        arg1: 2
      }
    ];
    //Setup device for i2c and get Manufacturer id of device
    let resp = await fetch(`http://${deviceHost}/api/v1/instr/exec`,
      { method: 'POST', body: JSON.stringify(instructions), headers });
    if(!resp.ok) {
      const respText = await resp.text();
      console.log(`Error processing instructions. Response ${respText}`);
      process.exit(2);
    }
    let jsonResp = await resp.json();
    if(jsonResp.success == false) {
      console.debug(`Error communicating with response\n${JSON.stringify(jsonResp, undefined, 2)}`);
    } else {
      console.debug(`Success communicating with response\n${JSON.stringify(jsonResp, undefined, 2)}`);
      console.log(`Manufacturer id is ${Buffer.from(jsonResp.instructions[4].returnValue, 'base64').toString('ascii')}`)
    }
    //Clean up and end i2c comm
    resp = await fetch(`http://${deviceHost}/api/v1/instr/exec`, { method: 'POST', body:
      JSON.stringify([{
        func: 'i2cEnd'
      }]),
      headers
    });
    if(!resp.ok) {
      console.log(`Error processing instructions`);
      process.exit(3);
    }
  } catch(error) {
    console.log(`Unknown error. Message - ${error.message}`);
  }
}

```

In this javascript example we are communicating with a MCP9808 I2c temperature sensor.
The Instructions and InstructionsResponse schemes in the API has greater detail
on the structure and properties. You can chain instructions and POST them to /api/v1/instr/exec.
Instructions which return data can find the value in the InstructionsResponse.
 Specifically the property **returnValue** at the corresponding instruction index of the response.
Binary data is not valid in REST so it needs to be converted to and from base64 strings.

Full details of the rest API can be found at [REST API details](openapi.md "REST API")
There is also a OpenAPI 3 file *(openapi.yml)* in the repo. The WebSocket server
at path **/ws/instr/exec** follows the same protocol as **/api/v1/instr/exec**.
Send *Instructions* (array of instructions) stringified and receive
*InstructionsResponse* stringified. Default port is 80. Example below

```html
<!DOCTYPE HTML>
<html>
   <head>
      <script type = "text/javascript">
         function PI2cWebSocket() {
            if ("WebSocket" in window) {
               var ws = new WebSocket("ws://GO-1234567.local:80/ws/instr/exec");
               ws.onopen = function() {
                  var data = JSON.stringify([{"func":"mode","arg1": 3, "arg2":"OUTPUT"}]);
                  ws.send(data);
               };
               ws.onmessage = function (evt) {
                  var received_msg = evt.data;
                  //received_msg = "{"success":true,"beginTime":"2019-06-15T15:43:09.121Z","completeTime":"2019-06-15T15:43:09.121Z","instructions":[{"success":true,"index":0}]}"
                  alert("Instruction Response\n" + received_msg);
                  var received_object = JSON.parse(received_msg);
               };
               ws.onclose = function() {
                  // Closed
               };
            } else {
               alert("Your browser does not support websockets");
            }
         }
      </script>
   </head>
   <body>
      <div id="pi2c">
         <a href="javascript:PI2cWebSocket()">Send Instruction to PI2c WebSocket server</a>
      </div>
   </body>
</html>
```

## Pinout & Wiring

PI2c software uses the pin numbers corresponding with the PI2c hat. If you are not 
using the hat and are connecting straight to the Pi you can use the 
following chart to help with the mapping. **These are the physical pin numbers** .
The software allows the i2c, spi, and pwm pins to also act as gpio. 

|||||||||||||||
|--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |--- |
|PI2C Hat|1|3|5|7|8|9|12|13|14|15|16|17|18|
|Pi Header|5|3|21|23|19|24|8|29|10|31|12|35|33|

```javascript
const map = [[1, 5], [3, 3], [5, 21], [7, 23], [8, 19], [9, 24], [12, 8], 
[13, 29], [14, 10], [15, 31], [16, 12], [17, 35], [18, 33]]
```

| Function | PI2c Hat | Pi Header
| ---  | --- | --- |
| I2c | | |
| SDA | 3 | 3 |
| SCL | 1 | 5 |
| UART | | |
| UART_TX | 12 | 8 |
| UART_RX | 14 | 10 |
| SPI | | |
| SPI_CE0 | 9 | 24 |
| SPI_MOSI | 8 | 19 |
| SPI_MISO | 5 | 21 |
| SPI_CLK | 7 | 23 |
| PWM | | |
| PWM0 | 16 |  12 |
| PWM1 | 18 |  33  |

### Saving named instruction sets

To save from having to send many instructions frequently you can store them as a named set
on the device and execute later.

* List stored instruction set names
  * GET /api/v1/instr/stored
* Get stored instructions of set with name
  * GET /api/v1/instr/stored/[InstructionSetName]
* Add stored instruction set with name
  * POST /api/v1/instr/stored/[InstructionSetName]
* Execute stored instruction set with name
  * POST /api/v1/instr/stored/[InstructionSetName]/exec
* Get stored instructions set with name last execution log
  * GET /api/v1/instr/stored/[InstructionSetName]/log

```bash
  #Command line example get all stored instruction set names
  curl --header "Content-Type: application/json" --request GET http://${REST_SERVER}/api/v1/instr/stored

  #Command line example post new stored instruction set with special name initialize
  #initialize will be run everytime PI2c starts up
  curl --header "Content-Type: application/json"   --request POST
  --data '[{"func":"mode","arg1": 3, "arg2":"OUTPUT"}]' http://${REST_SERVER}/api/v1/instr/stored/initialize
```

## Installing and Running

Logs will be generated in a logs folder in the same directory you run the server. If you have any
issues make sure to check the files inside this directory.

- Install and run globally

```bash
npm install -g pi2c-rest-api
REST_PORT=80 pi2c-rest-api
```

- Build Install and run in repo

```bash
npm install
npm run gulp
REST_PORT=80 node build/index.js
```

- Run the pre generated release

```bash
REST_PORT=80 node release/index.js
```

- To generate a new release folder.

```bash
npm install
npm run gulp-release
```
