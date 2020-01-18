# :baby_chick: [floppsy](https://github.com/dosyago/floppsy) ![npm downloads](https://img.shields.io/npm/dt/floppsy) ![version](https://img.shields.io/npm/v/floppsy)

A tiny, simple and slow hash designed for floating point hardware.

## demo

[play with a demo online here](https://codesandbox.io/s/blue-cache-88e9g?fontsize=14&hidenavigation=1&theme=dark)

## construction

constructed using floating point multiplication, division and addition.

based on continued and egyptian fractions.

*no bit operations used in the making of this hash.*

## accolades

passes [smhasher](https://github.com/rurban/smhasher)

[see the results for all tests](https://github.com/crislin2046/floppsy/blob/master/smhasher.results.txt)

also see [an independent confirmation of these results](https://github.com/rurban/smhasher/blob/master/doc/floppsyhash_64)

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

```console
> f.hash('')
'7f5f8491f0b745bf'
> f.hash('', {bits:32})
'7016ca50'
> f.hash('', {bits:128})
'3f7f508e3fe034033ff0e269b0c66356'
```

*Can also change output format:*

```javascript
  x.hash('',{out_format:'hex'}); // default
  x.hash('',{out_format:'binary'}); // binary string
  x.hash('',{out_format:'bytes'}); // Uint8Array
  x.hash('',{out_format:'uint32s'}); // Uint32Array
```

---------------

[play with a demo online here](https://codesandbox.io/s/blue-cache-88e9g?fontsize=14&hidenavigation=1&theme=dark)
