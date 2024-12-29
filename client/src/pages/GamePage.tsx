import GameBoard from '../components/GameBoard';
import { usePlayerInfo } from '../contexts/PlayerInfoContext';
import '../styles/game-page.css';

export default function GamePage() {

  const playerInfo = usePlayerInfo();

  return (
    <>
      <div className='game-board-container'>
        <GameBoard />
        <div className='lobby-btn-container'>
          <button className='to-lobby-btn' onClick={playerInfo.logout}>{"<"} Back to Lobby</button>
        </div>
      </div>
    </>
  )
}
