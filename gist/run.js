"use strict";
const fs = require('fs');
const flop = require('./floppsymini.js');
let i = 1<<20;
let x = flop(1137);
let z = Uint32Array.of(x);
let y = Buffer.from(z.buffer);
while(i--) {
  fs.appendFileSync('floppsy.out',y,'binary');
  z[0] = flop(z[0]);
}
