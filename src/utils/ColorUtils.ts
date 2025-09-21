// src/utils/ColorUtils.ts
import { StatusKey } from "../types";

export class ColorUtils {
  /**
   * WCAG 2.1 contrast ratio between two RGB colors
   */
  static contrastRatio(bg: { r: number; g: number; b: number }, fg: { r: number; g: number; b: number }): number {
    const lum = (c: { r: number; g: number; b: number }) => {
      const srgb = [c.r, c.g, c.b].map(v => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
      return L;
    };
    const L1 = lum(bg);
    const L2 = lum(fg);
    const lighter = Math.max(L1, L2);
    const darker = Math.min(L1, L2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    if (h.length !== 6) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some(v => Number.isNaN(v))) return null;
    return { r, g, b };
  }

  static rgbToHex(r: number, g: number, b: number): string {
    const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  static rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, l];
  }

  static hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  static getTextColorForBg(bgHex: string): string {
    const bgRgb = this.hexToRgb(bgHex);
    if (!bgRgb) return "#11303b"; // safe fallback

    const [h, s, l] = this.rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);

    // Start with same hue, more saturation for vibrancy
    const targetHue = h;
    const targetSat = Math.min(1, s * 1.2 + 0.2); // nudge toward vibrancy

    // If background is light, try dark text; if background is dark, try light text
    const bgIsLight = l >= 0.6;

    // Binary search on lightness along the same hue to meet 4.5 contrast
    const desiredContrast = 4.5;
    let low = 0, high = 1;
    // Start on the opposite side of bg lightness
    let candidateL = bgIsLight ? 0.22 : 0.88;

    // Try to ensure the search direction is correct
    // If not enough contrast, we will expand toward the extremes
    for (let i = 0; i < 20; i++) {
      const candRgb = this.hslToRgb(targetHue, targetSat, candidateL);
      const ratio = this.contrastRatio(bgRgb, candRgb);

      if (ratio >= desiredContrast) {
        // Tighten the range toward current candidate to find a stable value
        if (bgIsLight) {
          // text is dark, try a bit lighter to keep it as vibrant as possible
          low = candidateL;
          candidateL = (candidateL + high) / 2;
        } else {
          // text is light, try a bit darker to keep it as vibrant as possible
          high = candidateL;
          candidateL = (candidateL + low) / 2;
        }
      } else {
        // Not enough contrast, push farther from background lightness
        if (bgIsLight) {
          // need darker
          high = candidateL;
          candidateL = (candidateL + low) / 2;
        } else {
          // need lighter
          low = candidateL;
          candidateL = (candidateL + high) / 2;
        }
      }
    }

    const finalRgb = this.hslToRgb(targetHue, targetSat, candidateL);
    return this.rgbToHex(finalRgb.r, finalRgb.g, finalRgb.b);
  }

  static getStatusBgMap(formattingSettings?: any): Record<StatusKey, string> {
    // Use formatting pane colors when available; fall back to default palette
    const fs = formattingSettings?.statusStyles;
    return {
      "in-progress": fs?.inProgress?.value?.value ?? "#f1f6df",
      pending: fs?.pending?.value?.value ?? "#f7e9f2",
      completed: fs?.completed?.value?.value ?? "#d3efee",
      "not-started": fs?.notStarted?.value?.value ?? "#dedcd9"
    };
  }

  static getStatusTextMap(formattingSettings?: any): Record<StatusKey, string> {
    // Calculate darker text colors from the actual background colors
    const fs = formattingSettings?.statusStyles;
    return {
      "in-progress": this.getTextColorForBg(fs?.inProgress?.value?.value ?? "#f1f6df"),
      pending: this.getTextColorForBg(fs?.pending?.value?.value ?? "#f7e9f2"),
      completed: this.getTextColorForBg(fs?.completed?.value?.value ?? "#d3efee"),
      "not-started": this.getTextColorForBg(fs?.notStarted?.value?.value ?? "#dedcd9")
    };
  }
}
