import { useEffect, useMemo, useState } from "react";
import useCanvas from "../hooks/useCanvas";

interface ArtCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  image: HTMLImageElement;
  imageData: ImageData | null;
  blockDimension: number;
}

export default function ArtCanvas({ image, imageData, blockDimension, ...other }: ArtCanvasProps) {

  const { canvasRef, context, imgPosition, imgScale, clearCanvas } = useCanvas();
  const [pixelMap, setPixelMap] = useState((() => {
    const lengthX = Math.ceil(image.width / blockDimension);
    const lengthY = Math.ceil(image.height / blockDimension);
    const a: boolean[][] = new Array(lengthX).fill(new Array(lengthY).fill(false));
    return a;
  })());

  const cover = useMemo(() => {
    console.log("PixelMap is changing");
    const path = new Path2D();
    // clockwise big rectangle covering whole image
    path.moveTo(imgPosition.x, imgPosition.y);
    path.lineTo(imgPosition.x + image.width, imgPosition.y);
    path.lineTo(imgPosition.x + image.width, imgPosition.y + image.height);
    path.lineTo(imgPosition.x, imgPosition.y + image.height);

    // expose blocks to give the illusion that it has been colored
    for (let x = 0; x < pixelMap.length; x++) {
      for (let y = 0; y < pixelMap[0].length; y++) {
        if (pixelMap[x][y]) {
          // draw a rectangle hole through the cover
          path.moveTo(imgPosition.x + x * blockDimension, imgPosition.y + y * blockDimension);
          path.lineTo(imgPosition.x + x * blockDimension, imgPosition.y + (y + 1) * blockDimension);
          path.lineTo(imgPosition.x + (x + 1) * blockDimension, imgPosition.y + (y + 1) * blockDimension);
          path.lineTo(imgPosition.x + (x + 1) * blockDimension, imgPosition.y + y * blockDimension);
        }
      }
    }

    return path;
  }, [imgPosition, pixelMap]);

  useEffect(() => {
    console.log("redraw");
    if (context) {
      clearCanvas();
      drawImage(context);
    }
  }, [imgPosition, imgScale, image, context, cover]);

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
      console.log(imgScale);
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

        // // TODO: check if rgb of ColourPicker match rgb of chosen block
        // const x = Math.floor(pixelX);
        // const y = Math.floor(pixelY);

        // const red = y * (image.width * 4) + x * 4;
        // const [r, g, b, a] = [imageData.data[red], imageData.data[red+1], imageData.data[red+2], imageData.data[red+3]];

        // find which block this pixel is in 
        //    (in terms of rows and cols - imagine the image as a 2D array of blocks
        //      which is not the same as x-y coordinates)
        const blockX = Math.floor(pixelX / blockDimension);
        const blockY = Math.floor(pixelY / blockDimension);

        if (!pixelMap[blockX][blockY]) {
          setPixelMap((prev) => {
            const newArr = [...prev];
            newArr[blockX] = [...prev[blockX]];
            newArr[blockX][blockY] = true;
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
    ctx.fillStyle = "#FFFFFFE6";
    ctx.drawImage(image, imgPosition.x, imgPosition.y);
    ctx.fill(cover);

    // Add text
    showColorText(ctx);
  }

  // show rgb() text indicating which 
  function showColorText(ctx: CanvasRenderingContext2D) {
    const THRESHOLD = 60;
    if (imgScale * blockDimension < THRESHOLD) {
      return;
    }
    ctx.fillStyle = "#000000"; // Set text color
    ctx.font = `${0.1 * blockDimension}px Arial`; // Set text font and size
    ctx.textAlign = "center"; // Center-align the text
    ctx.textBaseline = "middle"; // Vertically center-align the text

    // calculate where to start drawing rgb() text on canvas
    const startPoint = {
      x: imgPosition.x < 0 ? imgPosition.x % blockDimension : Math.abs(imgPosition.x),
      y: imgPosition.y < 0 ? imgPosition.y % blockDimension : Math.abs(imgPosition.y)
    }
    // calculate where to stop drawing rgb() text on canvas
    const endPoint = {
      x: Math.ceil(ctx.canvas.width - imgPosition.x) / imgScale,
      y: Math.ceil(ctx.canvas.height - imgPosition.y) / imgScale
    }

    // TODO: calculate which blocks / pixels are actually visible on canvas
    //        and find what colour it is and display as text

    // draw text at center of each block
    for (let x = startPoint.x; x < endPoint.x; x += blockDimension) {
      for (let y = startPoint.y; y < endPoint.y; y += blockDimension) {
        const textX = x + blockDimension / 2;
        const textY = y + blockDimension / 2;
        ctx.fillText("rgb(255,255,255)", textX, textY, blockDimension);
      }
    }
  }

  return (
    <canvas ref={canvasRef} {...other}></canvas>
  );
}