import { useRef, useEffect } from 'react';

export default function useCanvas(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const context = canvasRef.current.getContext('2d');

    if (!context) {
      return;
    }

    draw(context);

  }, [draw]);

  return canvasRef;
}