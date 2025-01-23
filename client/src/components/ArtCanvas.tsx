import { useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";

interface ArtCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  image: HTMLImageElement;
  imageData: ImageData | null;
  blockDimension: number;
  pickedColor: { r: number, g: number, b: number };
}

export default function ArtCanvas({ image, imageData, blockDimension, pickedColor, ...other }: ArtCanvasProps) {

  const { canvasRef, context, imgPosition, imgScale, clearCanvas } = useCanvas();
  const [pixelMap, setPixelMap] = useState((() => {
    const lengthX = Math.ceil(image.width / blockDimension);
    const lengthY = Math.ceil(image.height / blockDimension);
    const a = new Array(lengthX).fill(new Array(lengthY).fill(null));
    return a;
  })());

  useEffect(() => {
    console.log("redraw");
    if (context) {
      clearCanvas();
      drawImage(context);
    }
  }, [imgPosition, imgScale, image, context, pixelMap]);

  useEffect(() => {
    console.log("resize redraw");
    if (context) {
      context.setTransform(imgScale, 0, 0, imgScale, 0, 0);
      clearCanvas();
      drawImage(context);
    }

  }, [other.width, other.height]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    function handleCanvasClick(e: MouseEvent) {
      if (!canvasRef.current || !imageData) {
        return;
      }
      const bounding = canvasRef.current.getBoundingClientRect();

      const imageOffsetX = e.clientX - bounding.left - imgPosition.x * imgScale;
      const imageOffsetY = e.clientY - bounding.top - imgPosition.y * imgScale;

      const imageScaledWidth = image.width * imgScale;
      const imageScaledHeight = image.height * imgScale;

      if (0 <= imageOffsetX && imageOffsetX <= imageScaledWidth && 0 <= imageOffsetY && imageOffsetY <= imageScaledHeight) {
        // find which pixel was clicked within the image
        const pixelX = imageOffsetX / imageScaledWidth * image.width;
        const pixelY = imageOffsetY / imageScaledHeight * image.height;

        // find which block this pixel is in 
        //    (in terms of rows and cols - imagine the image as a 2D array of blocks
        //      which is not the same as x-y coordinates)
        const blockX = Math.floor(pixelX / blockDimension);
        const blockY = Math.floor(pixelY / blockDimension);

        if (pixelMap[blockX][blockY] !== pickedColor) {
          setPixelMap((prev) => {
            const newArr = [...prev];
            newArr[blockX] = [...prev[blockX]];
            newArr[blockX][blockY] = pickedColor;
            return newArr;
          });
        }

      }
    }

    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);
    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    }
  }, [canvasRef.current, imgPosition, imgScale, image, imageData]);

  function drawImage(ctx: CanvasRenderingContext2D) {
    if (!imageData) {
      return;
    }

    ctx.drawImage(image, imgPosition.x, imgPosition.y);
    
    // draw semi-transparent cover on top of pixel art to give the illusion of a guide 
    ctx.fillStyle = "#FFFFFFB3";
    ctx.fillRect(imgPosition.x, imgPosition.y, image.width, image.height);

    // draw blocks that have been coloured by people
    for (let x = 0; x < pixelMap.length; x++) {
      for (let y = 0; y < pixelMap[0].length; y++) {
        if (pixelMap[x][y]) {
          const { r, g, b } = pixelMap[x][y];
          ctx.fillStyle = `rgb(${r},${g},${b})`
          ctx.fillRect(
            imgPosition.x + x * blockDimension,
            imgPosition.y + y * blockDimension,
            blockDimension,
            blockDimension
          );
        }
      }
    }

    // Add text
    showColorText(ctx);
  }

  // show rgb() text indicating which 
  function showColorText(ctx: CanvasRenderingContext2D) {
    const THRESHOLD = 60;
    if (imgScale * blockDimension < THRESHOLD || !imageData) {
      return;
    }
    ctx.fillStyle = "#000000"; // Set text color
    ctx.font = `${0.1 * blockDimension}px Arial`; // Set text font and size
    ctx.textAlign = "center"; // Center-align the text
    ctx.textBaseline = "middle"; // Vertically center-align the text

    // calculate where to start drawing rgb() text on canvas
    //    x-y coordinates are relative to the <canvas> itself
    const startPoint = {
      x: imgPosition.x < 0 ? imgPosition.x % blockDimension : Math.abs(imgPosition.x),
      y: imgPosition.y < 0 ? imgPosition.y % blockDimension : Math.abs(imgPosition.y)
    }
    // calculate where to stop drawing rgb() text on canvas
    //    x-y coordinates are relative to the <canvas> itself
    const endPoint = {
      x: Math.ceil(Math.min(imgPosition.x+image.width, ctx.canvas.width/imgScale)),
      y: Math.ceil(Math.min(imgPosition.y+image.height, ctx.canvas.height/imgScale)),
    }

    // calculate which blocks / pixels are actually visible on canvas
    //    to find what colour it is and display as text
    const startPixel = { x: 0, y: 0 };
    startPixel.x = startPoint.x - imgPosition.x;
    startPixel.y = startPoint.y - imgPosition.y;

    const numBlocksX = Math.ceil(endPoint.x - startPoint.x);
    const numBlocksY = Math.ceil(endPoint.y - startPoint.y);

    const endPixel = { x: 0, y: 0 };
    endPixel.x = startPixel.x + numBlocksX * blockDimension;
    endPixel.y = startPixel.y + numBlocksY * blockDimension;

    // draw text at center of each block
    for (let x = startPoint.x; x < endPoint.x; x += blockDimension) {
      for (let y = startPoint.y; y < endPoint.y; y += blockDimension) {
        const textX = x + blockDimension / 2;
        const textY = y + blockDimension / 2;
        
        const red = (startPixel.y+(y-startPoint.y)) * (image.width * 4) + (startPixel.x+(x-startPoint.x)) * 4;
        const { r, g, b } = {r: imageData.data[red], g: imageData.data[red+1], b: imageData.data[red+2]};
        
        ctx.fillText(`rgb(${r},${g},${b})`, textX, textY, blockDimension);
      }
    }
  }

  return (
    <canvas ref={canvasRef} {...other} style={{ backgroundColor: "#757575" }}></canvas>
  );
}