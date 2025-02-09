/**
 * Colour class with accurate color space conversions (CIELAB D65) and Delta E 2000
 * Supports HEX (3, 4, 6, 8 digits), RGB, XYZ, and LAB conversions.
 * @author Ahmed Moussa <moussa.ahmed95@gmail.com>
 * @version 3.0
 */
declare class Colour {
    private static readonly REF_X;
    private static readonly REF_Y;
    private static readonly REF_Z;
    /**
     * Convert HEX to LAB color space
     * @param hex - Supported formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
     * @returns [L, a, b] tuple
     */
    static hex2lab(hex: string): [number, number, number];
    /**
     * Convert RGBA to LAB color space
     * @returns [L, a, b] tuple
     */
    static rgba2lab(r: number, g: number, b: number, a: number): [number, number, number];
    /**
     * Convert LAB to RGBA color space
     * @returns [R, G, B, A] tuple (A always 1)
     */
    static lab2rgba(l: number, a: number, b: number): [number, number, number, number];
    /**
     * Convert HEX to RGBA color space
     * @param hex - Supported formats: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
     * @returns [R, G, B, A] tuple (A defaults to 1)
     */
    static hex2rgba(hex: string): [number, number, number, number];
    /**
     * Convert RGB to XYZ color space
     */
    static rgb2xyz(r: number, g: number, b: number): [number, number, number];
    /**
     * Convert XYZ to RGBA color space
     */
    static xyz2rgba(x: number, y: number, z: number): [number, number, number];
    /**
     * Convert XYZ to LAB color space
     */
    static xyz2lab(x: number, y: number, z: number): [number, number, number];
    /**
     * Convert LAB to XYZ color space
     */
    static lab2xyz(l: number, a: number, b: number): [number, number, number];
    /**
     * Calculate Delta E 2000 color difference
     */
    static deltaE00(lab1: [number, number, number], lab2: [number, number, number]): number;
    /**
     * Adjust color lightness while preserving original alpha
     */
    static adjustLightness(r: number, g: number, b: number, a: number, factor: number): [number, number, number, number];
}
//# sourceMappingURL=Colours.d.ts.map