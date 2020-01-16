  import t from './index.js';

  dchest_tests();
  smhasher_verification_value();
  standard_test();

  function dchest_tests() {
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
    // Copied from <smhasher_repo>/src/KeysetTests.cpp
    
    const hashbytes = 8;
    const key = new Uint8Array( 256 );
    const hashes = new Uint8Array( 256 * hashbytes );
    const spec8 = {
      out_format: 'bytes',
      bits: hashbytes*8
    };


    // Hash keys of the form {0}, {0,1}, {0,1,2}... up to N=255,using 256-N as
    // the seed
    for ( let i = 0; i < 256; i++ ) {
      key[i] = i;

      const seed = 256-i;

      const hash = t.hash(key.slice(0,i), spec8, seed );
      hashes.set( hash, i*hashbytes );
    }

    // Then hash the result array
  
    const final32 = t.hash(hashes,{ out_format: 'uint32s', bits: 64 }, 0);
    const final8 = t.hash(hashes,{ out_format: 'bytes', bits: 64 }, 0);
    let v_val8 = (final8[0] << 0) | (final8[1] << 8) | (final8[2] << 16) | (final8[3] << 24);
    v_val8 = t.pad(8, v_val8.toString(16));
    let v_val32 = t.pad(8, final32[0].toString(16));
    // note this is different to the C++ value because 
    // of casting differences between JS and C
    console.log( `JS Verification value ${v_val8} ${v_val32}` );
    
    return v_val32;
  }

  function standard_test() {
    t.test();
  }
