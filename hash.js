  import UTF8Str from 'utf8str';
  import floppsymini32bit from './floppsymini32bit.js';

  const floppsy = {
    test, evaluate, hash, pad
  };

  // Node or browser, either is fine

  export default floppsy;

  // Continued Fractions Hashing - q function for state update

    function q( state, val, numerator, denominator ) {
      // Continued Fraction mixed with Egyptian fraction "Continued Egyptian Fraction"
      // with denominator = val + pos / state[1]
      state[0] += numerator / denominator;
      state[0] = 1.0 / state[0];

      // Standard Continued Fraction with a_i = val, b_i = (a_i-1) + i + 1
      state[1] += val + Math.PI;
      state[1] = numerator / state[1];
    }

  // Continued Fractions Hashing - Hash round function 

    function round( msg, state ) {
      let numerator = 1;

      msg.forEach( (val,index) => {
        const pos = index + 1.0;
        const denominator = (Math.E * val + pos) / state[1]; 

        q(state, val, numerator, denominator); 

        // Chain the Continued Egyptian fraction update step
        // So its a_i are a ratio of ( last_val + last_pos ) / ( val + pos )
        numerator = denominator + 1.0;
      });
    }

  // Setup the state 

    function setup( state, init ) {
      state[0] += init ? Math.pow(init + 1.0/init, 1.0/3) : 3;
      state[1] += init ? Math.pow(init + 1.0/init, 1.0/7) : 1/7;

      //console.log( "state", state[0], state[1] );
    }

  // Hash Function 

    function hash( msg = '', { out_format : out_format = 'hex', bits: bits = 64 } = {}, seed = 0) {
      //console.log( "seed?", seed );
      let number = false;
      if ( typeof msg == 'string' ) {
        msg = new UTF8Str( msg ).bytes;
      } else if ( typeof msg == 'number' ) {
        number = true;
        msg = [ msg ];
      }

      const buf = new ArrayBuffer(16);
      const state = new Float64Array(buf);
      // A new addition, used for combining the high order bits
      const state32 = new Uint32Array(buf);

      const seedbuf = new ArrayBuffer(4);
      const seed32Arr = new Uint32Array(seedbuf);
      const seed8Arr = new Uint8Array(seedbuf);
      seed32Arr[0] = seed;

      // Include the number in state initialization
      const init = seed;
      setup( state, init );
      round( seed8Arr, state );
      round( msg, state );

      const output = new ArrayBuffer(bits == 32 ? 4 : bits == 64 ? 8 : 16);
      const h = new Uint32Array(output);

      // The new combination step
      h[0] = state32[0];
      h[1] = state32[3];
      h[2] = state32[1];
      h[3] = state32[2];

      if ( bits < 128 ) {
        h[0] = state32[0] + state32[3];
        h[1] = state32[1] + state32[2];
      }

      if ( bits < 64 ) {
        h[0] = state32[0] + state32[3] + state32[1] + state32[2];
      }

      let result = '';
      if ( out_format == 'hex' ) {
        result += pad( 8, h[0].toString(16));
        if ( bits > 32 ) {
          result += pad( 8, h[1].toString(16));
        }
        if ( bits > 64 ) {
          result += pad( 8, h[2].toString(16));
          result += pad( 8, h[3].toString(16));
        }
      } else if ( out_format == 'binary' ) {
        const bytes = new Uint8Array(output);
        bytes.forEach( v => result += String.fromCharCode(v) );
      } else if ( out_format == 'bytes' ) {
        result = new Uint8Array(output);
      } else if ( out_format = 'uint32s' ) {
        result = h;
      }
      return result;
    }

  // Evaluation ( 128 Mb ) self iteration to output file 

    function evaluate( fileName ) {
      try {
        if ( ! process.argv[2] && ! fileName ) {
          console.warn( "Filename for output required" ); 
          return;
        }
      } catch(e) {
        console.warn("Evaluate only runs at the command line in Node.");
        return;
      }
      fileName = fileName || process.argv[2];
      const fs = require('fs'); 
      let batch = 1<<10;
      let i = 1<<28 >> 3;
      let str = '';
      let HASH = '';

      while( i-- ) {
        if ( str.length == batch ) {
          fs.appendFileSync( fileName, str, 'binary' );
          str = '';
        }
        HASH = hash( HASH + i, { out_format : 'binary' } ); // 8 bytes 
        str += HASH;
      }
    }

  // Test

    //test();
    function test() {
      console.log( pad( 10, '' ), hash() );
      console.log( pad( 10, 'abc'), hash('abc') );
      console.log( pad( 10, 'abd'), hash('abd') );
      console.log( pad( 10, 'cris'), hash('cris') );
      console.log( pad( 30, "Foo © bar 𝌆 baz ☃ qux"), hash("Foo © bar 𝌆 baz ☃ qux") );
      //floppsy.floppsy32.test_hash();
    }

  // String padding 

    function pad( width, str ) {
      const padding = new Array( Math.max( 0, width - str.length ) + 1 ).join('0');
      return padding + str;
    }
