import CustomColorPicker from "./CustomColorPicker";
import '../styles/game-board.css';

export default function GameBoard() {

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

      <div className="main">
        Main Canvas
      </div>
    
    </div>
  )
}
