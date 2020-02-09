# :baby_chick: [floppsy](https://github.com/dosyago/floppsy) ![npm downloads](https://img.shields.io/npm/dt/floppsy) ![version](https://img.shields.io/npm/v/floppsy)

A tiny, simple and SMHasher-passing slow (200Mb/s) hash designed for floating point hardware.

## demo

[play with a demo online here](https://88e9g.csb.app/)

## construction

constructed using floating point multiplication, division and addition.

based on continued and egyptian fractions.

*no bit operations used in the making of this hash.*

## accolades

passes [smhasher](https://github.com/rurban/smhasher)

[see the results for all tests](https://github.com/crislin2046/floppsy/blob/master/smhasher.results.txt)

also see [an independent confirmation of these results](https://github.com/rurban/smhasher/blob/master/doc/floppsyhash_64)


## c source

```
//---------
// Q function : Continued Egyptian Fraction update function

void q ( double * state, double key_val, 
         double numerator, double denominator )
{
  state[0] += numerator / denominator;
  state[0] = 1.0 / state[0];

  state[1] += key_val + M_PI;
  state[1] = numerator / state[1];
}

//---------
// round function : process the message 

void round ( const uint8_t * msg, long len, 
            double * state ) 
{
  double numerator = 1.0;

  // Loop
  for( long i = 0; i < len; i++ ) {
    double val = (double)msg[i];
    double denominator = (M_E * val + i + 1) / state[1];

    q( state, val, numerator, denominator );

    numerator = denominator + 1;
  }
}

//---------
// setup function : setup the state

void setup ( double * state, double init = 0 ) 
{
  state[0] += init != 0 ? pow(init + 1.0/init, 1.0/3) : 3.0;
  state[1] += init != 0 ? pow(init + 1.0/init, 1.0/7) : 1.0/7;
}

//---------
// floppsyhash
// with 64 bit continued egyptian fractions

void floppsyhash_64 ( const void * key, int len,
                   uint32_t seed, void * out )
{
  const uint8_t * data = (const uint8_t *)key;
  uint8_t buf [16];
  double * state = (double*)buf;
  uint32_t * state32 = (uint32_t*)buf;
  double seed32 = (double)seed;

  uint8_t * seedbuf;
  seedbuf = (uint8_t *)&seed;

  setup( state, seed32 );
  round( seedbuf, 4, state );
  round( data, len, state );

  uint8_t output [8];
  uint32_t * h = (uint32_t*)output;
  
  h[0] = state32[0] + state32[3];
  h[1] = state32[1] + state32[2];

  ((uint32_t*)out)[0] = h[0];
  ((uint32_t*)out)[1] = h[1];
} 

```
## disclaimer

no claims are made regarding the security of this system. 

## get

```console
npm i --save floppsy
```

## use-cases

- A slow hash for password hashing. 
- Hashing arrays of numbers (vectors, floating point).
- As a basis for a cryptographic primitive (such as a PRNG, or symmetric cipher).

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
