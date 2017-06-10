"use strict";
{
  //dchest_tests();
  smhasher_verification_value();

  function dchest_tests() {
    const t = require('./index.js');
    const cases = [
      {
        run: () => t.hash(0.00000000000000001),
        h: '0000000000000000'
      },
      {
        run: () => t.hash(0.00000000000000002),
        h: '00000000ffffffff'
      },
      {
        run: () => t.hash(0.00000000000000003),
        h: '00000000ffffffff'
      },
      {
        run: () => t.hash(0.00000000000000004),
        h: '00000000ffffffff'
      },
      {
        run: () => t.hash(0.00000000000000005),
        h: '00000000fdffffff'
      },
      {
        run: () => t.hash(1e17),
        h: '5555555597d44646'
      },
      {
        run: () => t.hash(1e18),
        h: '55555555ac43d2d1'
      },
      {
        run: () => t.hash(1e19),
        h: '55555555acd2b64f'
      },
      {
        run: () => t.hash('\x00'),
        h: '0000000000000000'
      },
      {
        run: () => t.hash('\x00\x00'),
        h: '5555555592244992'
      },			
      {
        run: () => t.hash('\x00\x00\x00'),
        h: '0000000000000000'
      },
      {
        run: () => t.hash('\x01'),
        h: '9224499200000000'
      },
      {
        run: () => t.hash('\x02'),
        h: '33333333dedddddd'
      }
    ];

    cases.forEach( (c,i) => {
      const r = c.run();
      console.log( `Running case ${i}`, c.run );
      if ( r == c.h ) {
        console.log( `Case ${i} verified: ${r} == ${c.h}` );
      } else {
        console.log( `ALTERATION: ${r}` );
        console.log( `Case ${i} altered: ${r} !== ${c.h}` );   
      }
    });
  }

  function smhasher_verification_value() {
    const t = require('./index.js');

    // Copied from <smhasher_repo>/src/KeysetTests.cpp
    
    const hashbytes = 8;
    const key = new Uint8Array( 256 );
    const hashes = new Uint8Array( 256 * hashbytes );
    const final = new Uint8Array( hashbytes );
    const spec8 = {
      out_format: 'uint8array',
    };


    // Hash keys of the form {0}, {0,1}, {0,1,2}... up to N=255,using 256-N as
    // the seed
    for ( let i = 0; i < 256; i++ ) {
      key[i] = i;

      // FIXME : we must decide a way to create include seed value 
      const seed = 256-i;

      const hash = t.hash(key.slice(0,i), spec8 );
      hashes.set( hash, i*hashbytes );
    }

    // Then hash the result array
  
    const final = t.hash(hashes,{ out_format: 'uint32array' });

    return final[0].toString(16);
  }
}
