import { RgbColor } from "react-colorful";

function hexToDecimal(hex: string) {
  return parseInt(hex, 16);
}

function decimalToHex(dec: number, numDigit = 2) {
  let hex = dec.toString(16);
  if (hex.length < numDigit) {
    hex = hex.padStart(numDigit, '0');
  }
  return hex;
}

export function hexToRgb(hexColor: string): RgbColor {
  const hex = hexColor.slice(1);
  const r = hexToDecimal(hex.slice(0, 2));
  const g = hexToDecimal(hex.slice(2, 4));
  const b = hexToDecimal(hex.slice(4, 6));
  return { r, g, b };
}

export function rgbToHex(rgbColor: RgbColor) {
  const rHex = decimalToHex(rgbColor.r);
  const gHex = decimalToHex(rgbColor.g);
  const bHex = decimalToHex(rgbColor.b);
  return `#${rHex}${gHex}${bHex}`;
}