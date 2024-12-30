import { ChangeEvent, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import '../styles/custom-color-picker.css';

export default function CustomColorPicker({ orientation="v" }) {
  const [hexColor, setHexColor] = useState("d21997");
  const [rgbColor, setRgbColor] = useState({
    r: 0,
    g: 0,
    b: 0
  });

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

  function handleHexChange(e: string) {
    const hex = e.slice(1);
    const r = hexToDecimal(hex.slice(0, 2));
    const g = hexToDecimal(hex.slice(2, 4));
    const b = hexToDecimal(hex.slice(4, 6));

    setHexColor(hex);
    setRgbColor({ r, g, b })

  }

  function handleRgbChange(e: ChangeEvent<HTMLInputElement>) {
    const inputId = e.target.id;
    let num = parseInt(e.target.value);

    if (num < 0) {
      num = 0;
    }
    else if (num > 255) {
      num = 255;
    }

    if (!Number.isNaN(num)) {
      let newHex = decimalToHex(num);
      if (inputId === 'red') {
        newHex += hexColor.slice(2, 6);
      }
      else if (inputId === 'green') {
        newHex = hexColor.slice(0, 2) + newHex + hexColor.slice(4, 6);
      }
      else {
        newHex = hexColor.slice(0, 4) + newHex;
      }
      setHexColor(newHex);
    }

    if (inputId === 'red') {
      setRgbColor({ ...rgbColor, r: num });
    }
    else if (inputId === 'green') {
      setRgbColor({ ...rgbColor, g: num });
    }
    else {
      setRgbColor({ ...rgbColor, b: num });
    }
  }

  return (
    <div className={"color-picker-container" + (orientation === "h" ? " horizontal" : " vertical")}>
      <HexColorPicker color={hexColor} onChange={handleHexChange} />
      <div className={"color-input-container" + (orientation === "h" ? " horizontal" : " vertical")}>
        <div className="rgb-input">
          <div>
            <label htmlFor="red">R:</label>
            <input type="number" name="red" id="red" value={rgbColor.r} onChange={handleRgbChange} />
          </div>
          <div>
            <label htmlFor="green">G:</label>
            <input type="number" name="green" id="green" value={rgbColor.g} onChange={handleRgbChange} />
          </div>
          <div>
            <label htmlFor="blue">B:</label>
            <input type="number" name="blue" id="blue" value={rgbColor.b} onChange={handleRgbChange} />
          </div>
        </div>
        <div className="hex-input" style={{ backgroundColor: "#" + hexColor }}>
          <HexColorInput name="hex" id="hex" color={hexColor} onChange={handleHexChange} />
          <label htmlFor="hex">Hex</label>
        </div>
      </div>
    </div>
  )
}
