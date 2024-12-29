import { usePlayerInfo } from '../contexts/PlayerInfoContext';
import '../styles/lobby.css';


export default function LobbyPage() {

  const playerInfo = usePlayerInfo();

  function joinRandom() {
    playerInfo.setUsername("Alice");
    playerInfo.setRoomId("12345");
    playerInfo.setInfoSubmitted(true);
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = playerInfo.submitPlayerInfo();

    // notify form errors
    if (errors.username.reasons.length > 0) {
      errors.username.reasons.forEach(err => {
        alert(err);
      });
    }

    if (errors.roomId.reasons.length > 0) {
      errors.roomId.reasons.forEach(err => {
        alert(err);
      });
    }
  }

  return (
    <div className='lobby-container'>
      <h3>Welcome</h3>
      <form className='lobby-form' onSubmit={handleFormSubmit}>
        <input type="text" name="username" id="username" placeholder='username' value={playerInfo.username} onChange={(e) => playerInfo.setUsername(e.target.value)} />
        <input type="text" name="roomId" id="roomId" placeholder='roomId' value={playerInfo.roomId} onChange={(e) => playerInfo.setRoomId(e.target.value)} />
        <button type='submit'>Join Game</button>
      </form>
      <p>------------ or ------------</p>
      <button onClick={joinRandom}>Join Random</button>
    </div>
  )
}
