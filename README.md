# tifuhash

TIny Floating Point Universal Hash - that's the aim anyway

## Latest News

TIFUHASH passes Dieharder, SMHashrr and PractRand. Oooh yeah!

Testing on 1 Gb initially produced 1 FAILED ( rgb_lagged_sums 31 ), and I concluded this was because the test was looping the 1 Gb input so many times and finding correlations that otherwise were not present. When I truncated the input to a large prime less than 1 Gb this test passed, adding support for my theory as to why it failed. Oooh yeah!

[![https://nodei.co/npm/tifuhash.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/tifuhash.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/tifuhash)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dosaygo-coder-0/tifuhash/issues)

 ```js
 const tifu = require('tifuhash');
 
 const message = 'The medium is the message.';
 const number = 333333333;
 const float = Math.PI;
 
 tifu.hash( message ); // OK
 tifu.hash( number ); // OK
 tifu.hash( float ); // OK
 tifu.hash( ); // empty message - OK
 ```

# Overview

Tifuhash's unusual benefits:
  - passes PractRand and SMHasher with 0 collissions and all bias less than 1%
  - is a novel construction based on continued fractions and Egyptian fractions
  - it has been bestowed the backronym "Today I fucked up Hash", and it is most likely mighty pleased 
  - it may be a candidate for a cryptographic hash. In that case, it's relative slowness to other hashes ( only around 100 Mb/s ) could have benefits for applications that key derivation / password hashing.
  - its hashes are architecture dependent due to the quirks of floating point on various platforms and since it magnifies even tiny differences. This could be useful for fingerprinting hashes performed on different platforms. 

The main mixing function is extraordinarily simple ( and it's my aim that it be memorizable ):

```js
  // Continued Fractions Hashing - q function for state update

    function q( state, val, numerator, denominator ) {
      // Continued Fraction mixed with Egyptian fraction "Continued Egyptian Fraction"
      // with denominator = val + pos / state[1]
      state[0] += numerator / denominator;
      state[0] = 1.0 / state[0];

      // Standard Continued Fraction with a_i = val, b_i = (a_i-1) + i + 1
      state[1] += val;
      state[1] = numerator / state[1];
    }
```

# Testing Results

Tifuhash passes two key tests for bias: [PracRand](http://pracrand.sourceforge.net/) for RNGs and [SMHasher](https://github.com/aappleby/smhasher) for non-cryptogrpahic hash functions

The test results for SMHasher are in [tifuhash.smhasher.results.1Gb.txt](https://github.com/dosaygo-coder-0/tifuhash/blob/master/tifuhash.smhasher.results.1Gb.txt) and the results for PractRand are in [tifuhash.practrand.results.1Gb.txt](https://github.com/dosaygo-coder-0/tifuhash/blob/master/tifuhash.practrand.results.1Gb.txt)

# Installing
 
 `npm install tifuhash`
 
 # Using
 
 ```js
 const tifu = require('tifuhash');
 
 const message = 'The medium is the message.';
 const number = 333333333;
 const float = Math.PI;
 
 tifu.hash( message ); // OK
 tifu.hash( number ); // OK
 tifu.hash( float ); // OK
 tifu.hash( ); // empty message - OK
 ```
 
# Construction

- Novel: Based on continued fractions and Egyptian fractions
- Small: Uses two 64 bit floating point numbers for calculation
- Versatile: Can hash arbitrary length string messages, integers and floats
- Fast: Apart from using 64 bit FPA, it has only a few operations per message byte ( it can probably be efficiently implemented in hardware)
- Amazing Properties: Somehow, this tiny, maths-operation-only hash passess PractRand ( WTF! ), when iterated on its own output and when the *entire* resulting hash stream is concatenated together to make a binary output.
- Novel: Searching Google for "continued fraction hash algorithm" and "Egyptian fraction hash algorithm" produces no other efforts
- Novel: using division, or using floating point division, and discarding the high-order-bits ( as we do here ) is not used nor studied so much, if at all, in hash construction
- Universality: It can be parameterized by:
  - Setting the initial state of the two 64 bit floats
  - Including an additional constant summand at each step ( perhaps a different one for each 64 bit state )
  - Including different additional summands at each step ( maybe the ouput of a LFSR )
 - Because it has good properties ( independence of bits as demonstrated by passing PractRand ), and can be parameterized, we hypothesize that it is universal, possibly even strongly universal.
 - Tiny: Yep, it's memorizable and only a few lines of code
 
 ## Tifuhash limitations and opportunities for improvement
 
  - current implementations, while still fast, are very slow compared to existing top hash functions, even tho the code of tifuhash is simple
    - this can probably be improved in optimized implementations, but floating point sets a hard limit on how fast tifuhash can be
  - uses floating point extensively, so hashes can differ depending on implementation and architecture
    - this may be able to be improved using techniques developed to allow other floating point dependent calculations to be reproducible across languages and architectures
 
 # Parameterization and Universality

 Universal hash algorithms define a family of hash algorithms. Tifuhash is designed to be universal, and while not API for parameterizing the algorithm is available yet, that will come. I think we can probably use the "seed" construction, used by SMHasher, to setup the intial state, as one way to explore parameterization. Accepting seeds into the initial state is already implemented in the C++ reference code.

 Also no built in method for generating real entropy in order to form parameters to universal hash parameterization, but that will probably come, or use code I developed for `dosycrypt`
 
 # Links

 - [tifuhash on npm](https://www.npmjs.com/package/tifuhash)
