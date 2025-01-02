import quantizeImport from 'quantize';
import { RgbPixel } from 'quantize';

function imageDataToRGBArray(imgData: ImageData): RgbPixel[] {
  const result: RgbPixel[] = [];

  for (let i = 0; i < imgData.data.length; i+=4) {
    result.push([
      imgData.data[i + 0],
      imgData.data[i + 1],
      imgData.data[i + 2],
    ]);
  }

  return result;
}

export default function quantize(imgData: ImageData, maximumColorCount: number) {
  const rgbArray = imageDataToRGBArray(imgData);
  const colorMap = quantizeImport(rgbArray, maximumColorCount);
  return colorMap;
}