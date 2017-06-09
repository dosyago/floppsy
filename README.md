# tifuhash

TIny Fast Universal Hash - that's the aim anyway

# Construction

- Novel: Based on continued fractions and Egyptian fractions
- Small: Uses two 64 bit floating point integers for calculation
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
 
 # Parameterization
 
 No API for parameterization as yet, but that will come. Also no built in method for generating real entropy in order to form parameters to universal hash parameterization, but that will probably come, or use code I developed for `dosycrypt`
 
 
