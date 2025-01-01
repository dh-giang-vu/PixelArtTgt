import { useEffect, useState } from "react";

export default function useProcessedImage(image: HTMLImageElement) {
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {

    function getAverageRGB(imageData: ImageData, numPixels: number) {
      let r = 0;
      let g = 0;
      let b = 0;

      // for (let i = 0; i < imageData.data.length; i += 4) {
      //   r += imageData.data[i + 0]*imageData.data[i + 0]; // R value
      //   g += imageData.data[i + 1]*imageData.data[i + 1]; // G value
      //   b += imageData.data[i + 2]*imageData.data[i + 2]; // B value
      // }

      // r = Math.sqrt(r/numPixels);
      // g = Math.sqrt(g/numPixels);
      // b = Math.sqrt(b/numPixels);

      for (let i = 0; i < imageData.data.length; i += 4) {
        r += imageData.data[i + 0]; // R value
        g += imageData.data[i + 1]; // G value
        b += imageData.data[i + 2]; // B value
      }

      r = r/numPixels;
      g = g/numPixels;
      b = b/numPixels;

      return { r, g, b };
    }

    function processImage(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement, numPixels=7) {
      const imgData = context.getImageData(0, 0, image.width, image.height);

      for (let i = 0; i < image.width; i += numPixels) {
        for (let j = 0; j < image.height; j += numPixels) {
          const blockData = context.getImageData(i, j, numPixels, numPixels);
          const { r, g, b } = getAverageRGB(blockData, numPixels*numPixels);

          // fill block with average rgb
          const blockOrigin = 4*image.width * j + 4*i;
          let rowStart = blockOrigin;
          let rowEnd = rowStart + 4*numPixels;

          for (let p = 0; p < numPixels; p++) {
            for (let q = rowStart; q < rowEnd; q += 4) {
              imgData.data[q + 0] = r;
              imgData.data[q + 1] = g;
              imgData.data[q + 2] = b;
              imgData.data[q + 3] = 255;
            }
            rowStart += 4*image.width;
            rowEnd = rowStart + 4*numPixels;
          }
        }
      }
      
      // convert ImageData to Image
      context.putImageData(imgData, 0, 0);
      const img = new Image();
      img.src = canvas.toDataURL();
      return img;
    }

    let canvas = Object.assign(document.createElement('canvas'), {
      width: image.width,
      height: image.height
    });

    const context = canvas.getContext('2d');
    
    if (context) {
      context.drawImage(image, 0, 0);
      const processed = processImage(context, canvas);
      setProcessedImage(processed);
    }
  }, []);

  return processedImage;
}