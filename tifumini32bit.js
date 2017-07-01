"use strict";
{
  // Note Tifu32 has different constants for its internal state than Tifu64
  // It still has 128 bits of internal state, it just produces a 32 bit hash
  // FIXME: does not work with Unicode because `.charCodeAt(0)` does not encompass Unicode
  // as per the issue already identifying this 
  // https://github.com/dosaygo-coder-0/tifuhash/issues/1

  const UTF8Str = require('utf8str');
  const tifu32 = {
    hash: f, test_hash
  };

  try { module.exports = tifu32; } catch(e) { Object.assign( self, { tifu32 } ) }

  function f( m = '', ...n ) {
    if ( n.length == 0 ) {
      // seed only
      n = [m];
    }
    const s = parseFloat(n.length ? n.pop() : 0);
    m = Array.from(m).concat(n);
    const isFloat = m.every(x => !isNaN(parseFloat(x)));
    if ( isFloat ) {
      m = m.map( x => parseFloat(x));
    } else {
      m = new UTF8Str(m.join('')).bytes;
    }
    let a=new Float64Array(4);
    a[0] = 1; 
    a[2] = s ? Math.pow(s+1/s, 1/2) : 3;
    a[3] = s ? Math.pow(s+1/s, 1/5) : 7;
    m.forEach((x,i) => {
      a[1] = (x+i+1)/a[3];
      a[2] += a[0]/a[1]; a[2] = 1/a[2];
      a[3] += x; a[3] = a[0]/a[3];
      a[0] = a[1]+1;
    });
    a[2] *= Math.PI+a[3];
    a[3] *= Math.E+a[2];  
    const h = new Uint32Array(a.buffer);
    return (h[4]^h[5]^h[6]^h[7])>>>0;
  }

  function test_hash() {
    // useful for strings
    console.log("strings...");                                
    console.log(f("analyze this",0));                           // 2587049505
    console.log(f("analyze thit",0));                           // 2523560067
    console.log(f("analyze that",0));                           // 1994125995
    // or numbers
    console.log("numbers...");
    console.log(f(1,2,3,4,5,0));                                // 3120845206
    console.log(f(4,3,2,1,0,5));                                // 3487245198
    console.log(f(4,3,2,0,1,5));                                // 451932417
    // or floats
    console.log("floats...");
    console.log(f(1,2,3,4+1e-15,5.000000001,0));                // 3127534970 
    console.log(f(Math.PI,Math.E,1<<30,1/(1<<31),0));           // 1471402665 
    // or tiny floats
    console.log("tiiiny floats...");
    console.log(f(1,2,3+1e-15,4,5,0));                          // 3120845212
    console.log(f(1,2,3+2e-15,4,5,0));                          // 3120845209
    console.log(f(1,2,3+3e-15,4,5,0));                          // 3120845410
    console.log(f(0,1,2,3+4e-15,4,5));                          // 2189561977
    console.log(f(0,1,2,3,4+1e-15,5));                          // 2189561982
    // or just nothing but seed
    console.log("seeds...");
    console.log(f(0));                                          // 2702599175
    console.log(f(1));                                          // 3794067143
    console.log(f(Math.PI));                                    // 2450270459
    // or maybe an rng? 
    console.log("rng?");
    console.log(f(0), f(f(0)), f(f(f(0))));                     // 2702599175 3590320966 2801714996
  }
}

