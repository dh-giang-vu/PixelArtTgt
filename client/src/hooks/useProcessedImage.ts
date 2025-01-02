import { useEffect, useState } from "react";
import { processImage } from "../utils/imageProcessor";

export default function useProcessedImage(image: HTMLImageElement) {
  const [processedImg, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [blockDimension, setBlockDimension] = useState(5);
  const [maximumColorCount, setMaximumColorCount] = useState(20);

  useEffect(() => {
    const processed = processImage(image, blockDimension, maximumColorCount);
    setProcessedImage(processed);
  }, [image, blockDimension, maximumColorCount]);

  return { processedImg, setBlockDimension, setMaximumColorCount };
}