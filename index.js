// 64 bit hashes
"use strict";
{
  test();
  evaluate();

  function evaluate() {
    if ( ! process.argv[2] ) {
      console.warn( "Filename for output required" ); 
      return;
    }
    const fs = require('fs'); 
    let batch = 1<<10;
    let i = 1<<24 >> 3;
    let str = '';
    let HASH = '';
    while( i-- ) {
      if ( str.length == batch ) {
        fs.appendFileSync( process.argv[2], str, 'binary' );
        str = '';
      }
      HASH = hash( HASH + i, { out_format : 'binary' } ); // 8 bytes 
      str += HASH;
    }
  }

  function pad( width, str ) {
    const padding = new Array( Math.max( 0, width - str.length ) + 1 ).join('0');
    return padding + str;
  }

  // Continued Fractions Hashing 
  function q( state, last_val, val, index ) {
    state[0] += (last_val + index +  1 ) / ( index + 2 + val );
    state[0] = 1.0 / state[0];
    state[1] += val;
    state[1] = (1.0 + index) / state[1];
    //console.log( `After value ${val} at index ${index}, state is ${state[0]}, ${state[1]}` );
  }

  function round( msg, state ) {
    let last_val = 1;
    msg.forEach( (val,index) => ( q(state, last_val, val, index), last_val = val ) );
    q(state,last_val, 3,0); 
    q(state,3,2, 1);
    q(state,2,1, 2);
  }

  function setup( state ) {
    state[0] = 3;
    state[1] = 1/7;
  }

  function hash( msg = '', { out_format : out_format = 'hex' } = {}) {
    msg = msg.split('').map( v => v.charCodeAt(0) );
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

  function test() {
    console.log( pad( 10, '' ), hash() );
    console.log( pad( 10, 'abc'), hash('abc') );
    console.log( pad( 10, 'abd'), hash('abd') );
    console.log( pad( 10, 'cris'), hash('cris') );
  }

  module.exports = {
    hash, evaluate
  };
}
