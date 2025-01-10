import quantize from "./colorQuantizerAdapter";

// function getAverageRGBSquared(imageData: ImageData, numPixels: number) {
//   let r = 0;
//   let g = 0;
//   let b = 0;

//   for (let i = 0; i < imageData.data.length; i += 4) {
//     r += imageData.data[i + 0]*imageData.data[i + 0]; // R value
//     g += imageData.data[i + 1]*imageData.data[i + 1]; // G value
//     b += imageData.data[i + 2]*imageData.data[i + 2]; // B value
//   }

//   r = Math.sqrt(r/numPixels);
//   g = Math.sqrt(g/numPixels);
//   b = Math.sqrt(b/numPixels);

//   return { r, g, b };
// }

function getAverageRGB(imageData: ImageData, numPixels: number) {
  let r = 0;
  let g = 0;
  let b = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i + 0]; // R value
    g += imageData.data[i + 1]; // G value
    b += imageData.data[i + 2]; // B value
  }

  r = r / numPixels;
  g = g / numPixels;
  b = b / numPixels;

  return { r, g, b };
}

export function processImage(image: HTMLImageElement, blockDimension: number, maximumColorCount: number) {

  let canvas = Object.assign(document.createElement('canvas'), {
    width: image.width,
    height: image.height
  });

  const context = canvas.getContext('2d');
  if (!context) {
    return image;
  }

  context.drawImage(image, 0, 0);
  const imgData = context.getImageData(0, 0, image.width, image.height);
  const colorMap = quantize(imgData, maximumColorCount);

  if (!colorMap) {
    return image;
  }

  for (let i = 0; i < image.width; i += blockDimension) {
    let subtractRowPixels = 0;
    // check if this is the column with blocks that have less width than blockDimension
    if (image.width % blockDimension !== 0 && i === image.width - (image.width % blockDimension)) {
      subtractRowPixels = blockDimension - (image.width % blockDimension);
    }

    for (let j = 0; j < image.height; j += blockDimension) {
      const blockData = context.getImageData(i, j, blockDimension, blockDimension);
      const { r, g, b } = getAverageRGB(blockData, blockDimension * blockDimension);
      const nearestColor = colorMap.nearest([r, g, b]);

      // fill block with nearest color from the reduced palette to the average rgb
      const blockOrigin = 4 * image.width * j + 4 * i;
      let rowStart = blockOrigin;
      let rowEnd = rowStart + 4 * blockDimension - 4*subtractRowPixels;

      for (let p = 0; p < blockDimension; p++) {
        for (let q = rowStart; q < rowEnd; q += 4) {
          imgData.data[q + 0] = nearestColor[0];
          imgData.data[q + 1] = nearestColor[1];
          imgData.data[q + 2] = nearestColor[2];
          imgData.data[q + 3] = 255;
        }
        rowStart += 4 * image.width;
        rowEnd = rowStart + 4 * blockDimension - 4*subtractRowPixels;
      }
    }
  }

  // convert ImageData to Image
  context.putImageData(imgData, 0, 0);
  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}