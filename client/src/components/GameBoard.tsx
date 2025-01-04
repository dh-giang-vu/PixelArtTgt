import CustomColorPicker from "./CustomColorPicker";
import '../styles/game-board.css';
import useDivDimension from "../hooks/useElementDimension";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ArtPreviewCanvas from "./ArtPreviewCanvas";
import { usePixelArtContext } from "../contexts/PixelArtContext";
import ArtCanvas from "./ArtCanvas";

export default function GameBoard() {
  const { ref, dimension } = useDivDimension();
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const { pixelArt } = usePixelArtContext();

  return (
    <div className="game-board-grid-container">

      <div className="sidebar sidebar-top">
        Music
      </div>

      <div className="sidebar sidebar-mid">
        <CustomColorPicker orientation="v" />
        <CustomColorPicker orientation="h" />
      </div>

      <div className="sidebar sidebar-bot">
        Online: 1
      </div>

      <div className="main" style={{ overflow: "hidden", position: "relative" }} ref={ref}>
        <div style={{ position: "absolute", width: "100%", height: "100%" }}>
          {pixelArt && <ArtCanvas width={dimension.width} height={dimension.height} image={pixelArt} />}
          {image && !pixelArt && <ArtPreviewCanvas width={dimension.width} height={dimension.height} image={image} />}
          {!image && !pixelArt && <ImageUploader onUpload={(img) => setImage(img)} />}
        </div>
      </div>
    </div>
  )
}
