import { useRef, useEffect, useState, CanvasHTMLAttributes } from 'react';
import useKeyDown from './useKeyDown';

const POSITION_CHANGE = 5;

export default function useCanvas(drawImage: (ctx: CanvasRenderingContext2D) => void, width: CanvasHTMLAttributes<number>["width"], height: CanvasHTMLAttributes<number>["width"]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [imgPosition, setImgPosition] = useState({ x: 0, y: 0 });
  const [imgScale, setImgScale] = useState(1);
  const { key, timeStamp } = useKeyDown();

  // setup canvas and set context
  useEffect(() => {
    if (canvasRef.current) {
      // get new drawing context
      const ctx = canvasRef.current.getContext("2d");

      if (ctx) {
        setContext(ctx);
      }
    }
  }, [canvasRef.current]);

  // redraw when resizing canvas element
  useEffect(() => {
    if (context) {
      context.setTransform(imgScale, 0, 0, imgScale, 0, 0);
      clearCanvas();
      drawImage(context);
    }

  }, [width, height]);
  
  // redraw when changing image position or image scale
  useEffect(() => {
    if (context) {
      clearCanvas();
      drawImage(context);
    }
  }, [imgPosition, imgScale, context]);

  // image panning listener
  useEffect(() => {
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
  }, [key, timeStamp]);

  // zoom listener
  useEffect(() => {
    if (key === "q") {
      zoomOut();
    }
    else if (key === "e") {
      zoomIn();
    }
  }, [key, timeStamp]);

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
      setImgScale(0.8 * imgScale);
    }
  }

  function zoomIn() {
    if (context) {
      context.scale(1.2, 1.2);
      setImgScale(1.2 * imgScale);
    }
  }

  return { canvasRef, context, imgPosition, imgScale, clearCanvas };
}