import { useEffect, useRef, useState } from "react";
import useKeyDown from "../hooks/useKeyDown";
import useProcessedImage from "../hooks/useProcessedImage";
import '../styles/canvas.css';


const origin = {
  x: 0,
  y: 0,
}

const POSITION_CHANGE = 5;

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  image: HTMLImageElement
}

export default function Canvas({ image, ...other }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [imgPosition, setImgPosition] = useState(origin);
  const [imgScale, setImgScale] = useState(1);
  const { key, timeStamp} = useKeyDown();
  const { processedImg, ...imgSettings } = useProcessedImage(image);

  // setup canvas and set context
  useEffect(() => {
    if (canvasRef.current) {
      // get new drawing context
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        setContext(ctx);
      }
    }
  }, [canvasRef.current]);


  // useEffect(() => {
  //   if (context) {
  //     // context.fillStyle = "white";
  //     // context.strokeStyle = "white";
  //     clearCanvas();
  //     drawImage();
  //   }
  // }, [canvasRef.current, context, processedImg, other.width, other.height, processedImg?.width, processedImg?.height]);


  // clear canvas + redraw the image when position or scale or canvas size change
  useEffect(() => {
    console.log("redraw");
    if (context) {
      clearCanvas();
      drawImage();
    }
  }, [imgPosition, imgScale, processedImg, other.width, other.height]);

  function drawImage() {
    if (!processedImg) {
      return;
    }
    if (context) {
      context.fillRect(imgPosition.x, imgPosition.y, processedImg.width, processedImg.height);
      context.drawImage(processedImg, imgPosition.x, imgPosition.y);
    }
  }

  // image panning listener
  useEffect(() => {
    // disallow moving image when it is not processed
    if (!processedImg) {
      return;
    }
    if (key === "w") {
      moveImageUp();
    }
    else if (key === "a") {
      moveImageLeft();
    } 
    else if (key === "s") {
      moveImageDown();
    }
    else if (key === "d") {
      moveImageRight();
    }
  }, [key, timeStamp, processedImg]);

  // zoom listener
  useEffect(() => {
    // disallow moving image when it is not processed
    if (!processedImg) {
      return;
    }
    if (key === "q") {
      zoomOut();
    }
    else if (key === "e") {
      zoomIn();
    }
  }, [key, timeStamp, processedImg]);

  function clearCanvas() {
    if(context) {
      context.save()
      // temporarily scale back up to clear the entire actual canvas
      context.scale(1/imgScale, 1/imgScale);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      context.restore();
    }
  }

  function moveImageDown() {
    setImgPosition({ ...imgPosition, y: imgPosition.y + POSITION_CHANGE });
  }

  function moveImageUp() {
    setImgPosition({ ...imgPosition, y: imgPosition.y - POSITION_CHANGE });
  }

  function moveImageLeft() {
    setImgPosition({ ...imgPosition, x: imgPosition.x - POSITION_CHANGE });
  }

  function moveImageRight() {
    setImgPosition({ ...imgPosition, x: imgPosition.x + POSITION_CHANGE });
  }

  function zoomOut() {
    if (context) {
      context.scale(0.8, 0.8);
      setImgScale(0.8*imgScale);
    }
  }

  function zoomIn() {
    if (context) {
      context.scale(1.2, 1.2);
      setImgScale(1.2*imgScale);
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

  return (
    <>
      <canvas ref={canvasRef} { ...other } hidden={processedImg === null}></canvas>

      <form className="imgSettingsForm" style={{ position: "absolute", bottom: 0 }} onSubmit={handleImageSettingsFormSubmit}>
        <label htmlFor="blockDimension">Block Dimension: </label>
        <input type="number" name="blockDimension" id="blockDimension" required min={1} max={100} defaultValue={imgSettings.blockDimension}/>
        <label htmlFor="maxNumColor">Max Number of Color: </label>
        <input type="number" name="maxNumColor" id="maxNumColor" required min={1} max={255} defaultValue={imgSettings.maximumColorCount}/>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
