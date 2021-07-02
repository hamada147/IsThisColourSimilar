/**
 * Colour class
 * Represet the colour object and it's different types (HEX, RGBA, XYZ, LAB)
 * This class have the ability to do the following
 * 1. Convert HEX to RGBA
 * 2. Convert RGB to XYZ
 * 3. Convert XYZ to LAB
 * 4. Calculate Delta E00 between two LAB colour (Main purpose)
 * @author Ahmed Moussa <moussa.ahmed95@gmail.com>
 * @version 2.0
 */
 class Colour {
	/**
	 * Convert HEX to LAB
	 * @param {[string]} hex hex colour value desired to be converted to LAB
	 */
	static hex2lab(hex) {
		const [r, g, b, a] = Colour.hex2rgba(hex);
		const [x, y, z] = Colour.rgb2xyz(r, g, b, a);
		return Colour.xyz2lab(x, y, z); // [l, a, b]
	}
	/**
	 * Convert RGBA to LAB
	 * @param {[Number]} r     Red value from 0 to 255
	 * @param {[Number]} g     Green value from 0 to 255
	 * @param {[Number]} b     Blue value from 0 to 255
	 */
	static rgba2lab(r, g, b, a = 1) {
		const [x, y, z] = Colour.rgb2xyz(r, g, b, a);
		return Colour.xyz2lab(x, y, z); // [l, a, b]
	}
	/**
	 * Convert LAB to RGBA
	 * @param {[Number]} l
	 * @param {[Number]} a
	 * @param {[Number]} b 
	 */
	static lab2rgba(l, a, b) {
		const [x, y, z] = Colour.lab2xyz(l, a, b);
		return Colour.xyz2rgba(x, y, z); // [r, g, b, a]
	}
	/**
	 * Convert HEX to RGBA
	 * @param {[string]} hex hex colour value desired to be converted to RGBA
	 */
	static hex2rgba(hex) {
		let c;
		if (hex.charAt(0) === "#") {
			c = hex.substring(1).split('');
		}
		if (c.length > 6 || c.length < 3) {
			throw new Error(`HEX colour must be 3 or 6 values. You provided it ${c.length}`);
		}
		if (c.length === 3) {
			c = [c[0], c[0], c[1], c[1], c[2], c[2]];
		}
		c = "0x" + c.join("");
		let r = (c >> 16) & 255;
		let g = (c >> 8) & 255;
		let b = c & 255;
		let a = 1;
		return [r, g, b, a];
	}
	/**
	 * Convert RGB to XYZ
	 * @param {[Number]} r     Red value from 0 to 255
	 * @param {[Number]} g     Green value from 0 to 255
	 * @param {[Number]} b     Blue value from 0 to 255
	 * @param {Number} [a=1]   Obacity value from 0 to 1 with a default value of 1 if not sent
	 */
	static rgb2xyz(r, g, b, a = 1) {
		if (r > 255) {
			// console.warn("Red value was higher than 255. It has been set to 255.");
			r = 255;
		} else if (r < 0) {
			// console.warn("Red value was smaller than 0. It has been set to 0.");
			r = 0;
		}
		if (g > 255) {
			// console.warn("Green value was higher than 255. It has been set to 255.");
			g = 255;
		} else if (g < 0) {
			// console.warn("Green value was smaller than 0. It has been set to 0.");
			g = 0;
		}
		if (b > 255) {
			// console.warn("Blue value was higher than 255. It has been set to 255.");
			b = 255;
		} else if (b < 0) {
			// console.warn("Blue value was smaller than 0. It has been set to 0.");
			b = 0;
		}
		if (a > 1) {
			// console.warn("Obacity value was higher than 1. It has been set to 1.");
			a = 1;
		} else if (a < 0) {
			// console.warn("Obacity value was smaller than 0. It has been set to 0.");
			a = 0;
		}
		r = r / 255;
		g = g / 255;
		b = b / 255;
		// step 1
		if (r > 0.04045) {
			r = Math.pow(((r + 0.055) / 1.055), 2.4);
		} else {
			r = r / 12.92;
		}
		if (g > 0.04045) {
			g = Math.pow(((g + 0.055) / 1.055), 2.4);
		} else {
			g = g / 12.92;
		}
		if (b > 0.04045) {
			b = Math.pow(((b + 0.055) / 1.055), 2.4);
		} else {
			b = b / 12.92;
		}
		// step 2
		r = r * 100;
		g = g * 100;
		b = b * 100;
		// step 3
		const x = (r * 0.4124564) + (g * 0.3575761) + (b * 0.1804375);
		const y = (r * 0.2126729) + (g * 0.7151522) + (b * 0.0721750);
		const z = (r * 0.0193339) + (g * 0.1191920) + (b * 0.9503041);
		return [x, y, z];
	}
	/**
	 * Convert XYZ to RGBA
	 * @param {[Number]} x
	 * @param {[Number]} y
	 * @param {[Number]} z
	 */
	static xyz2rgba(x, y, z) {
		let varX = x / 100;
		let varY = y / 100;
		let varZ = z / 100;

		let varR = (varX *  3.2404542) + (varY * -1.5371385) + (varZ * -0.4985314);
		let varG = (varX * -0.9692660) + (varY *  1.8760108) + (varZ * 0.0415560);
		let varB = (varX *  0.0556434) + (varY * -0.2040259) + (varZ * 1.0572252);

		if ( varR > 0.0031308 ) {
			varR = 1.055 * Math.pow(varR, (1 / 2.4) ) - 0.055;
		} else {
			varR = 12.92 * varR;
		}
		if ( varG > 0.0031308 ) {
			varG = 1.055 * Math.pow(varG, (1 / 2.4) ) - 0.055;
		} else {
			varG = 12.92 * varG;
		}
		if ( varB > 0.0031308 ) {
			varB = 1.055 * Math.pow(varB, (1 / 2.4) ) - 0.055;
		} else {
			varB = 12.92 * varB;
		}

		let r = Math.round(varR * 255);
		let g = Math.round(varG * 255);
		let b = Math.round(varB * 255);

		return [r, g, b, 1];
	}
	/**
	 * Convert XYZ to LAB
	 * @param {[Number]} x Value
	 * @param {[Number]} y Value
	 * @param {[Number]} z Value
	 */
	static xyz2lab(x, y, z) {
		// using 10o Observer (CIE 1964)
		// CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
		const referenceX = 94.811;
		const referenceY = 100;
		const referenceZ = 107.304;
		// step 1
		x = x / referenceX;
		y = y / referenceY;
		z = z / referenceZ;
		// step 2
		if (x > 0.008856) {
			x = Math.pow(x, (1 / 3));
		} else {
			x = (7.787 * x) + (16 / 116);
		}
		if (y > 0.008856) {
			y = Math.pow(y, (1 / 3));
		} else {
			y = (7.787 * y) + (16 / 116);
		}
		if (z > 0.008856) {
			z = Math.pow(z, (1 / 3));
		} else {
			z = (7.787 * z) + (16 / 116);
		}
		// step 3
		const l = (116 * y) - 16;
		const a = 500 * (x - y);
		const b = 200 * (y - z);
		return [l, a, b];
	}
	/**
	 * Convert LAB to XYZ
	 * @param {[Number]} l
	 * @param {[Number]} a
	 * @param {[Number]} b
	 */
	static lab2xyz(l, a, b) {
		// using 10o Observer (CIE 1964)
		// CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
		const referenceX = 94.811;
		const referenceY = 100;
		const referenceZ = 107.304;

		let varY = ( l + 16 ) / 116;
		let varX = a / 500 + varY;
		let varZ = varY - b / 200;

		if ( Math.pow(varY, 3)  > 0.008856 ) {
			varY = Math.pow(varY, 3);
		} else {
			varY = ( varY - 16 / 116 ) / 7.787;
		}
		if ( Math.pow(varX, 3)  > 0.008856 ) {
			varX = Math.pow(varX, 3);
		} else {
			varX = ( varX - 16 / 116 ) / 7.787;
		}
		if ( Math.pow(varZ, 3)  > 0.008856 ) {
			varZ = Math.pow(varZ, 3);
		} else {
			varZ = ( varZ - 16 / 116 ) / 7.787;
		}

		let x = varX * referenceX;
		let y = varY * referenceY;
		let z = varZ * referenceZ;

		return [x, y, z];
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
	static deltaE00(l1, a1, b1, l2, a2, b2) {
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
		const c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
		const c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
		const avgC = (c1 + c2) / 2;
		const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2;

		const a1p = a1 * (1 + g);
		const a2p = a2 * (1 + g);

		const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
		const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));

		const avgCp = (c1p + c2p) / 2;

		let h1p = Math.rad2deg(Math.atan2(b1, a1p));
		if (h1p < 0) {
			h1p = h1p + 360;
		}

		let h2p = Math.rad2deg(Math.atan2(b2, a2p));
		if (h2p < 0) {
			h2p = h2p + 360;
		}

		const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2;

		const t = 1 - 0.17 * Math.cos(Math.deg2rad(avghp - 30)) + 0.24 * Math.cos(Math.deg2rad(2 * avghp)) + 0.32 * Math.cos(Math.deg2rad(3 * avghp + 6)) - 0.2 * Math.cos(Math.deg2rad(4 * avghp - 63));

		let deltahp = h2p - h1p;
		if (Math.abs(deltahp) > 180) {
			if (h2p <= h1p) {
				deltahp += 360;
			} else {
				deltahp -= 360;
			}
		}

		const deltalp = l2 - l1;
		const deltacp = c2p - c1p;

		deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(Math.deg2rad(deltahp) / 2);

		const sl = 1 + ((0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2)));
		const sc = 1 + 0.045 * avgCp;
		const sh = 1 + 0.015 * avgCp * t;

		const deltaro = 30 * Math.exp(-(Math.pow((avghp - 275) / 25, 2)));
		const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)));
		const rt = -rc * Math.sin(2 * Math.deg2rad(deltaro));

		const kl = 1;
		const kc = 1;
		const kh = 1;

		const deltaE = Math.sqrt(Math.pow(deltalp / (kl * sl), 2) + Math.pow(deltacp / (kc * sc), 2) + Math.pow(deltahp / (kh * sh), 2) + rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh)));

		return deltaE;
	}
	/**
	 * Get darker colour of the given colour
	 * @param {[Number]} r     Red value from 0 to 255
	 * @param {[Number]} g     Green value from 0 to 255
	 * @param {[Number]} b     Blue value from 0 to 255
	 */
	static getDarkerColour(r, g, b, a = 1, darkenPercentage = 0.05) {
		let [l1, a1, b1] = Colour.rgba2lab(r, g, b, a);
		l1 -= l1 * darkenPercentage;
		if (l1 < 0) {
			l1 = 0;
		}
		return Colour.lab2rgba(l1, a1, b1); // [R, G, B, A]
	}
	/**
	 * Get brighter colour of the given colour
	 * @param {[Number]} r     Red value from 0 to 255
	 * @param {[Number]} g     Green value from 0 to 255
	 * @param {[Number]} b     Blue value from 0 to 255
	 */
	static getBrighterColour(r, g, b, a = 1, brighterPercentage = 0.05) {
		let [l1, a1, b1] = Colour.rgba2lab(r, g, b, a);
		l1 += l1 * brighterPercentage;
		if (l1 > 100) {
			l1 = 100;
		}
		return Colour.lab2rgba(l1, a1, b1); // [R, G, B, A]
	}
}
