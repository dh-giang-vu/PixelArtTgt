import GameBoard from '../components/GameBoard';
import { PixelArtContextProvider } from '../contexts/PixelArtContext';
import { usePlayerInfo } from '../contexts/PlayerInfoContext';
import '../styles/game-page.css';

export default function GamePage() {

  const { logout } = usePlayerInfo();

  return (
    <>
      <div className='game-board-container'>
        <PixelArtContextProvider>
          <GameBoard />
        </PixelArtContextProvider>
        <div className='lobby-btn-container'>
          <button className='to-lobby-btn' onClick={logout}>{"<"} Back to Lobby</button>
        </div>
      </div>
    </>
  )
}
