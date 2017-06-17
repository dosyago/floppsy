"use strict";
const fs = require('fs');
const tf = require('./tifumini.js');
let i = 1<<20;
let x = tf(1137);
let z = Uint32Array.of(x);
let y = Buffer.from(z.buffer);
while(i--) {
  fs.appendFileSync('tifu.out',y,'binary');
  z[0] = tf(z[0]);
}
