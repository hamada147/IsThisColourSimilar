/**
 * Colour class
 * Represet the colour object and it's different types (HEX, RGBA, XYZ, LAB)
 * This class have the ability to do the following
 * 1. Convert HEX to RGBA
 * 2. Convert RGB to XYZ
 * 3. Convert XYZ to LAB
 * 4. Calculate Delta E00 between two LAB colour (Main purpose)
 * @author Ahmed Moussa <moussa.ahmed95@gmail.com>
 * @version 1.3
 */
class Colour {
  /**
   * Convert HEX to LAB
   * @param {[string]} hex hex colour value desired to be converted to LAB
   */
  static HEX2LAB(hex) {
  	const [R, G, b, a] = Colour.HEX2RGBA(hex);
    const [X, Y, Z] = Colour.RGB2XYZ(R, G, b, a);
    const [L, A, B] = Colour.XYZ2LAB(X, Y, Z);
    return [L, A, B];
  }
  /**
   * Convert HEX to RGBA
   * @param {[string]} hex hex colour value desired to be converted to RGBA
   */
  static HEX2RGBA(hex) {
  	let c;
    if (hex.charAt(0) == "#") {
    	c = hex.substring(1).split('');
    }
    if (c.length > 6 || c.length < 3) {
    	throw new Error(`HEX colour must be 3 or 6 values. You provided it ${c.length}`);
    }
    if(c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    let R = (c >> 16) & 255;
    let G = (c >> 8) & 255
    let B = c & 255
    let A = 1;
    return [R, G, B, A];
  }
  /**
   * Convert RGB to XYZ
   * @param {[Number]} R     Red value from 0 to 255
   * @param {[Number]} G     Green value from 0 to 255
   * @param {[Number]} B     Blue value from 0 to 255
   * @param {Number} [A=1] Obacity value from 0 to 1 with a default value of 1 if not sent
   */
  static RGB2XYZ(R, G, B, A = 1) {
  	if (R > 255) {
    	console.warn('Red value was higher than 255. It has been set to 255.');
      R = 255;
    } else if (R < 0) {
    	console.warn('Red value was smaller than 0. It has been set to 0.');
      R = 0;
    }
    if (G > 255) {
    	console.warn('Green value was higher than 255. It has been set to 255.');
      G = 255;
    } else if (G < 0) {
    	console.warn('Green value was smaller than 0. It has been set to 0.');
      G = 0;
    }
    if (B > 255) {
    	console.warn('Blue value was higher than 255. It has been set to 255.');
      B = 255;
    } else if (B < 0) {
    	console.warn('Blue value was smaller than 0. It has been set to 0.');
      B = 0;
    }
    if (A > 1) {
    	console.warn('Obacity value was higher than 1. It has been set to 1.');
    	A = 1;
    } else if (A < 0) {
        console.warn('Obacity value was smaller than 0. It has been set to 0.');
    	A = 0;
    }
    let r = R / 255;
    let g = G / 255;
    let b = B / 255;
    // step 1
    if (r > 0.04045) {
      r = Math.pow((( r + 0.055 ) / 1.055 ), 2.4);
    } else {
      r = r / 12.92;
    }
    if (g > 0.04045) {
      g = Math.pow((( g + 0.055 ) / 1.055 ), 2.4);
    } else {
      g = g / 12.92;
    }
    if (b > 0.04045) {
      b = Math.pow((( b + 0.055 ) / 1.055 ), 2.4);
    } else {
      b = b / 12.92;
    }
    // step 2
    r = r * 100;
    g = g * 100;
    b = b * 100;
    // step 3
    const X = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
    const Y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
    const Z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
    return [X, Y, Z];
  }
  /**
   * Convert XYZ to LAB
   * @param {[Number]} X Value
   * @param {[Number]} Y Value
   * @param {[Number]} Z Value
   */
  static XYZ2LAB(X, Y, Z) {
    // using 10o Observer (CIE 1964)
    // CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
    const ReferenceX = 94.811;
    const ReferenceY = 100;
    const ReferenceZ = 107.304;
    // step 1
    let x = X / ReferenceX;
    let y = Y / ReferenceY;
    let z = Z / ReferenceZ;
    // step 2
    if ( x > 0.008856 ) {
      x = Math.pow(x, ( 1/3 ));
    } else{
      x = ( 7.787 * x ) + ( 16 / 116 );
    }
    if ( y > 0.008856 ) {
      y = Math.pow(y, ( 1/3 ));
    } else{
      y = ( 7.787 * y ) + ( 16 / 116 );
    }
    if ( z > 0.008856 ) {
      z = Math.pow(z, ( 1/3 ));
    } else{
      z = ( 7.787 * z ) + ( 16 / 116 );
    }
    // step 3
    const L = ( 116 * y ) - 16;
    const A = 500 * ( x - y );
    const B = 200 * ( y - z );
    return [L, A, B];
  }
  /**
   * The difference between two given colours with respect to the human eye
   * @param {[type]} l1 Colour 1
   * @param {[type]} a1 Colour 1
   * @param {[type]} b1 Colour 1
   * @param {[type]} l2 Colour 2
   * @param {[type]} a2 Colour 2
   * @param {[type]} b2 Colour 2
   */
  static DeltaE00(l1, a1, b1, l2, a2, b2) {
  	// Utility functions added to Math Object
    Math.rad2deg = function(rad) {
      return 360 * rad / (2 * Math.PI);
    };
    Math.deg2rad = function(deg) {
      return (2 * Math.PI * deg) / 360;
    };
    // Start Equation
    // Equation exist on the following URL http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
    const avgL = (l1 + l2) / 2;
    const C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    const C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
    const avgC = (C1 + C2) / 2;
    const G = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;

    const A1p = a1 * (1 + G);
    const A2p = a2 * (1 + G);

    const C1p = Math.sqrt(Math.pow(A1p, 2) + Math.pow(b1, 2));
    const C2p = Math.sqrt(Math.pow(A2p, 2) + Math.pow(b2, 2));

    const avgCp = (C1p + C2p) / 2;

    let h1p = Math.rad2deg(Math.atan2(b1, A1p));
    if(h1p < 0) {
      h1p = h1p + 360;
    }

    let h2p = Math.rad2deg(Math.atan2(b2, A2p));
    if(h2p < 0) {
      h2p = h2p + 360;
    }

    const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h1p) / 2;

    const T = 1 - 0.17 * Math.cos(Math.deg2rad(avghp - 30)) + 0.24 * Math.cos(Math.deg2rad(2 * avghp)) + 0.32 * Math.cos(Math.deg2rad(3 * avghp + 6)) - 0.2 * Math.cos(Math.deg2rad(4 * avghp - 63));

    let deltahp = h2p - h1p;
    if(Math.abs(deltahp) > 180){
      if (h2p <= h1p) {
        deltahp += 360;
      } else {
        deltahp -= 360;
      }
    }

    const delta_lp = l2 - l1;
    const delta_cp = C2p - C1p;

    deltahp = 2 * Math.sqrt(C1p * C2p) * Math.sin(Math.deg2rad(deltahp) / 2);

    const Sl = 1 + ((0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2)));
    const Sc = 1 + 0.045 * avgCp;
    const Sh = 1 + 0.015 * avgCp * T;

    const deltaro = 30 * Math.exp( - (Math.pow((avghp - 275) / 25, 2)));
    const Rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
    const Rt = -Rc * Math.sin(2 * Math.deg2rad(deltaro));

    const kl = 1;
    const kc = 1;
    const kh = 1;

    const deltaE = Math.sqrt(Math.pow(delta_lp / (kl * Sl), 2) + Math.pow(delta_cp / (kc * Sc), 2) + Math.pow(deltahp / (kh * Sh), 2) + Rt * (delta_cp / (kc * Sc)) * (deltahp / (kh * Sh)));

    return deltaE;
  }
}
