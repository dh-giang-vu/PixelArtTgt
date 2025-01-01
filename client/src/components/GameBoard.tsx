import CustomColorPicker from "./CustomColorPicker";
import '../styles/game-board.css';
import Canvas from "./Canvas";
import useDivDimension from "../hooks/useElementDimension";
import { useState } from "react";
import ImageUploader from "./ImageUploader";

export default function GameBoard() {
  const { ref, dimension } = useDivDimension();
  const [image, setImage] = useState<HTMLImageElement | null>(null);

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

      <div className="main" style={{ overflow: "hidden" }} ref={ref}>
        {image !== null ?
          (<Canvas width={dimension.width} height={dimension.height} image={image} />)
          : (<ImageUploader onUpload={(img) => setImage(img)} />)
        }
      </div>

    </div>
  )
}
