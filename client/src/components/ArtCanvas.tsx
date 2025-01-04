import { useEffect } from "react";
import useCanvas from "../hooks/useCanvas";

interface ArtCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  image: HTMLImageElement;
}

export default function ArtCanvas({ image, ...other } : ArtCanvasProps) {

  const { canvasRef, context, imgPosition, imgScale, clearCanvas } = useCanvas();

  useEffect(() => {
    console.log("redraw");
    if (context) {
      clearCanvas();
      context.fillStyle = "#FFFFFF70";
      drawImage(context);
    }
  }, [imgPosition, imgScale, image, other.width, other.height, context]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    function handleCanvasClick(e: MouseEvent) {
      console.log(e);
    }

    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);
    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    }
  })

  function drawImage(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(image, imgPosition.x, imgPosition.y);
    ctx.fillRect(imgPosition.x, imgPosition.y, image.width, image.height);
  }

  return <canvas ref={canvasRef} { ...other }></canvas>;
}