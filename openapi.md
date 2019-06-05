# PI2c

## Table of Contents

* [Servers](#servers)
* [Paths](#paths)
  - [GET /api/v1/version](#op-get-api-v1-version) 
  - [GET /api/v1/general](#op-get-api-v1-general) 
  - [POST /api/v1/general](#op-post-api-v1-general) 
  - [POST /api/v1/instr/exec](#op-post-api-v1-instr-exec) 
  - [GET /api/v1/instr/stored](#op-get-api-v1-instr-stored) 
  - [GET /api/v1/instr/stored/{InstructionSetName}](#op-get-api-v1-instr-stored-instructionsetname) 
  - [POST /api/v1/instr/stored/{InstructionSetName}](#op-post-api-v1-instr-stored-instructionsetname) 
  - [POST /api/v1/instr/stored/{InstructionSetName}/exec](#op-post-api-v1-instr-stored-instructionsetname-exec) 
  - [GET /api/v1/instr/stored/{InstructionSetName}/log](#op-get-api-v1-instr-stored-instructionsetname-log) 
* [Schemas](#schemas)
  - [PI2c General Settings](#schema-pi2c-general-settings)
  - [Pin reset type](#schema-pin-reset-type)
  - [Poll Pin direction](#schema-poll-pin-direction)
  - [Pin](#schema-pin)
  - [Pin Mode](#schema-pin-mode)
  - [Pullup](#schema-pullup)
  - [Pin Value](#schema-pin-value)
  - [Pin Numerical Value](#schema-pin-numerical-value)
  - [led](#schema-led)
  - [open](#schema-open)
  - [stored](#schema-stored)
  - [mode](#schema-mode)
  - [read](#schema-read)
  - [readBuf](#schema-readbuf)
  - [write](#schema-write)
  - [writeBuf](#schema-writebuf)
  - [pud](#schema-pud)
  - [pwmSetClockDivider](#schema-pwmsetclockdivider)
  - [pwmSetRange](#schema-pwmsetrange)
  - [pwmSetData](#schema-pwmsetdata)
  - [i2cBegin](#schema-i2cbegin)
  - [i2cSetSlaveAddress](#schema-i2csetslaveaddress)
  - [i2cSetBaudRate](#schema-i2csetbaudrate)
  - [i2cRead](#schema-i2cread)
  - [i2cWrite](#schema-i2cwrite)
  - [i2cUpdateReg](#schema-i2cupdatereg)
  - [i2cEnd](#schema-i2cend)
  - [spiBegin](#schema-spibegin)
  - [spiSetCSPolarity](#schema-spisetcspolarity)
  - [spiSetClockDivider](#schema-spisetclockdivider)
  - [spiSetDataMode](#schema-spisetdatamode)
  - [spiTransfer](#schema-spitransfer)
  - [spiWrite](#schema-spiwrite)
  - [spiEnd](#schema-spiend)
  - [sleep](#schema-sleep)
  - [msleep](#schema-msleep)
  - [usleep](#schema-usleep)
  - [Instructions](#schema-instructions)
  - [Instruction Response](#schema-instruction-response)
  - [Instructions Response](#schema-instructions-response)
  - [Error](#schema-error)


<a id="servers" />

## Servers

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="http://GO-XXXXXXX/api/v1" target="_blank">http://GO-XXXXXXX/api/v1</a></td>
      <td></td>
    </tr>
  </tbody>
</table>


## Paths


### GET /api/v1/version
<a id="op-get-api-v1-version" />

> Get the device firmware version








#### Responses


##### ▶ 200 - Object with version property with firmware string value

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>version <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### GET /api/v1/general
<a id="op-get-api-v1-general" />

> Get general settings of the device








#### Responses


##### ▶ 200 - Response is an object with keys 'name', 'password', 'webURL'.

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td>a user defined name for the device</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password</td>
        <td>
          string
        </td>
        <td>a REST API password for Basic access authentication where the username is ignored</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>webURL</td>
        <td>
          string
        </td>
        <td>(advanced) a user defined URL serving custom HTML/JS to control the PI2c</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### POST /api/v1/general
<a id="op-post-api-v1-general" />

> Update the General settings of the PI2c device. Existing values are used for properties not sent.







#### Request body
###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td>a user defined name for the device</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password</td>
        <td>
          string
        </td>
        <td>a REST API password for Basic access authentication where the username is ignored</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>webURL</td>
        <td>
          string
        </td>
        <td>(advanced) a user defined URL serving custom HTML/JS to control the PI2c</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
{
  "name": "string",
  "password": "string",
  "webURL": "string"
}
```




#### Responses


##### ▶ 200 - Object with success of storing the instructions set

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error</td>
        <td>
          -- 
        </td>
        <td>Common Error object among all requests</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### POST /api/v1/instr/exec
<a id="op-post-api-v1-instr-exec" />

> Run instructions. All of the instructions can be found in schemas below.







#### Request body
###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>body</td>
        <td>
          array
        </td>
        <td><p>Array of instructions.
      Each instruction is an object with a key, 'func'
      whose value is the name of the function. It also may contain keys
      'arg1', 'arg2', 'arg3' and associated values corresponding to arguments for the function.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
[
  {
    "func": "open",
    "arg1": 1,
    "arg2": "INPUT",
    "arg3": "PULL_UP"
  }
]
```




#### Responses


##### ▶ 200 - Response object with stats and success of instructions

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>All of the instructions succeeded or false if any failed or did not execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>beginTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set began to execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>completeTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set finished executing</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions <strong>(required)</strong></td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>Instruction succeeded or not</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.index <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Array index from requested Instructions array</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.returnValue</td>
        <td>
          -- 
        </td>
        <td><p>If instruction retrieved data, this will contain one of data of types listed below based on the output type specified by the instruction. For example a base64 string representing a buffer of 8-bit data, a utf-8 string, or a number.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>instructions.returnValue.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
        <tr>
          <td>instructions.returnValue.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
      <tr>
        <td>instructions.error</td>
        <td>
          string
        </td>
        <td>Message possibly describing why instruction failed to execute</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### GET /api/v1/instr/stored
<a id="op-get-api-v1-instr-stored" />

> Get names of all stored instruction sets








#### Responses


##### ▶ 200 - Successfully retreived a list of stored instruction set names

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Response</td>
        <td>
          array(string)
        </td>
        <td>Array of names of each instruction set</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### GET /api/v1/instr/stored/{InstructionSetName}
<a id="op-get-api-v1-instr-stored-instructionsetname" />

> Get instructions for given set name


#### Path parameters

##### &#9655; InstructionSetName

Name of stored instruction set to retreive.



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>InstructionSetName  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td><p>Name of stored instruction set to retreive.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>








#### Responses


##### ▶ 200 - A List of instructions that are stored for requested name

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Response</td>
        <td>
          array
        </td>
        <td><p>Array of instructions.
      Each instruction is an object with a key, 'func'
      whose value is the name of the function. It also may contain keys
      'arg1', 'arg2', 'arg3' and associated values corresponding to arguments for the function.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### POST /api/v1/instr/stored/{InstructionSetName}
<a id="op-post-api-v1-instr-stored-instructionsetname" />

> Store instructions. This is useful so that you can later execute a sequence of instructions with a simple name.



#### Path parameters

##### &#9655; InstructionSetName

Name of stored instruction set to store/save. When successfully added the special set with name 'initialize' will automatically be run every time the device starts up.



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>InstructionSetName  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td><p>Name of stored instruction set to store/save. When successfully added the special set with name 'initialize' will automatically be run every time the device starts up.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>






#### Request body
###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>body</td>
        <td>
          array
        </td>
        <td><p>Array of instructions.
      Each instruction is an object with a key, 'func'
      whose value is the name of the function. It also may contain keys
      'arg1', 'arg2', 'arg3' and associated values corresponding to arguments for the function.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### Example _(generated)_

```json
[
  {
    "func": "open",
    "arg1": 1,
    "arg2": "INPUT",
    "arg3": "PULL_UP"
  }
]
```




#### Responses


##### ▶ 200 - Object with success of storing the instructions set

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error</td>
        <td>
          -- 
        </td>
        <td>Common Error object among all requests</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### POST /api/v1/instr/stored/{InstructionSetName}/exec
<a id="op-post-api-v1-instr-stored-instructionsetname-exec" />

> Execute named instruction set


#### Path parameters

##### &#9655; InstructionSetName

Name of stored instruction set to execute



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>InstructionSetName  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td><p>Name of stored instruction set to execute</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>








#### Responses


##### ▶ 200 - Response object with stats and success of each instruction

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>All of the instructions succeeded or false if any failed or did not execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>beginTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set began to execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>completeTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set finished executing</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions <strong>(required)</strong></td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>Instruction succeeded or not</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.index <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Array index from requested Instructions array</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.returnValue</td>
        <td>
          -- 
        </td>
        <td><p>If instruction retrieved data, this will contain one of data of types listed below based on the output type specified by the instruction. For example a base64 string representing a buffer of 8-bit data, a utf-8 string, or a number.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>instructions.returnValue.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
        <tr>
          <td>instructions.returnValue.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
      <tr>
        <td>instructions.error</td>
        <td>
          string
        </td>
        <td>Message possibly describing why instruction failed to execute</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



### GET /api/v1/instr/stored/{InstructionSetName}/log
<a id="op-get-api-v1-instr-stored-instructionsetname-log" />

> Get latest response for instruction set with given name when it last executed


#### Path parameters

##### &#9655; InstructionSetName

Name of stored instruction set's response log to retreive


<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>In</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>InstructionSetName  <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>path</td>
        <td>Name of stored instruction set's response log to retreive</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>








#### Responses


##### ▶ 200 - Object Response per each instruction

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>hasLog <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td><p>Has this stored instruction set executed. If so, the log key will be present with the response of the last execution.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log</td>
        <td>
          object
        </td>
        <td><p>Object describing success and information of Instructions execution. It also contains an instructions key whose value is every instructions success status and returned data if applicapable. When a stored instruction set is executed the latest response object will be stored in it's corresponding log.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>All of the instructions succeeded or false if any failed or did not execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.beginTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set began to execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.completeTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set finished executing</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.instructions <strong>(required)</strong></td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.instructions.success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>Instruction succeeded or not</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.instructions.index <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Array index from requested Instructions array</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>log.instructions.returnValue</td>
        <td>
          -- 
        </td>
        <td><p>If instruction retrieved data, this will contain one of data of types listed below based on the output type specified by the instruction. For example a base64 string representing a buffer of 8-bit data, a utf-8 string, or a number.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>log.instructions.returnValue.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
        <tr>
          <td>log.instructions.returnValue.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
      <tr>
        <td>log.instructions.error</td>
        <td>
          string
        </td>
        <td>Message possibly describing why instruction failed to execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error</td>
        <td>
          -- 
        </td>
        <td>Common Error object among all requests</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>error.message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>


##### ▶ default - Invalid packet, credentials, or some unexpected error

###### application/json



<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>



## Schemas

<a id="schema-pi2c-general-settings" />

#### PI2c General Settings

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>name</td>
        <td>
          string
        </td>
        <td>a user defined name for the device</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>password</td>
        <td>
          string
        </td>
        <td>a REST API password for Basic access authentication where the username is ignored</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>webURL</td>
        <td>
          string
        </td>
        <td>(advanced) a user defined URL serving custom HTML/JS to control the PI2c</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "name": "string",
  "password": "string",
  "webURL": "string"
}
```
<a id="schema-pin-reset-type" />

#### Pin reset type

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>PinResetType</td>
        <td>
          string
        </td>
        <td>How the pin is to be reset</td>
        <td><code>PIN_RESET</code>, <code>PIN_PRESERVE</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
"PIN_RESET"
```
<a id="schema-poll-pin-direction" />

#### Poll Pin direction

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>PollPinDirection</td>
        <td>
          string
        </td>
        <td>Check falling or rising edge or both when polling</td>
        <td><code>POLL_LOW</code>, <code>POLL_HIGH</code>, <code>POLL_BOTH</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
"POLL_LOW"
```
<a id="schema-pin" />

#### Pin

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Pin</td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
1
```
<a id="schema-pin-mode" />

#### Pin Mode

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>PinMode</td>
        <td>
          string
        </td>
        <td>Set whether GPIO Pin is input, output, or pwm if capable</td>
        <td><code>INPUT</code>, <code>OUTPUT</code>, <code>PWM</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
"INPUT"
```
<a id="schema-pullup" />

#### Pullup

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>PinInputModePullup</td>
        <td>
          string
        </td>
        <td>Pin Pullup in input mode</td>
        <td><code>PULL_UP</code>, <code>PULL_DOWN</code>, <code>PULL_OFF</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
"PULL_UP"
```
<a id="schema-pin-value" />

#### Pin Value

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>PinOutputModeValue</td>
        <td>
          string
        </td>
        <td>Pin string value in output mode</td>
        <td><code>HIGH</code>, <code>LOW</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
"HIGH"
```
<a id="schema-pin-numerical-value" />

#### Pin Numerical Value

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>PinOutputNumModeValue</td>
        <td>
          number
        </td>
        <td>Pin numerical value in output mode</td>
        <td><code>1</code>, <code>0</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
1
```
<a id="schema-led" />

#### led

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>led</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td><p>Which led (red or green). Note on startup when device is ready, red led will turn on for a second.</p>
      </td>
        <td><code>red</code>, <code>green</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          -- 
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>arg2.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><code>HIGH</code>, <code>LOW</code></td>
        </tr>
        <tr>
          <td>arg2.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><code>1</code>, <code>0</code></td>
        </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "led",
  "arg1": "red",
  "arg2": "HIGH"
}
```
<a id="schema-open" />

#### open

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>open</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Set whether GPIO Pin is input, output, or pwm if capable</td>
        <td><code>INPUT</code>, <code>OUTPUT</code>, <code>PWM</code></td>
      </tr>
      <tr>
        <td>arg3</td>
        <td>
          -- 
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>arg3.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><code>PULL_UP</code>, <code>PULL_DOWN</code>, <code>PULL_OFF</code></td>
        </tr>
        <tr>
          <td>arg3.1</td>
          <td>
            string
          </td>
          <td></td>
          <td><code>HIGH</code>, <code>LOW</code></td>
        </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "open",
  "arg1": 1,
  "arg2": "INPUT",
  "arg3": "PULL_UP"
}
```
<a id="schema-stored" />

#### stored

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>stored</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Name of stored instruction set to execute</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "stored",
  "arg1": "string"
}
```
<a id="schema-mode" />

#### mode

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>mode</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Set whether GPIO Pin is input, output, or pwm if capable</td>
        <td><code>INPUT</code>, <code>OUTPUT</code>, <code>PWM</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "mode",
  "arg1": 1,
  "arg2": "INPUT"
}
```
<a id="schema-read" />

#### read

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>read</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "read",
  "arg1": 1
}
```
<a id="schema-readbuf" />

#### readBuf

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>readBuf</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number of bits to read</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "readBuf",
  "arg1": 1,
  "arg2": 1
}
```
<a id="schema-write" />

#### write

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>write</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          -- 
        </td>
        <td>set the output of the pin using string or number types</td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>arg2.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><code>HIGH</code>, <code>LOW</code></td>
        </tr>
        <tr>
          <td>arg2.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><code>1</code>, <code>0</code></td>
        </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "write",
  "arg1": 1,
  "arg2": "HIGH"
}
```
<a id="schema-writebuf" />

#### writeBuf

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>writeBuf</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>base64 encoded data to be written. Each byte should be 1 or 0 to represent a bit</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "writeBuf",
  "arg1": 1,
  "arg2": "string"
}
```
<a id="schema-pud" />

#### pud

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>pud</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>GPIO Pin number</td>
        <td><code>1</code>, <code>3</code>, <code>5</code>, <code>7</code>, <code>8</code>, <code>9</code>, <code>12</code>, <code>13</code>, <code>14</code>, <code>15</code>, <code>16</code>, <code>17</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Pin Pullup in input mode</td>
        <td><code>PULL_UP</code>, <code>PULL_DOWN</code>, <code>PULL_OFF</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "pud",
  "arg1": 1,
  "arg2": "PULL_UP"
}
```
<a id="schema-pwmsetclockdivider" />

#### pwmSetClockDivider

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>pwmSetClockDivider</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td><p>This is a power-of-two divisor of the base 19.2MHz rate, with a maximum value of 4096 (4.6875kHz).</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "pwmSetClockDivider",
  "arg1": 1
}
```
<a id="schema-pwmsetrange" />

#### pwmSetRange

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>pwmSetRange</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><code>16</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>set range</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "pwmSetRange",
  "arg1": 16,
  "arg2": 1
}
```
<a id="schema-pwmsetdata" />

#### pwmSetData

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>pwmSetData</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td></td>
        <td><code>16</code>, <code>18</code></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>set data</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "pwmSetData",
  "arg1": 16,
  "arg2": 1
}
```
<a id="schema-i2cbegin" />

#### i2cBegin

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Assign GPIO pins 1 and 3 to use i2c</td>
        <td><code>i2cBegin</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cBegin"
}
```
<a id="schema-i2csetslaveaddress" />

#### i2cSetSlaveAddress

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>i2cSetSlaveAddress</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>Configure the slave address. This is between 0 - 0x7f</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cSetSlaveAddress",
  "arg1": 0
}
```
<a id="schema-i2csetbaudrate" />

#### i2cSetBaudRate

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>i2cSetBaudRate</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>The i2c baudrate</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cSetBaudRate",
  "arg1": 1000
}
```
<a id="schema-i2cread" />

#### i2cRead

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>i2cRead</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>Number of bytes to read</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cRead",
  "arg1": 1
}
```
<a id="schema-i2cwrite" />

#### i2cWrite

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>i2cWrite</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>base64 representation of bytes to write</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cWrite",
  "arg1": "string"
}
```
<a id="schema-i2cupdatereg" />

#### i2cUpdateReg

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>i2cUpdateReg</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>n-byte register value</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>arg2 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Mask - to 4 byte mask value base64. Num bytes should be equal to value</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>arg3 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Value - up to 4 byte data value base64. Num bytes should be equal to mask</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cUpdateReg",
  "arg1": "stri",
  "arg2": "string",
  "arg3": "string"
}
```
<a id="schema-i2cend" />

#### i2cEnd

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>i2cEnd</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "i2cEnd"
}
```
<a id="schema-spibegin" />

#### spiBegin

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiBegin</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "spiBegin"
}
```
<a id="schema-spisetcspolarity" />

#### spiSetCSPolarity

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiSetCSPolarity</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td></td>
        <td><code>HIGH</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "spiSetCSPolarity",
  "arg1": "HIGH"
}
```
<a id="schema-spisetclockdivider" />

#### spiSetClockDivider

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiSetClockDivider</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>Even divisor of the base 250MHz rate ranging between 0 and 65536. If div is 128 set SPI speed to 1.95MHz</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example

```json
{
  "func": "spiSetClockDivider",
  "arg1": 128
}
```
<a id="schema-spisetdatamode" />

#### spiSetDataMode

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiSetDataMode</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>0=CPOL(0)CPHA(0),1=CPOL(0)CPHA(1),2=CPOL(1)CPHA(0),3=CPOL(1)CPHA(1)</td>
        <td><code>0</code>, <code>1</code>, <code>3</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "spiSetDataMode",
  "arg1": 0
}
```
<a id="schema-spitransfer" />

#### spiTransfer

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiTransfer</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>base64 representation of bytes to write</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "spiTransfer",
  "arg1": "string"
}
```
<a id="schema-spiwrite" />

#### spiWrite

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiWrite</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>base64 representation of bytes to write</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "spiWrite",
  "arg1": "string"
}
```
<a id="schema-spiend" />

#### spiEnd

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>spiEnd</code></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "spiEnd"
}
```
<a id="schema-sleep" />

#### sleep

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>sleep</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>number of seconds to sleep</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "sleep",
  "arg1": 1
}
```
<a id="schema-msleep" />

#### msleep

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>msleep</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>Number of milliseconds to sleep</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "msleep",
  "arg1": 1
}
```
<a id="schema-usleep" />

#### usleep

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>func <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Instruction function name</td>
        <td><code>usleep</code></td>
      </tr>
      <tr>
        <td>arg1 <strong>(required)</strong></td>
        <td>
          number
        </td>
        <td>Number of microseconds to sleep</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "func": "usleep",
  "arg1": 100
}
```
<a id="schema-instructions" />

#### Instructions

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>Instructions</td>
        <td>
          array
        </td>
        <td><p>Array of instructions.
      Each instruction is an object with a key, 'func'
      whose value is the name of the function. It also may contain keys
      'arg1', 'arg2', 'arg3' and associated values corresponding to arguments for the function.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
[
  {
    "func": "open",
    "arg1": 1,
    "arg2": "INPUT",
    "arg3": "PULL_UP"
  }
]
```
<a id="schema-instruction-response" />

#### Instruction Response

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>Instruction succeeded or not</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>index <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Array index from requested Instructions array</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>returnValue</td>
        <td>
          -- 
        </td>
        <td><p>If instruction retrieved data, this will contain one of data of types listed below based on the output type specified by the instruction. For example a base64 string representing a buffer of 8-bit data, a utf-8 string, or a number.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>returnValue.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
        <tr>
          <td>returnValue.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
      <tr>
        <td>error</td>
        <td>
          string
        </td>
        <td>Message possibly describing why instruction failed to execute</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example

```json
{
  "success": true,
  "index": 0,
  "returnValue": "AAE="
}
```
<a id="schema-instructions-response" />

#### Instructions Response

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>All of the instructions succeeded or false if any failed or did not execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>beginTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set began to execute</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>completeTime <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Date and time of when set finished executing</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions <strong>(required)</strong></td>
        <td>
          array(object)
        </td>
        <td></td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.success <strong>(required)</strong></td>
        <td>
          boolean
        </td>
        <td>Instruction succeeded or not</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.index <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Array index from requested Instructions array</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>instructions.returnValue</td>
        <td>
          -- 
        </td>
        <td><p>If instruction retrieved data, this will contain one of data of types listed below based on the output type specified by the instruction. For example a base64 string representing a buffer of 8-bit data, a utf-8 string, or a number.</p>
      </td>
        <td><em>Any</em></td>
      </tr>
        <tr>
          <td>instructions.returnValue.0</td>
          <td>
            string
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
        <tr>
          <td>instructions.returnValue.1</td>
          <td>
            number
          </td>
          <td></td>
          <td><em>Any</em></td>
        </tr>
      <tr>
        <td>instructions.error</td>
        <td>
          string
        </td>
        <td>Message possibly describing why instruction failed to execute</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "success": true,
  "beginTime": "2019-05-25T20:40:57Z",
  "completeTime": "2019-05-25T20:40:57Z",
  "instructions": [
    {
      "success": true,
      "index": 0,
      "returnValue": "AAE="
    }
  ]
}
```
<a id="schema-error" />

#### Error

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Accepted values</th>
    </tr>
  </thead>
  <tbody>
      <tr>
        <td>code <strong>(required)</strong></td>
        <td>
          integer
        </td>
        <td>Number to identify the error for tracking purposes</td>
        <td><em>Any</em></td>
      </tr>
      <tr>
        <td>message <strong>(required)</strong></td>
        <td>
          string
        </td>
        <td>Information describing what caused the error</td>
        <td><em>Any</em></td>
      </tr>
  </tbody>
</table>

##### Example _(generated)_

```json
{
  "code": 0,
  "message": "string"
}
```
