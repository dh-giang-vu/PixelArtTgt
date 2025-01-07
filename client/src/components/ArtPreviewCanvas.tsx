import useProcessedImage from "../hooks/useProcessedImage";
import '../styles/art-preview-canvas.css';
import { useEffect, useState } from "react";
import { usePixelArtContext } from "../contexts/PixelArtContext";
import useCanvas from "../hooks/useCanvas";

interface ArtPreviewCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  image: HTMLImageElement;
}

export default function ArtPreviewCanvas({image, ...other} : ArtPreviewCanvasProps) {
  const { canvasRef, context, imgPosition, imgScale, clearCanvas } = useCanvas();
  const { processedImg, ...imgSettings } = useProcessedImage(image);
  const [isSettingVisible, setIsSettingVisible] = useState(true);
  const { setPixelArt, setBlockDimension } = usePixelArtContext();

  useEffect(() => {
    console.log("redraw");
    if (context) {
      clearCanvas();
      drawImage(context);
    }
  }, [imgPosition, imgScale, processedImg, context]);

  useEffect(() => {
    console.log("resize redraw");
    if (context) {
      context.setTransform(imgScale, 0, 0, imgScale, 0, 0);
      clearCanvas();
      drawImage(context);
    }

  }, [other.width, other.height]);

  function drawImage(ctx: CanvasRenderingContext2D) {
    if (processedImg) {
      ctx.drawImage(processedImg, imgPosition.x, imgPosition.y);
    }
  }

  function handleImageSettingsFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if ("value" in e.currentTarget[0] && typeof e.currentTarget[0].value === "string") {
      const blockDimension = parseInt(e.currentTarget[0].value);
      imgSettings.setBlockDimension(blockDimension);
    }
    if ("value" in e.currentTarget[1] && typeof e.currentTarget[1].value === "string") {
      const maxNumColor = parseInt(e.currentTarget[1].value);
      imgSettings.setMaximumColorCount(maxNumColor);
    }
  }

  function confirmPixelArt() {
    setPixelArt(processedImg);
    setBlockDimension(imgSettings.blockDimension);
  }

  return (
    <div className="preview-container">
      {/* {(processedImg !== null) ?
        (<BaseCanvas {...props} image={processedImg} />) :
        (<BaseCanvas {...props} />)
      } */}
      <canvas ref={canvasRef} { ...other }></canvas>

      {isSettingVisible ?
        (
          <form className="settings-form" onSubmit={handleImageSettingsFormSubmit}>
            <div>
              <label htmlFor="blockDimension">Block Dimension: </label>
              <input type="number" name="blockDimension" id="blockDimension" required min={1} max={100} defaultValue={imgSettings.blockDimension} />
            </div>
            <div>
              <label htmlFor="maxNumColor">Max Number of Color: </label>
              <input type="number" name="maxNumColor" id="maxNumColor" required min={1} max={255} defaultValue={imgSettings.maximumColorCount} />
            </div>
            <div style={{ width: "fit-content" }}>
              <button style={{ marginRight: "5px" }} onClick={() => setIsSettingVisible(false)}>Hide Settings</button>
              <button type="submit">Apply Settings</button>
              <div style={{ padding: 0, marginTop: "5px" }}>
                <button type="button" style={{ width: "100%" }} onClick={confirmPixelArt}>Confirm & Start</button>
              </div>
            </div>
          </form>
        ) :
        (
          <button style={{ position: "absolute", bottom: "4px", left: 0 }} onClick={() => setIsSettingVisible(true)}>Show Settings</button>
        )
      }


    </div>
  )
}