import { HexColorInput, RgbColor, RgbColorPicker } from "react-colorful";
import '../styles/custom-color-picker.css';

export type CustomColor = {
  rgb: RgbColor,
  hex: string 
}

interface CustomColorPickerProps {
  orientation: "v" | "h";
  color: CustomColor
  onChange: (newColor: RgbColor | string) => void;
}

export default function CustomColorPicker({ orientation = "v", color, onChange }: CustomColorPickerProps) {
  
  function handleRgbFormChange(e: React.FormEvent<HTMLFormElement>) {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    const num = e.target.value;
    if (Number.isNaN(num) || parseInt(num) < 0 || parseInt(num) > 255) {
      return;
    }

    if (e.target.id === "red") {
      onChange({ ...color.rgb, r: parseInt(num) });
    }
    else if (e.target.id === "green") {
      onChange({ ...color.rgb, g: parseInt(num) });
    }
    else if (e.target.id === "blue") {
      onChange({ ...color.rgb, b: parseInt(num) });
    }
  }
  
  return (
    <div className={"color-picker-container" + (orientation === "h" ? " horizontal" : " vertical")} >
      <RgbColorPicker color={color.rgb} onChange={onChange} />

      <div className={"color-input-container" + (orientation === "h" ? " horizontal" : " vertical")}>

        <form className="rgb-input" onChange={handleRgbFormChange}>
          <div>
            <label htmlFor="red">R:</label>
            <input type="number" value={color.rgb.r} min={0} max={255} name="red" id="red" />
          </div>
          <div>
            <label htmlFor="green">G:</label>
            <input type="number" value={color.rgb.g} min={0} max={255} name="green" id="green" />
          </div>
          <div>
            <label htmlFor="blue">B:</label>
            <input type="number" value={color.rgb.b} min={0} max={255} name="blue" id="blue" />
          </div>
        </form>

        <div className="hex-input" style={{ backgroundColor: color.hex }}>
          <HexColorInput name="hex" id="hex" color={color.hex} onChange={onChange} />
          <label htmlFor="hex">Hex</label>
        </div>

      </div>

    </div>
  );
}