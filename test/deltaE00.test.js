"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

// Guard BOTH shipped artifacts: the readable build and the minified build that
// jsDelivr also serves. A bug that survives minification (or a stale rebuild)
// is caught here rather than by end users.
const ARTIFACTS = ["../Colours.js", "../Colours.min.js"];

/**
 * Official CIEDE2000 test data from:
 *   G. Sharma, W. Wu, E. N. Dalal, "The CIEDE2000 color-difference formula:
 *   Implementation notes, supplementary test data, and mathematical observations",
 *   Color Research & Application, 30(1):21-30, 2005.
 *   https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/
 *
 * Each row is [L1, a1, b1, L2, a2, b2, expected dE00]. Expected values are the
 * paper's published results, rounded to 4 decimal places. These 34 pairs are
 * specifically chosen to exercise every branch of the formula (hue wrap-around,
 * the rotation term, the a' scaling, near-neutral colours, etc.). If any of the
 * historical bugs (θ sign, hue normalization) regresses, this suite fails.
 */
const SHARMA_CASES = [
	[50.0000, 2.6772, -79.7751, 50.0000, 0.0000, -82.7485, 2.0425],
	[50.0000, 3.1571, -77.2803, 50.0000, 0.0000, -82.7485, 2.8615],
	[50.0000, 2.8361, -74.0200, 50.0000, 0.0000, -82.7485, 3.4412],
	[50.0000, -1.3802, -84.2814, 50.0000, 0.0000, -82.7485, 1.0000],
	[50.0000, -1.1848, -84.8006, 50.0000, 0.0000, -82.7485, 1.0000],
	[50.0000, -0.9009, -85.5211, 50.0000, 0.0000, -82.7485, 1.0000],
	[50.0000, 0.0000, 0.0000, 50.0000, -1.0000, 2.0000, 2.3669],
	[50.0000, -1.0000, 2.0000, 50.0000, 0.0000, 0.0000, 2.3669],
	[50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0009, 7.1792],
	[50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0010, 7.1792],
	[50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0011, 7.2195],
	[50.0000, 2.4900, -0.0010, 50.0000, -2.4900, 0.0012, 7.2195],
	[50.0000, -0.0010, 2.4900, 50.0000, 0.0009, -2.4900, 4.8045],
	[50.0000, -0.0010, 2.4900, 50.0000, 0.0010, -2.4900, 4.8045],
	[50.0000, -0.0010, 2.4900, 50.0000, 0.0011, -2.4900, 4.7461],
	[50.0000, 2.5000, 0.0000, 50.0000, 0.0000, -2.5000, 4.3065],
	[50.0000, 2.5000, 0.0000, 73.0000, 25.0000, -18.0000, 27.1492],
	[50.0000, 2.5000, 0.0000, 61.0000, -5.0000, 29.0000, 22.8977],
	[50.0000, 2.5000, 0.0000, 56.0000, -27.0000, -3.0000, 31.9030],
	[50.0000, 2.5000, 0.0000, 58.0000, 24.0000, 15.0000, 19.4535],
	[50.0000, 2.5000, 0.0000, 50.0000, 3.1736, 0.5854, 1.0000],
	[50.0000, 2.5000, 0.0000, 50.0000, 3.2972, 0.0000, 1.0000],
	[50.0000, 2.5000, 0.0000, 50.0000, 1.8634, 0.5757, 1.0000],
	[50.0000, 2.5000, 0.0000, 50.0000, 3.2592, 0.3350, 1.0000],
	[60.2574, -34.0099, 36.2677, 60.4626, -34.1751, 39.4387, 1.2644],
	[63.0109, -31.0961, -5.8663, 62.8187, -29.7946, -4.0864, 1.2630],
	[61.2901, 3.7196, -5.3901, 61.4292, 2.2480, -4.9620, 1.8731],
	[35.0831, -44.1164, 3.7933, 35.0232, -40.0716, 1.5901, 1.8645],
	[22.7233, 20.0904, -46.6940, 23.0331, 14.9730, -42.5619, 2.0373],
	[36.4612, 47.8580, 18.3852, 36.2715, 50.5065, 21.2231, 1.4146],
	[90.8027, -2.0831, 1.4410, 91.1528, -1.6435, 0.0447, 1.4441],
	[90.9257, -0.5406, -0.9208, 88.6381, -0.8985, -0.7239, 1.5381],
	[6.7747, -0.2908, -2.4247, 5.8714, -0.0985, -2.2286, 0.6377],
	[2.0776, 0.0795, -1.1350, 0.9033, -0.0636, -0.5514, 0.9082],
];

