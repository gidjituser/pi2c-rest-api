// @flow

import path from 'path';
import fs from 'fs';
import type { Instructions } from '../types'

// use a Flow type import to get our Produce type
//
export default function saveInstructions(instructions: Instructions, name: string): Promise<string> {
  let outpath = path.join(__dirname, '..', '..', 'data', 'produce.json');
  return new Promise((resolve, reject) => {
    // lets not write to the file if we're running tests
    if (process.env.NODE_ENV !== 'test') {
      fs.writeFile(outpath, JSON.stringify(instructions, null, '\t'), (err) => {
        (err) ? reject(err) : resolve(outpath);
      });
    }
  });
}

export function genId(): number {
  return 0;
}
