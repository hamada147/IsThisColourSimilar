# Is This Colour Similar? 🎨

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/fa33bee77e08488dab66c2d05dfeaf14)](https://app.codacy.com/gh/hamada147/IsThisColourSimilar/dashboard)
[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://hamada147.github.io/IsThisColourSimilar/)

A JavaScript implementation of CIEDE2000 - the most accurate color difference algorithm for human perception.

## Features

- 🎯 **Precise Color Comparisons** using Delta E 2000 (CIEDE2000)
- 🔄 **Color Space Conversions**:
    - HEX ↔ RGB ↔ XYZ ↔ CIELAB
    - Supports alpha channels
- 📊 **Perceptual Difference Metrics** with human-readable interpretations
- 🛠 **Color Adjustment Tools** for lightening/darkening colors
- 📱 **Zero Dependencies** - works in browsers and Node.js

## Quick Start

### Installation

```html
<script src="https://cdn.jsdelivr.net/gh/hamada147/IsThisColourSimilar@master/Colours.js"></script>
```
OR use the minified version
```html
<script src="https://cdn.jsdelivr.net/gh/hamada147/IsThisColourSimilar@master/Colours.min.js"></script>
```

## Basic Usage

```javascript
// Convert colors to LAB space
const lab1 = Colour.hex2lab('#ff0000');
const lab2 = Colour.hex2lab('#cc0000');

// Calculate perceptual difference
const deltaE = Colour.deltaE00(lab1, lab2);

console.log(`Color difference: ${deltaE.toFixed(2)}`);
// Output: Color difference: 14.72 (Perceptible at a glance)
```

## API Reference

### Core Methods

`hex2lab(hex: string): [number, number, number]`

Convert HEX to CIELAB color space

```javascript
const [L, a, b] = Colour.hex2lab('#FF5733');
```

`deltaE00(lab1: number[], lab2: number[]): number`

Calculate Delta E 2000 difference

```javascript
const difference = Colour.deltaE00([94, 5, 10], [89, 8, 15]);
```

`adjustLightness(r, g, b, a, factor): [number, number, number, number]`

Adjust color lightness while preserving hue

```javascript
const darkerRed = Colour.adjustLightness(255, 0, 0, 1, -0.2);
```

### Conversion Methods

| Method     | Description	              | I/O Format                   |
|------------|---------------------------|------------------------------|
| hex2rgba() | HEX to RGBA conversion    | `#RRGGBB` → `[R, G, B, A]`   |
| rgba2lab() | RGBA to CIELAB conversion | `[R, G, B, A]` → `[L, a, b]` |
| lab2rgba() | CIELAB to RGBA conversion | `[L, a, b]` → `[R, G, B, A]` |
| rgb2xyz()  | RGB to XYZ conversion     | `[R, G, B]` → `[X, Y, Z]`    |
| xyz2lab()  | XYZ to CIELAB conversion  | `[X, Y, Z]` → `[L, a, b]`    |

## Delta E Interpretation

| ΔE Value | Human Perception               |
|----------|--------------------------------|
| ≤ 1.0    | Imperceptible                  |
| 1-2      | Noticeable on close inspection |
| 2-10     | Perceptible at a glance        |
| 11-49    | Distinct but related colors    |
| 50-100   | Completely different colors    |

## Why CIEDE2000?

Traditional color difference metrics like RGB Euclidean distance don't match human vision. CIEDE2000:

* Accounts for human visual perception nuances
* Compensates for lightness/hue interactions
* Weighted for color region differences
* Industry standard for color-critical applications

![CIEDE2000 Equation](./formula-cie00.png)

## Development

### Build

```shell
git clone https://github.com/hamada147/IsThisColourSimilar.git
cd IsThisColourSimilar
npm install
```

### Browser Demo

Open `index.html` in any modern browser for interactive examples:

* Color difference comparisons
* Lightness adjustment tool
* Real-time conversions

## Story behind this

### Short

I just wanted to have different background color other than the font color so they are both distinguishable by the user
and the text is readable.

### Long

I just wanted to have different background color other than the font color so they are both distinguishable by the user
and the text is readable. And so my journey began. I stumbled upon this question which encouraged me to proceed with my
research on the subject.
[https://stackoverflow.com/questions/15049753/an-algorithm-for-selecting-a-dark-color-similar-to-a-light-color/49170325#49170325](https://stackoverflow.com/questions/15049753/an-algorithm-for-selecting-a-dark-color-similar-to-a-light-color/49170325#49170325)

I started researching with just random words regarding the colour then I stumbled upon colour theory. I know everyone
know it but I didn't. Then I found out tons of stuff that required sometime for me to understand and rethink the subject
with a new perspective.

First of all I would like to highlight a few points and make sure that anyone that is reading this is able to understand
what I'm talking about here.

#### What is a Color Space?

A range of colors can be created by the primary colors of pigment and these colors then define a specific color space.
Color space, also known as the color model (or color system), is an abstract mathematical model which simply describes
the range of colors as tuples of numbers, typically as 3 or 4 values or color components (ex: RGB). Basically speaking,
color space is an elaboration of the coordinate system and subspace. Each color in the system is represented by a
single dot.

Most of us developers uses one of the following color spaces (HEX, RGB, RGBA) some even go to use (CMYK, HSV & HSL,
etc.)
Which can provide you with any color that you want through the combination of the main colors (Red, Green, Blue, Alpha).

If we want to know if a color is close to another color we look at it with our eyes, but since we would like to have the
computer programmatically do it for us then we have look at it in a mathematical manner.

Given that color A is Red in HEX color space #FF0000 and color B is Green in HEX color space as well #00FF00 and from
our understanding of RGB we the have the first two values are the representation of the Red color, the second two values
are the representation of the Green color and the last two values are the representation of the Blue color and since we
know that each one these values are a number representation of its value (0-9) then (A, B, C, D, F) = (10, 11, 12, 13,
14). Then we can draw the color in a 3D dimension and calculate the distance between them using a law like Euclidean.

EX:-

```
A = (R1 = FF, G1 = 00, B1 = 00)
B = (R2 = 00, G2 = FF, B2 = 00)
We have our two point here, now we can use Euclidean law
Distance = sqrt((R2 - R1)^2 + (G2 - G1)^2 + (B2 - B1)^2)
```

So far so good, right?
Nope.

Wither we used HEX, RGBA, CMYK or any other color space we won't be able to know anything except the distance between
the two colors in their color space which sometime might be completely different color yet the distance is between them
is short because they don't take in consideration how our eyes sees and understand colors.

But there exist other color spaces (scientific ones) that take in consideration the way our eyes see colors and how our
mind interpret them. One of these are LAB.

#### Color Transformation

A color in one absolute color space can be converted into another absolute color space, and back again, in general;
however, some color spaces may have gamut limitations, and converting colors that lie outside that gamut will not
produce correct results. There are also likely to be rounding errors, especially if the popular range of only 256
distinct values per component (8-bit color) is used.

#### What is gamut?

In color reproduction, including computer graphics and photography, the gamut, or color gamut, is a certain complete
subset of colors. The most common usage refers to the subset of colors which can be accurately represented in a given
circumstance, such as within a given color space or by a certain output device.

Now that we understood a little bit about what I'm talking about you think I was right?
Nope

Let's continue on with a little bit more about the conversion between different colour spaces

#### HEX To RGB

We have HEX as the color representation in hexadecimal value we just have to get their decimal values and that it, now
we have our color in RGB color space.

```
A = RGB(255, 0, 0) Red
B = RGB(0, 255, 0) Green
```

#### RGB To XYZ

We have to follow the following mathematical law

```
color = current color / 255
if color > 0.04045
color = ( ( color + 0.055 ) / 1.055 ) ^ 2.4
else
color = color / 12.92

color = color * 100
X = colorRed * 0.4124 + colorGreen * 0.3576 + colorBlue * 0.1805
Y = colorRed * 0.2126 + colorGreen * 0.7152 + colorBlue * 0.0722
Z = colorRed * 0.0193 + colorGreen * 0.1192 + colorBlue * 0.9505
```

That' it

EX:-

```
A = RGB(255, 0, 0) Red
colorRed   = 255/255
colorGreen = 0/255
colorBlue  = 0/255

if (colorRed > 0.04045){
    colorRed = ( ( colorRed + 0.055 ) / 1.055 ) ^ 2.4
} else {
    colorRed = colorRed / 12.92
}
if (colorGreen > 0.04045){
    colorGreen = ( ( colorGreen + 0.055 ) / 1.055 ) ^ 2.4
} else {
    colorGreen = colorGreen / 12.92
}
if (colorBlue > 0.04045){
    colorBlue = ( ( colorBlue + 0.055 ) / 1.055 ) ^ 2.4
} else {
    colorBlue = colorBlue / 12.92
}
colorRed = colorRed * 100
colorGreen = colorGreen * 100
colorBlue = colorBlue * 100

X = (colorRed * 0.4124) + (colorGreen * 0.3576) + (colorBlue * 0.1805)
Y = (colorRed * 0.2126) + (colorGreen * 0.7152) + (colorBlue * 0.0722)
Z = (colorRed * 0.0193) + (colorGreen * 0.1192) + (colorBlue * 0.9505)

A XYZ(X, Y, Z)
```

#### XYZ To LAB

// Reference-X, Reference-Y and Reference-Z refer to specific illuminates and observers. Check Reference Section

```
X = X / Reference-X
Y = Y / Reference-Y
Z = Z / Reference-Z

if ( X > 0.008856 ) {
    X = X ^ ( 1/3 )
}else{
    X = ( 7.787 * X ) + ( 16 / 116 )
}
if ( Y > 0.008856 ) {
    Y = Y ^ ( 1/3 )
}else{
    Y = ( 7.787 * Y ) + ( 16 / 116 )
}
if ( Z > 0.008856 ) {
    Z = Z ^ ( 1/3 )
}else{
    Z = ( 7.787 * Z ) + ( 16 / 116 )
}
CIE-L* = ( 116 * Y ) - 16
CIE-a* = 500 * ( X - Y )
CIE-b* = 200 * ( Y - Z )
```

#### Reference

Here is some list of them that I was able to find.

```
// 2o Observer (CIE 1931)
// X2, Y2, Z2
CIE2_A = {109.850f, 100f, 35.585f} // Incandescent
CIE2_C = {98.074f, 100f, 118.232f}
CIE2_D50 = {96.422f, 100f, 82.521f}
CIE2_D55 = {95.682f, 100f, 92.149f}
CIE2_D65 = {95.047f, 100f, 108.883f} // Daylight
CIE2_D75 = {94.972f, 100f, 122.638f}
CIE2_F2 = {99.187f, 100f, 67.395f} // Fluorescent
CIE2_F7 = {95.044f, 100f, 108.755f}
CIE2_F11 = {100.966f, 100f, 64.370f}

// 10o Observer (CIE 1964)
// X2, Y2, Z2
CIE10_A = {111.144f, 100f, 35.200f} // Incandescent
CIE10_C = {97.285f, 100f, 116.145f}
CIE10_D50 = {96.720f, 100f, 81.427f}
CIE10_D55 = {95.799f, 100f, 90.926f}
CIE10_D65 = {94.811f, 100f, 107.304f} // Daylight
CIE10_D75 = {94.416f, 100f, 120.641f}
CIE10_F2 = {103.280f, 100f, 69.026f} // Fluorescent
CIE10_F7 = {95.792f, 100f, 107.687f}
CIE10_F11 = {103.866f, 100f, 65.627f}
```

#### Distance between two colors in LAP colour Space

Treat the color as 3d dimension like we did earlier and now we have the exact distance between the two colors with
respect to the human eye.

Now what do you think? Am I right?
Correct if we are going to check the distance between two colour in the LAP colour space (48% - 50%) accuracy => I don't
remember where I got this number from but it was in my notes. So, I just past it here :)

#### Let the Real Thing Begins

As per more of my research on LAB Colour Space I found some interesting things.
For short LAB is really cool
For long
The CIELAB color space (also known as CIE L*a*b* or sometimes abbreviated as simply "Lab" color space) is a color space
defined by the International Commission on Illumination (CIE) in 1976. It expresses color as three numerical values, L*
for the lightness and a* and b* for the green–red and blue–yellow color components. CIELAB was designed to be
perceptually uniform with respect to human color vision, meaning that the same amount of numerical change in these
values corresponds to about the same amount of visually perceived change.

One of the most important attributes of the CIELAB model is that, with respect to a given white point, it is
device-independent—it defines colors independent of how they are created or displayed. The CIELAB color space is
typically used when graphics for print have to be converted from RGB to CMYK, as the CIELAB gamut includes both the
gamuts of the RGB and CMYK color models.

The space itself is a three-dimensional real number space, allowing an infinite number of possible representations of
colors. In practice, the space is usually mapped onto a three-dimensional integer space for digital representation, and
thus the L*, a*, and b* values are usually absolute, with a pre-defined range. The lightness value, L*, represents the
darkest black at L* = 0, and the brightest white at L* = 100. The color channels, a* and b*, represent true neutral gray
values at a* = 0 and b* = 0. The a* axis represents the green–red component, with green in the negative direction and
red in the positive direction. The b* axis represents the blue–yellow component, with blue in the negative direction and
yellow in the positive direction. The scaling and limits of the a* and b* axes will depend on the specific
implementation, as described below, but they often run in the range of ±100 or −128 to +127 (signed 8-bit integer).

Pretty cool, right?
Are you kidding me it is awesome.

So with that in mind. I wanted to check them out (CIE) and try to find some thing out. I was not able to understand
anything literally lost hope there. They are talking about something that I'm 100% sure that it was out of my league :'(

So I started to search about their work which is explained in a English rather than scitific.

Until I finally found this
article [https://sensing.konicaminolta.us/blog/identifying-color-differences-using-l-a-b-or-l-c-h-coordinates/](https://sensing.konicaminolta.us/blog/identifying-color-differences-using-l-a-b-or-l-c-h-coordinates/)

Now this, was a life changing for me. I was not really able to differeintiate between the two apples until sometime. But
once I did, it's like I got hit with a bus and the I know what I'm suppose to search for. Delta E (ΔE).

#### ΔE - Delta E

ΔE - (Delta E, dE) The measure of change in visual perception of two given colors.
Delta E is a metric for understanding how the human eye perceives color difference. The term delta comes from
mathematics, meaning change in a variable or function. The suffix E references the German word Empfindung, which broadly
means sensation.

On a typical scale, the Delta E value will range from 0 to 100.

| Delta E Value | Perception                             |
|---------------|----------------------------------------|
| <= 1.0        | Not perceptible by human eyes.         |
| 1 - 2         | Perceptible through close observation. |
| 2 - 10        | Perceptible at a glance.               |
| 11 - 49       | Colors are more similar than opposite. |
| 100           | Colors are exact opposite.             |

Now using the upove table once you get the value you can decide what do you want to do exactly.

Take the table as a general guide; it’s possible to get a Delta E value below 1.0 for two colors that appear different.
This is the case with CIE76 and CIE94 formulas, in which saturation is either not considered or not weighted properly.

Because of inconsistencies between the three algorithms, the exact meaning of Delta E changes slightly depending on
which formula is used. Think of Delta E less as a definitive answer, and instead a helpful metric to apply to a specific
use case.

#### Delta E 76

Is pretty much what I was trying to implement on my own so we will pass thins one. But for those who want to know it. It
is the distance betweent he two colours in 3D space and it is pretty much the Euclidean Distance formula.

## Delta E 94

In 1994, the original Delta E formula was improved. The new formula would take into account certain weighting factors
for each lightness, chroma, and hue value.

![alt formula-cie94](https://raw.githubusercontent.com/hamada147/IsThisColourSimilar/master/formula-cie94.png)

Days of normal mathmatical equation has long passed.

#### Delta E 2000 (One used in this library)

The CIE organization decided to fix the lightness inaccuracies by introducing dE00. It’s currently the most complicated,
yet most accurate, CIE color difference algorithm available. And let me tell you. It was a pain to implement. Not
because it is heard but because it had too many variables and I got lost many times trying to implemen it

![alt formula-cie2000](https://raw.githubusercontent.com/hamada147/IsThisColourSimilar/master/formula-cie00.png)