for (const artifact of ARTIFACTS) {
	const Colour = require(artifact);
	const tag = `[${artifact.replace("../", "")}]`;

	// One subtest per Sharma pair, so the runner prints (and can fail) each case
	// individually. `n` is 1-based to match the row order in the paper's Table 1.
	SHARMA_CASES.forEach(([L1, a1, b1, L2, a2, b2, expected], i) => {
		const n = String(i + 1).padStart(2, "0");
		test(`Sharma #${n}: dE00([${L1},${a1},${b1}], [${L2},${a2},${b2}]) = ${expected.toFixed(4)} ${tag}`, () => {
			const got = Colour.deltaE00([L1, a1, b1], [L2, a2, b2]);
			assert.ok(
				Math.abs(got - expected) < 1e-4,
				`got ${got.toFixed(4)}, expected ${expected.toFixed(4)}`,
			);
		});

		test(`Sharma #${n}: dE00 is symmetric ${tag}`, () => {
			const forward = Colour.deltaE00([L1, a1, b1], [L2, a2, b2]);
			const reverse = Colour.deltaE00([L2, a2, b2], [L1, a1, b1]);
			assert.ok(
				Math.abs(forward - reverse) < 1e-10,
				`asymmetry: ${forward} vs ${reverse}`,
			);
		});
	});

	test(`deltaE00 of a colour with itself is 0 ${tag}`, () => {
		assert.equal(Colour.deltaE00([50, 2.5, 0], [50, 2.5, 0]), 0);
	});

	test(`hex2rgba parses 6-digit hex ${tag}`, () => {
		assert.deepEqual(Colour.hex2rgba("#FF8800"), [255, 136, 0, 1]);
		assert.deepEqual(Colour.hex2rgba("#000000"), [0, 0, 0, 1]);
		assert.deepEqual(Colour.hex2rgba("#FFFFFF"), [255, 255, 255, 1]);
	});

	test(`hex2rgba parses 8-digit hex (RRGGBBAA) with correct byte order ${tag}`, () => {
		assert.deepEqual(Colour.hex2rgba("#FF8800CC"), [255, 136, 0, 0xcc / 255]);
		assert.deepEqual(Colour.hex2rgba("#FFFFFFFF"), [255, 255, 255, 1]);
		assert.deepEqual(Colour.hex2rgba("#00000000"), [0, 0, 0, 0]);
	});

	test(`hex2rgba expands 3- and 4-digit shorthand ${tag}`, () => {
		assert.deepEqual(Colour.hex2rgba("#F80"), [255, 136, 0, 1]);
		assert.deepEqual(Colour.hex2rgba("#F80F"), [255, 136, 0, 1]);
	});

	test(`hex2rgba rejects invalid input ${tag}`, () => {
		assert.throws(() => Colour.hex2rgba("#GG0000"));
		assert.throws(() => Colour.hex2rgba("#12345"));
	});

	test(`hex2lab converts HEX straight to CIELAB ${tag}`, () => {
		const [L, a, b] = Colour.hex2lab("#FF0000");
		assert.ok(Math.abs(L - 53.24) < 0.05, `L=${L}`);
		assert.ok(Math.abs(a - 80.09) < 0.05, `a=${a}`);
		assert.ok(Math.abs(b - 67.2) < 0.05, `b=${b}`);
		// hex2lab must agree with the rgba2lab path it delegates to.
		assert.deepEqual(
			Colour.hex2lab("#3C8A21"),
			Colour.rgba2lab(0x3c, 0x8a, 0x21, 1),
		);
	});

	test(`rgb2xyz / xyz2lab produce known sRGB-D65 values for pure red ${tag}`, () => {
		const [L, a, b] = Colour.rgba2lab(255, 0, 0, 1);
		assert.ok(Math.abs(L - 53.24) < 0.05, `L=${L}`);
		assert.ok(Math.abs(a - 80.09) < 0.05, `a=${a}`);
		assert.ok(Math.abs(b - 67.2) < 0.05, `b=${b}`);
	});

	test(`lab -> rgba round-trips within rounding tolerance ${tag}`, () => {
		for (const rgb of [
			[255, 0, 0],
			[0, 255, 0],
			[0, 0, 255],
			[123, 45, 67],
			[255, 255, 255],
		]) {
			const [L, a, b] = Colour.rgba2lab(rgb[0], rgb[1], rgb[2], 1);
			const [r, g, bl] = Colour.lab2rgba(L, a, b);
			assert.ok(Math.abs(r - rgb[0]) <= 1, `R ${r} vs ${rgb[0]}`);
			assert.ok(Math.abs(g - rgb[1]) <= 1, `G ${g} vs ${rgb[1]}`);
			assert.ok(Math.abs(bl - rgb[2]) <= 1, `B ${bl} vs ${rgb[2]}`);
		}
	});

	test(`adjustLightness preserves the original alpha ${tag}`, () => {
		const [, , , alpha] = Colour.adjustLightness(255, 0, 0, 0.5, -0.2);
		assert.equal(alpha, 0.5);
	});
} // end for (artifact of ARTIFACTS)
