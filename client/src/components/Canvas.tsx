import useCanvas from "../hooks/useCanvas";

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  draw: (ctx: CanvasRenderingContext2D) => void,
}

export default function Canvas({ draw, ...rest }: CanvasProps) {
  const canvasRef = useCanvas(draw);
  return <canvas ref={canvasRef} { ...rest }></canvas>
}
