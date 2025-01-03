import { useEffect, useState } from "react";
import { processImage } from "../utils/imageProcessor";

export default function useProcessedImage(image: HTMLImageElement, defaultBlockDimension=5, defaultMaxNumColor=20) {
  const [processedImg, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [blockDimension, setBlockDimension] = useState(defaultBlockDimension);
  const [maximumColorCount, setMaximumColorCount] = useState(defaultMaxNumColor);

  useEffect(() => {
    const processed = processImage(image, blockDimension, maximumColorCount);
    setProcessedImage(processed);
  }, [image, blockDimension, maximumColorCount]);

  return { processedImg, blockDimension, setBlockDimension, maximumColorCount, setMaximumColorCount };
}