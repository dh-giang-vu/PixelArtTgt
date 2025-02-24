import { HexColorInput, RgbColor, RgbColorPicker } from "react-colorful";
import '../styles/custom-color-picker.css';
import { hexToRgb, rgbToHex } from "../utils/colorConvert";

export type CustomColor = {
  rgb: RgbColor,
  hex: string 
}

interface CustomColorPickerProps {
  orientation: "v" | "h";
  color: RgbColor;
  setColor: (newColor: RgbColor) => void;
}

export default function CustomColorPicker({ orientation = "v", color, setColor }: CustomColorPickerProps) {

  function handleRgbFormChange(e: React.FormEvent<HTMLFormElement>) {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    const num = e.target.value;
    if (Number.isNaN(num) || parseInt(num) < 0 || parseInt(num) > 255) {
      return;
    }

    if (e.target.id === "red") {
      setColor({ ...color, r: parseInt(num) });
    }
    else if (e.target.id === "green") {
      setColor({ ...color, g: parseInt(num) });
    }
    else if (e.target.id === "blue") {
      setColor({ ...color, b: parseInt(num) });
    }
  }
  
  return (
    <div className={"color-picker-container" + (orientation === "h" ? " horizontal" : " vertical")} >
      <RgbColorPicker color={color} onChange={setColor} />

      <div className={"color-input-container" + (orientation === "h" ? " horizontal" : " vertical")}>

        <form className="rgb-input" onChange={handleRgbFormChange}>
          <div>
            <label htmlFor="red">R:</label>
            <input type="number" value={color.r} min={0} max={255} name="red" id="red" onChange={() => {}} />
          </div>
          <div>
            <label htmlFor="green">G:</label>
            <input type="number" value={color.g} min={0} max={255} name="green" id="green" onChange={() => {}} />
          </div>
          <div>
            <label htmlFor="blue">B:</label>
            <input type="number" value={color.b} min={0} max={255} name="blue" id="blue" onChange={() => {}} />
          </div>
        </form>

        <div className="hex-input" style={{ backgroundColor: rgbToHex(color) }}>
          <HexColorInput name="hex" id="hex" color={rgbToHex(color)} onChange={e => setColor(hexToRgb(e))} />
          <label htmlFor="hex">Hex</label>
        </div>

      </div>

    </div>
  );
}