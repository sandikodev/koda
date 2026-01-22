/**
 * ⚖️ Koda Tokens: The Law of Zenith
 * Orchestrates themes and enforces visual consistency.
 */

import { Colors, type ColorPalette } from './colors';

export interface Theme {
    colors: Record<string, ColorPalette | string>;
    typography: {
        fonts: {
            sans: string;
            mono: string;
        };
        baseSize: string;
    };
    spacing: Record<string, string>;
    radius: Record<string, string>;
}

export const DefaultTheme: Theme = {
    colors: {
        primary: Colors.Blue,
        secondary: Colors.Slate,
        danger: Colors.Red,
        success: Colors.Green,
        warning: Colors.Amber,
        info: Colors.Sky,
        background: Colors.Slate[50],
        foreground: Colors.Slate[950],
    },
    typography: {
        fonts: {
            sans: 'Inter, system-ui, sans-serif',
            mono: 'JetBrains Mono, monospace',
        },
        baseSize: '16px',
    },
    spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        4: '1rem',
        8: '2rem',
    },
    radius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        full: '9999px',
    },
};

/**
 * Validates a value against the current theme tokens.
 * This is the core logic for "Validation by Law" in the compiler.
 */
export function validateToken(category: keyof Theme, token: string, theme: Theme = DefaultTheme): boolean {
    const section = theme[category];
    if (typeof section !== 'object') return false;

    // Check if token exists in the section (e.g. theme.colors.primary)
    if (token in section) return true;

    // Future: Add more sophisticated validation for nested tokens (e.g. colors.blue.500)

    return false;
}

export * from './colors';
