import { useEffect, useState } from "react";
import useCanvas from "../hooks/useCanvas";
import { usePlayerInfo } from "../contexts/PlayerInfoContext";
import useWebSocket from "react-use-websocket";

interface ArtCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  image: HTMLImageElement;
  imageData: ImageData | null;
  blockDimension: number;
  pickedColor: { r: number, g: number, b: number };
}

export default function ArtCanvas({ image, imageData, blockDimension, pickedColor, ...other }: ArtCanvasProps) {

  const { canvasRef, context, imgPosition, imgScale, clearCanvas } = useCanvas();
  const lengthX = Math.ceil(image.width / blockDimension);
  const lengthY = Math.ceil(image.height / blockDimension);
  const [pixelMap, setPixelMap] = useState(
    Array.from({ length: lengthX }).map(() => new Array(lengthY).fill(null))
  );

  // networking
  const { username, roomId } = usePlayerInfo();

  const WSS_URL = 'ws://localhost:3000';
  const ws = useWebSocket(
    WSS_URL,
    {
      queryParams: {
        username,
        roomId,
      },
      share: true,
    },
  );

  // check for pixel art updates from other users
  useEffect(() => {
    const msg = ws.lastJsonMessage;

    // validate type
    if (!msg || typeof msg !== 'object' || 
        !('x' in msg && typeof msg.x === 'number' && 
          'y' in msg && typeof msg.y === 'number' && 
          'c' in msg && Array.isArray(msg.c) && msg.c.length === 3)
        ) {
      return;
   }
   
    const { x, y, c } = msg;
    const color = { r: c[0], g: c[1], b: c[2] };
    
    if (JSON.stringify(pixelMap[x][y]) !== JSON.stringify(color)) {
      setPixelMap((prev) => {
        const newArr = [...prev];
        newArr[x] = [...prev[x]];
        newArr[x][y] = color;
        return newArr;
      });
    }

  }, [ws.lastJsonMessage]);

  useEffect(() => {
    if (context) {
      clearCanvas();
      drawImage(context);
    }
  }, [imgPosition, imgScale, image, context, pixelMap]);

  useEffect(() => {
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
      if (!canvasRef.current) {
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

        if (JSON.stringify(pixelMap[blockX][blockY]) !== JSON.stringify(pickedColor)) {
          setPixelMap((prev) => {
            const newArr = [...prev];
            newArr[blockX] = [...prev[blockX]];
            newArr[blockX][blockY] = pickedColor;
            return newArr;
          });

          // send update to server
          const { r, g, b } = pickedColor;
          ws.sendJsonMessage({x:blockX, y:blockY, c:[r,g,b]});
          
        }

      }
    }

    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);
    return () => {
      canvas.removeEventListener("click", handleCanvasClick);
    }
  }, [canvasRef.current, imgPosition, imgScale, image, pixelMap, pickedColor]);

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
      x: Math.ceil(Math.min(imgPosition.x + image.width, ctx.canvas.width / imgScale)),
      y: Math.ceil(Math.min(imgPosition.y + image.height, ctx.canvas.height / imgScale)),
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

        const red = (startPixel.y + (y - startPoint.y)) * (image.width * 4) + (startPixel.x + (x - startPoint.x)) * 4;
        const { r, g, b } = { r: imageData.data[red], g: imageData.data[red + 1], b: imageData.data[red + 2] };

        ctx.fillText(`rgb(${r},${g},${b})`, textX, textY, blockDimension);
      }
    }
  }

  return (
    <canvas ref={canvasRef} {...other} style={{ backgroundColor: "#757575" }}></canvas>
  );
}