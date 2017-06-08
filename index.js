// 64 bit hashes
"use strict";
{
  function evaluate() {
    const fs = require('fs'); 
    let batch = 1<<10;
    let i = 1<<20 >> 3;
    let str = '';
    while( i-- ) {
      if ( str.length == batch ) {
        fs.appendFileSync( process.argv[2], str, 'binary' );
        str = '';
      }
      const HASH = hash( HASH + i ); // 8 bytes 
      str += HASH;
    }
  }

  // THIS IS DESIGNED TO BE MEMORABLE
  function hash( msg ) {
    const X_0 = 77777777;
    const Y_0 = 55555555;
    const Z_0 = 33333333;
    const M_X = 85; // 01010101
    const M_Y = 43; // 85 >> 1 + 1
    const M_Z = 37; // 42 >> 1 == 21 == 3 * 7, so 37 :)
    msg = msg.split('');
    const state = Uint32Array(2);
    state[0] = Y_0;
    state[1] = Z_0;
    const reg = Uint32Array(2); // 2 x 32 bit 'register' ( to avoid JS integer imprecision with large values )
    while( msg.length ) {
      // FIXME : handle unicode correctly
      const chunk = msg.splice( 0, 4 ).map( c => c.codePointAt(0) );
      // Note : These index never get to zero 
      const index = [ message.length, message.length - 1, message.length - 2, message.length - 3];

      // MIX the chunks values and the indexes together
      // sum( chunk_i * index_i * M_X ) // simple
      // Using the registers

      reg[0] = X_0;
      reg[1] = chunk[0] * index[0] * M_X;
      reg[0] += reg[1];
      reg[1] = chunk[1] * index[1] * M_X;
      reg[0] += reg[1];
      reg[1] = chunk[2] * index[2] * M_X;
      reg[0] += reg[1];
      reg[1] = chunk[3] * index[3] * M_X;
      reg[0] += reg[1];

      // update the state
      state[0] = (state[0] * M_Y) + reg[0];
      state[1] = (state[1] * M_Z) + reg[0];

      // Up to this point we just have a pretty much standard
      // Bernstein / Kernighan / Java <String>.hashCode hash
      // Here's where the fun begins
       

    }

  }

}
