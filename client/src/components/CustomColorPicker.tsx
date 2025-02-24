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

// TO DO: the form current allow input > 255 - fix this
export default function CustomColorPicker({ orientation = "v", color, setColor }: CustomColorPickerProps) {
  
  return (
    <div className={"color-picker-container" + (orientation === "h" ? " horizontal" : " vertical")} >
      <RgbColorPicker color={color} onChange={setColor} />

      <div className={"color-input-container" + (orientation === "h" ? " horizontal" : " vertical")}>

        <form className="rgb-input">
          <div>
            <label htmlFor="red">R:</label>
            <input type="number" value={color.r} min={0} max={255} name="red" id="red" onChange={e => setColor({ ...color, r: parseInt(e.target.value) })} />
          </div>
          <div>
            <label htmlFor="green">G:</label>
            <input type="number" value={color.g} min={0} max={255} name="green" id="green" onChange={e => setColor({ ...color, g: parseInt(e.target.value) })} />
          </div>
          <div>
            <label htmlFor="blue">B:</label>
            <input type="number" value={color.b} min={0} max={255} name="blue" id="blue" onChange={e => setColor({ ...color, b: parseInt(e.target.value) })} />
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