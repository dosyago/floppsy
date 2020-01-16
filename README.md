# floppsy ![npm downloads](https://img.shields.io/npm/dt/floppsy) ![npm version](https://img.shields.io/npm/v/floppsy)

A tiny, fast hash designed for floating point hardware.

## construction

constructed using floating point operations, based on continued and egyptian fractions.

## disclaimer

no claims are made regarding the security of this system. 

## get

```console
npm i --save floppsy
```

## include

As a Node ES module:

```javascript
import floppsy from 'floppsy';
```

As old style modules:

```javascript
const floppsy = require('floppsy').default;
```

Using [Snowpack](https://github.com/pikapkg/snowpack) in a web app:

```javascript
import floppsy from './web_modules/floppsy.js';
```

## api

Can produce digests of 32, 64 or 128 bits.

```javascript
  x.hash(''); // 64 bits the default
  // > 760b4bbc8115967f
  x.hash('', {bits:32}); // 32 bit digest
  // > f720e23b
  x.hash('', {bits:128}); // 128 bit digest
  // > 360e8f893ffcbc334023b4ea40f1e195
```

*Can also change output format:*

```javascript
  x.hash('',{out_format:'hex'}); // default
  x.hash('',{out_format:'binary'}); // binary string
  x.hash('',{out_format:'bytes'}); // Uint8Array
  x.hash('',{out_format:'uint32s'}); // Uint32Array
```

