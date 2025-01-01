import { useEffect, useRef, useState } from "react";

export default function useDivDimension(initWidth=0, initHeight=0) {
  const ref = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({
    width: initWidth,
    height: initHeight,
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const elem = ref.current;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry.contentBoxSize) {
        const values = entry.contentBoxSize.values();
        for (const value of values) {
          setDimension({
            width: value.inlineSize,
            height: value.blockSize
          });
          return;
        }
      }
    });

    resizeObserver.observe(elem);

  }, [ref.current]);

  return { ref, dimension };
}