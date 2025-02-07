import { LAB } from "delta-e"

export function color2Lab(color: string): LAB {
    let rgb: [number, number, number];

    // If the input is a hex color (#RRGGBB or #RGB)
    if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        if (hex.length === 6) {
            rgb = [
                parseInt(hex.slice(0, 2), 16),
                parseInt(hex.slice(2, 4), 16),
                parseInt(hex.slice(4, 6), 16)
            ];
        } else {
            throw new Error('Invalid hex color format');
        }
    }
    // If the input is an rgb or rgba string
    else if (color.startsWith('rgb')) {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            rgb = [
                parseInt(match[1], 10),
                parseInt(match[2], 10),
                parseInt(match[3], 10)
            ];
        } else {
            throw new Error('Invalid rgb/rgba format');
        }
    } else {
        throw new Error('Unsupported color format');
    }

    // Clamp values to ensure they are within 0-255
    rgb = [clamp(rgb[0], 0, 255), clamp(rgb[1], 0, 255), clamp(rgb[2], 0, 255)];

    // Convert RGB to XYZ
    const [x, y, z] = rgbToXyz(rgb[0], rgb[1], rgb[2]);

    // Convert XYZ to LAB
    return xyzToLab(x, y, z);
}

function xyzToLab(x: number, y: number, z: number): LAB {
    const Xr = 95.047, Yr = 100.000, Zr = 108.883;

    x /= Xr;
    y /= Yr;
    z /= Zr;

    const f = (t: number) => (t > 0.008856) ? Math.cbrt(t) : (7.787 * t) + (16 / 116);

    const fx = f(x);
    const fy = f(y);
    const fz = f(z);

    const L = (116 * fy) - 16;
    const A = 500 * (fx - fy);
    const B = 200 * (fy - fz);

    return { L, A, B } as LAB;
};

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    // Apply gamma correction
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

    // Convert to XYZ space
    const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100;
    const y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) * 100;
    const z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) * 100;

    return [x, y, z];
};

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}