"use strict";
/**
 * Colour class with accurate color space conversions (CIELAB D65) and Delta E 2000
 * Supports HEX (3, 4, 6, 8 digits), RGB, XYZ, and LAB conversions.
 * @author Ahmed Moussa <moussa.ahmed95@gmail.com>
 * @version 3.0
 */
class Colour {
    /**
     * Convert HEX to LAB color space
     * @param hex - Supported formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
     * @returns [L, a, b] tuple
     */
    static hex2lab(hex) {
        const [r, g, b] = Colour.hex2rgba(hex);
        return Colour.rgba2lab(r, g, b, 1);
    }
    /**
     * Convert RGBA to LAB color space
     * @returns [L, a, b] tuple
     */
    static rgba2lab(r, g, b, a) {
        const [x, y, z] = Colour.rgb2xyz(r, g, b);
        return Colour.xyz2lab(x, y, z);
    }
    /**
     * Convert LAB to RGBA color space
     * @returns [R, G, B, A] tuple (A always 1)
     */
    static lab2rgba(l, a, b) {
        const [x, y, z] = Colour.lab2xyz(l, a, b);
        return [...Colour.xyz2rgba(x, y, z), 1];
    }
    /**
     * Convert HEX to RGBA color space
     * @param hex - Supported formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
     * @returns [R, G, B, A] tuple (A defaults to 1)
     */
    static hex2rgba(hex) {
        const normalized = hex.replace(/^#/, "").toUpperCase();
        const validChars = /^[0-9A-F]+$/i.test(normalized);
        if (!validChars || ![3, 4, 6, 8].includes(normalized.length)) {
            throw new Error(`Invalid HEX format: ${hex}`);
        }
        let expanded = normalized;
        if ([3, 4].includes(normalized.length)) {
            expanded = normalized.split("").map((c) => c + c).join("");
        }
        const parsed = parseInt(expanded, 16);
        let r, g, b, a = 1;
        if (expanded.length === 8) {
            a = ((parsed & 0xFF) / 255);
            r = (parsed >> 16) & 0xFF;
            g = (parsed >> 8) & 0xFF;
            b = parsed & 0xFF;
        }
        else {
            r = (parsed >> 16) & 0xFF;
            g = (parsed >> 8) & 0xFF;
            b = parsed & 0xFF;
        }
        return [
            Math.min(255, Math.max(0, r)),
            Math.min(255, Math.max(0, g)),
            Math.min(255, Math.max(0, b)),
            Math.min(1, Math.max(0, a))
        ];
    }
    /**
     * Convert RGB to XYZ color space
     */
    static rgb2xyz(r, g, b) {
        const linearize = (c) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
        const [lr, lg, lb] = [r / 255, g / 255, b / 255]
            .map((c) => linearize(c) * 100);
        return [
            lr * 0.4124564 + lg * 0.3575761 + lb * 0.1804375,
            lr * 0.2126729 + lg * 0.7151522 + lb * 0.0721750,
            lr * 0.0193339 + lg * 0.1191920 + lb * 0.9503041
        ];
    }
    /**
     * Convert XYZ to RGBA color space
     */
    static xyz2rgba(x, y, z) {
        const normalize = (c) => {
            c = c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
            return Math.round(Math.min(255, Math.max(0, c * 255)));
        };
        const xyz = [x / 100, y / 100, z / 100];
        const r = xyz[0] * 3.2404542 + xyz[1] * -1.5371385 + xyz[2] * -0.4985314;
        const g = xyz[0] * -0.9692660 + xyz[1] * 1.8760108 + xyz[2] * 0.0415560;
        const b = xyz[0] * 0.0556434 + xyz[1] * -0.2040259 + xyz[2] * 1.0572252;
        return [normalize(r), normalize(g), normalize(b)];
    }
    /**
     * Convert XYZ to LAB color space
     */
    static xyz2lab(x, y, z) {
        const f = (t) => t > 0.008856 ? Math.pow(t, 1 / 3) : (7.787 * t) + (16 / 116);
        const fx = f(x / Colour.REF_X);
        const fy = f(y / Colour.REF_Y);
        const fz = f(z / Colour.REF_Z);
        return [
            116 * fy - 16,
            500 * (fx - fy),
            200 * (fy - fz)
        ];
    }
    /**
     * Convert LAB to XYZ color space
     */
    static lab2xyz(l, a, b) {
        const y = (l + 16) / 116;
        const x = a / 500 + y;
        const z = y - b / 200;
        const inverseF = (t) => t > 0.2068966 ? Math.pow(t, 3) : (t - 16 / 116) / 7.787;
        return [
            inverseF(x) * Colour.REF_X,
            inverseF(y) * Colour.REF_Y,
            inverseF(z) * Colour.REF_Z
        ];
    }
    /**
     * Calculate Delta E 2000 color difference
     */
    static deltaE00(lab1, lab2) {
        const [L1, a1, b1] = lab1;
        const [L2, a2, b2] = lab2;
        // Helper functions
        const rad2deg = (rad) => (rad * 180) / Math.PI;
        const deg2rad = (deg) => (deg * Math.PI) / 180;
        // Weighting factors
        const kL = 1, kC = 1, kH = 1;
        // Step 1: Calculate CIELAB values
        const C1 = Math.sqrt(a1 ** 2 + b1 ** 2);
        const C2 = Math.sqrt(a2 ** 2 + b2 ** 2);
        const avgC = (C1 + C2) / 2;
        const G = 0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7)));
        // Step 2: Calculate a', C', h'
        const a1p = a1 * (1 + G);
        const a2p = a2 * (1 + G);
        const C1p = Math.sqrt(a1p ** 2 + b1 ** 2);
        const C2p = Math.sqrt(a2p ** 2 + b2 ** 2);
        const h1p = (b1 === 0 && a1p === 0) ? 0 : rad2deg(Math.atan2(b1, a1p)) % 360;
        const h2p = (b2 === 0 && a2p === 0) ? 0 : rad2deg(Math.atan2(b2, a2p)) % 360;
        // Step 3: Calculate ΔL', ΔC', ΔH'
        const Lp = L2 - L1;
        const Cp = C2p - C1p;
        let hp = 0;
        if (C1p * C2p !== 0) {
            hp = h2p - h1p;
            if (hp > 180) {
                hp -= 360;
            }
            else if (hp < -180) {
                hp += 360;
            }
        }
        const Hp = 2 * Math.sqrt(C1p * C2p) * Math.sin(deg2rad(hp) / 2);
        // Step 4: Calculate weighting functions
        const avgLp = (L1 + L2) / 2;
        const avgCp = (C1p + C2p) / 2;
        let avghp = (h1p + h2p) / 2;
        if (Math.abs(h1p - h2p) > 180) {
            avghp += 180;
        }
        const T = 1 - 0.17 * Math.cos(deg2rad(avghp - 30))
            + 0.24 * Math.cos(deg2rad(2 * avghp))
            + 0.32 * Math.cos(deg2rad(3 * avghp + 6))
            - 0.2 * Math.cos(deg2rad(4 * avghp - 63));
        const SL = 1 + (0.015 * (avgLp - 50) ** 2) / Math.sqrt(20 + (avgLp - 50) ** 2);
        const SC = 1 + 0.045 * avgCp;
        const SH = 1 + 0.015 * avgCp * T;
        // Step 5: Calculate rotation term
        const θ = 30 * Math.exp(((-((avghp - 275) / 25)) ** 2));
        const RC = 2 * Math.sqrt(avgCp ** 7 / (avgCp ** 7 + 25 ** 7));
        const RT = -RC * Math.sin(deg2rad(2 * θ));
        // Final calculation
        return Math.sqrt((Lp / (kL * SL)) ** 2 +
            (Cp / (kC * SC)) ** 2 +
            (Hp / (kH * SH)) ** 2 +
            RT * (Cp / (kC * SC)) * (Hp / (kH * SH)));
    }
    /**
     * Adjust color lightness while preserving original alpha
     */
    static adjustLightness(r, g, b, a, factor) {
        const [l, labA, labB] = Colour.rgba2lab(r, g, b, a);
        const adjusted = Math.min(100, Math.max(0, l + l * factor));
        return [...Colour.lab2rgba(adjusted, labA, labB)];
    }
}
// D65 reference values for 2° observer (CIELAB)
Colour.REF_X = 95.047;
Colour.REF_Y = 100.0;
Colour.REF_Z = 108.883;
//# sourceMappingURL=Colours.js.map