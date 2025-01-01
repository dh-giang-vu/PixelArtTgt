import CustomColorPicker from "./CustomColorPicker";
import '../styles/game-board.css';
import Canvas from "./Canvas";
import useDivDimension from "../hooks/useElementDimension";

export default function GameBoard() {
  const { ref, dimension } = useDivDimension();

  return (
    <div className="game-board-grid-container">
      
      <div className="sidebar sidebar-top">
        Music
      </div>

      <div className="sidebar sidebar-mid">
        <CustomColorPicker orientation="v"/>
        <CustomColorPicker orientation="h"/>
      </div>

      <div className="sidebar sidebar-bot">
        Online: 1
      </div>

      <div className="main" style={{ overflow: "hidden" }} ref={ref}>
        <Canvas width={dimension.width} height={dimension.height} imgWidth={500} imgHeight={500}/>
      </div>
    
    </div>
  )
}
