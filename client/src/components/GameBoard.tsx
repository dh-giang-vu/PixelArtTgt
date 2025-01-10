// import CustomColorPicker from "./TempCustomPicker";
import CustomColorPicker, { CustomColor } from "./CustomColorPicker";
import '../styles/game-board.css';
import useDivDimension from "../hooks/useElementDimension";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ArtPreviewCanvas from "./ArtPreviewCanvas";
import { usePixelArtContext } from "../contexts/PixelArtContext";
import ArtCanvas from "./ArtCanvas";
import { RgbColor } from "react-colorful";
import { hexToRgb, rgbToHex } from "../utils/colorConvert";

export default function GameBoard() {
  const { ref, dimension } = useDivDimension();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<CustomColor>({
    rgb: { r: 0, g: 0, b: 0 },
    hex: "#000000"
  });
  const { pixelArt, blockDimension, getPixelArtImageData } = usePixelArtContext();

  function handleColorPickerChange(newColor: RgbColor | string) {
    let newHex = "#000000";
    let newRgb = { r: 0, g: 0, b: 0 };
    // hex input was changed
    if (typeof newColor === "string") {
      newRgb = hexToRgb(newColor);
      newHex = newColor;
    }
    // rgb input was changed
    else {
      newRgb = newColor;
      newHex = rgbToHex(newColor);
    }
    setColor({
      rgb: newRgb,
      hex: newHex
    });
  }

  return (
    <div className="game-board-grid-container">

      <div className="sidebar sidebar-top">
        Music
      </div>

      <div className="sidebar sidebar-mid">
        <CustomColorPicker orientation="v" color={color} onChange={handleColorPickerChange}/>
        <CustomColorPicker orientation="h" color={color} onChange={handleColorPickerChange}/>
      </div>

      <div className="sidebar sidebar-bot">
        Online: 1
      </div>

      <div className="main" style={{ overflow: "hidden", position: "relative" }} ref={ref}>
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
          {pixelArt && blockDimension && 
            <ArtCanvas 
              width={dimension.width} 
              height={dimension.height} 
              image={pixelArt} 
              imageData={getPixelArtImageData()} 
              blockDimension={blockDimension} 
              pickedColor={color.rgb} 
            />
          }
          {image && !pixelArt && <ArtPreviewCanvas width={dimension.width} height={dimension.height} image={image} />}
          {!image && !pixelArt && <ImageUploader onUpload={(img) => setImage(img)} />}
        </div>
      </div>
    </div>
  )
}
