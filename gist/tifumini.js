"use strict";

const tifumini = ( s = 0, m = '', ...n ) => { 
  s = parseFloat(s); 
  m = Array.from(m).concat(n).map(x => isNaN(parseFloat(x)) ? x.charCodeAt(0) : parseFloat(x));
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
};

try { module.exports = tifumini } catch( e ) { Object.assign( self, { tifumini } ) }

