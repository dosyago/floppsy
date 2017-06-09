// 64 bit hashes
"use strict";
{
  const tifu = {
    test, evaluate, hash
  };

  // Node or browser, either is fine

  try { module.exports = tifu; } catch( e ) { Object.assign( self, { tifu } ); }

  // Continued Fractions Hashing - q function for state update

    function q( state, val, numerator, denominator ) {
      // Continued Fraction mixed with Egyptian fraction "Continued Egyptian Fraction"
      // with denominator = val + pos
      state[0] += numerator / denominator;
      state[0] = 1.0 / state[0];

      // Standard Continued Fraction with a_i = val, b_i = (a_i-1) + i + 1
      state[1] += val;
      state[1] = numerator / state[1];
    }

  // Continued Fractions Hashing - Hash round function 

    function round( msg, state ) {

      let numerator = 1;
      msg.forEach( (val,index) => {
        const pos = index + 1.0;
        const denominator = val + pos; 

        q(state, val, numerator, denominator); 

        // Chain the Continued Egyptian fraction update step
        // So its a_i are a ratio of ( last_val + last_pos ) / ( val + pos )
        numerator = denominator;
      });

      // TODO: devise a new step here
        // The point of the following commented out code
        // was to handle the empty message
        // And do some final transformation after the message is complete
      /*
        q(state,last_val, 3,0); 
        q(state,3,2, 1);
        q(state,2,1, 2);
      */

    }

  // Setup the state 

    function setup( state ) {

      state[0] = 3;
      state[1] = 1/7;

    }

  // Hash Function 

    function hash( msg = '', { out_format : out_format = 'hex' } = {}) {

      if ( typeof msg == 'string' ) {
        msg = msg.split('').map( v => v.charCodeAt(0) );
      } else if ( typeof msg == 'number' ) {
        // TODO: consider improving how we hash a number
        // perhaps by incorporation it into the state somehow
        msg = [ msg ];
      }

      const buf = new ArrayBuffer(16);
      const state = new Float64Array(buf);

      setup( state );
      round( msg, state );

      const output = new Uint8Array(buf);
      let bytes = '';
      if ( out_format == 'hex' ) {
        output.slice(0,4).forEach( v => bytes += pad( 2, v.toString(16) ) );
        output.slice(8,12).forEach( v => bytes += pad( 2, v.toString(16) ) );
      } else if ( out_format == 'binary' ) {
        output.slice(0,4).forEach( v => bytes += String.fromCharCode(v) );
        output.slice(8,12).forEach( v => bytes += String.fromCharCode(v) );
      }
      return bytes;

    }

  // Evaluation ( 16 Mb ) self iteration to output file 

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
      let i = 1<<24 >> 3;
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

    function test() {

      console.log( pad( 10, '' ), hash() );
      console.log( pad( 10, 'abc'), hash('abc') );
      console.log( pad( 10, 'abd'), hash('abd') );
      console.log( pad( 10, 'cris'), hash('cris') );

    }

  // String padding 

    function pad( width, str ) {
      const padding = new Array( Math.max( 0, width - str.length ) + 1 ).join('0');
      return padding + str;
    }
}
