/**
 * 🎨 Koda Colors: HSL-Tailored Synthesis
 * Advanced color palette generation for the Zenith Design System.
 */

export interface ColorPalette {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
}

/**
 * Generates a consistent 11-step palette from a base HSL value.
 */
export function generatePalette(h: number, s: number, l: number): ColorPalette {
    return {
        50: `hsl(${h}, ${s}%, 97%)`,
        100: `hsl(${h}, ${s}%, 94%)`,
        200: `hsl(${h}, ${s}%, 86%)`,
        300: `hsl(${h}, ${s}%, 77%)`,
        400: `hsl(${h}, ${s}%, 66%)`,
        500: `hsl(${h}, ${s}%, ${l}%)`,
        600: `hsl(${h}, ${s}%, ${Math.max(0, l - 10)}%)`,
        700: `hsl(${h}, ${s}%, ${Math.max(0, l - 20)}%)`,
        800: `hsl(${h}, ${s}%, ${Math.max(0, l - 30)}%)`,
        900: `hsl(${h}, ${s}%, ${Math.max(0, l - 40)}%)`,
        950: `hsl(${h}, ${s}%, ${Math.max(0, l - 45)}%)`,
    };
}

export const Colors = {
    Slate: generatePalette(215, 16, 47),
    Gray: generatePalette(220, 9, 46),
    Zinc: generatePalette(240, 5, 45),
    Neutral: generatePalette(0, 0, 45),
    Stone: generatePalette(24, 5, 45),
    Red: generatePalette(0, 84, 60),
    Orange: generatePalette(24, 94, 50),
    Amber: generatePalette(38, 92, 50),
    Yellow: generatePalette(45, 93, 47),
    Lime: generatePalette(84, 81, 44),
    Green: generatePalette(142, 70, 45),
    Emerald: generatePalette(160, 84, 39),
    Teal: generatePalette(173, 80, 40),
    Cyan: generatePalette(188, 86, 42),
    Sky: generatePalette(199, 89, 48),
    Blue: generatePalette(221, 83, 53),
    Indigo: generatePalette(239, 84, 67),
    Violet: generatePalette(262, 83, 58),
    Purple: generatePalette(271, 91, 65),
    Fuchsia: generatePalette(292, 91, 50),
    Pink: generatePalette(330, 81, 60),
    Rose: generatePalette(346, 84, 61),
};
