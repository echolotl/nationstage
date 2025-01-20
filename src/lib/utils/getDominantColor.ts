import { invoke } from '@tauri-apps/api/core';

let originalColor: string | null = null;
let originalHoverColor: string | null = null;

function getRGBFromString(color: string): number[] {
    return color.replace(/[^\d,]/g, '').split(',').map(n => parseInt(n));
}

function luminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = getRGBFromString(color1);
    const rgb2 = getRGBFromString(color2);
    const l1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const l2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const lightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return (lightest + 0.05) / (darkest + 0.05);
}

function getBrightness(r: number, g: number, b: number): number {
    // Using perceived brightness formula
    return (r * 299 + g * 587 + b * 114) / 1000;
}

function adjustColor(color: string, backgroundIsDark: boolean): string {
    const rgb = getRGBFromString(color);
    const brightness = getBrightness(rgb[0], rgb[1], rgb[2]);
    
    // Minimum brightness thresholds
    const MIN_BRIGHT_MODE = 125; // For dark backgrounds
    const MIN_DARK_MODE = 50;    // For light backgrounds
    
    let adjustment = 1;
    if (backgroundIsDark) {
        // For dark backgrounds, ensure color is bright enough
        if (brightness < MIN_BRIGHT_MODE) {
            adjustment = MIN_BRIGHT_MODE / brightness;
        }
    } else {
        // For light backgrounds, ensure color is dark enough
        if (brightness > MIN_DARK_MODE) {
            adjustment = MIN_DARK_MODE / brightness;
        }
    }
    
    const adjusted = rgb.map(component => {
        const newValue = Math.floor(component * adjustment);
        return Math.min(255, Math.max(0, newValue));
    });
    
    return `rgb(${adjusted.join(', ')})`;
}

function ensureReadableColor(color: string, background: string): string {
    const MIN_CONTRAST = 4.5; // WCAG AA standard
    let adjustedColor = color;
    const rgbBackground = getRGBFromString(background);
    const backgroundIsDark = luminance(rgbBackground[0], rgbBackground[1], rgbBackground[2]) < 0.5;
    
    let contrastRatio = getContrastRatio(adjustedColor, background);
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (contrastRatio < MIN_CONTRAST && attempts < MAX_ATTEMPTS) {
        adjustedColor = adjustColor(adjustedColor, backgroundIsDark);
        contrastRatio = getContrastRatio(adjustedColor, background);
        attempts++;
    }

    // If we still don't have good contrast, fall back to a safe color
    if (contrastRatio < MIN_CONTRAST) {
        return backgroundIsDark ? 'rgb(200, 200, 200)' : 'rgb(55, 55, 55)';
    }

    return adjustedColor;
}

function darkenColor(color: string, amount: number = 0.3): string {
    const rgb = getRGBFromString(color);
    const darkened = rgb.map(component => {
        return Math.max(0, Math.floor(component * (1 - amount)));
    });
    
    return `rgb(${darkened.join(', ')})`;
}

export async function getDominantColor(imageUrl: string): Promise<string> {
    try {
        if (!originalColor) {
            originalColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--theme-accent')
                .trim();

        }
        if (!originalHoverColor) {
            originalHoverColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--theme-accent-hover')
                .trim();
        }

        const base64Image = await invoke<string>('fetch_image', { url: imageUrl });
        console.log('Got base64 image:', base64Image.substring(0, 50) + '...'); // Debug

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject('Canvas context not available');
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Sample multiple points for better color detection
                const samplePoints = [
                    [0.25, 0.25],
                    [0.75, 0.25],
                    [0.5, 0.5],
                    [0.25, 0.75],
                    [0.75, 0.75]
                ];

                let r = 0, g = 0, b = 0;
                samplePoints.forEach(([px, py]) => {
                    const x = Math.floor(canvas.width * px);
                    const y = Math.floor(canvas.height * py);
                    const pixel = ctx.getImageData(x, y, 1, 1).data;
                    r += pixel[0];
                    g += pixel[1];
                    b += pixel[2];
                });

                // Average the samples
                r = Math.floor(r / samplePoints.length);
                g = Math.floor(g / samplePoints.length);
                b = Math.floor(b / samplePoints.length);
                
                let baseColor = `rgb(${r}, ${g}, ${b})`;
                console.log('Initial color:', baseColor); // Debug
                
                const background = getComputedStyle(document.documentElement)
                    .getPropertyValue('--background')
                    .trim();
                console.log('Background color:', background); // Debug

                baseColor = ensureReadableColor(baseColor, background);
                console.log('Adjusted color:', baseColor); // Debug

                const hoverColor = darkenColor(baseColor);
                console.log('Hover color:', hoverColor); // Debug
                
                // Force style update
                requestAnimationFrame(() => {
                    document.documentElement.style.setProperty('--theme-accent', baseColor);
                    document.documentElement.style.setProperty('--theme-accent-hover', hoverColor);
                });
                
                resolve(baseColor);
            };
            img.onerror = (e) => {
                console.error('Image load error:', e); // Debug
                reject('Failed to load image');
            };
            img.src = base64Image;
        });
    } catch (error) {
        console.error('Failed to get dominant color:', error);
        return 'var(--theme-accent)';
    }
}

export function resetThemeColor(): void {
    if (originalColor) {
        document.documentElement.style.setProperty('--theme-accent', originalColor);
        
    }
    if (originalHoverColor) {
        document.documentElement.style.setProperty('--theme-accent-hover', originalHoverColor);
    }
}