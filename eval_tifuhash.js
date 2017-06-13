"use strict";
{
	const fs = require('fs');
	const hash = require('tifuhash').hash;
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
}
