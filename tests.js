"use strict";
{
  dchest_tests();

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
}
