#!/usr/bin/env node

if ( process.argv[2] ) {
  const fs = require('fs');
  const {default: floppsy} = require('./node.js');
  const {hash} = floppsy;
  let output = 1<<30;
  const total = output;
  const batch = 1<<23;
  let j = 0;
  const str = new Uint8Array( batch );
  console.log(`Outputting ${output} bytes...`);
  let HASH = new Uint8Array( 8 );
  while(output-=8) {
    HASH = hash( HASH, { out_format: 'bytes'}, output );
    str.set( HASH, j );
    j+=8;
    if ( j >= batch ) {
      console.log(`Writing ${batch} bytes...` );
      fs.appendFileSync( process.argv[2], str, 'binary' );
      j = 0;
      console.log( `Done. ${Math.ceil(1000*output/total)/10}% remains...`);
    }
  }
        if ( j > 0 ) {
    console.log(`Writing ${batch} bytes...` );
    fs.appendFileSync( process.argv[2], str, 'binary' );
    j = 0;
    console.log( `Done. ${Math.ceil(1000*output/total)/10}% remains...`);
    console.log('Done!');

  }
} else {
  const path = require('path');
  console.log(`
     
    Usage: ${path.basename(process.argv[1])} <output.filename>
      
      Supply an output filename to save RNG output.

  `);
}
