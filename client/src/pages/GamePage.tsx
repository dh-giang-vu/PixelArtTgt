import { usePlayerInfo } from '../contexts/PlayerInfoContext';

export default function GamePage() {

  const playerInfo = usePlayerInfo();

  return (
    <>
      <div style={{ fontWeight: "bold", marginTop: 10 }}>
        Game Page
      </div>
      <button onClick={playerInfo.logout} style={{ marginTop: 10 }}>
        {"<"} Back to Lobby
      </button>
    </>
  )
}
