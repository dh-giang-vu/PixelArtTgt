import { usePlayerInfo } from "./contexts/PlayerInfoContext"
import Layout from "./Layout"
import GamePage from "./pages/GamePage";
import LobbyPage from "./pages/LobbyPage";

function App() {

  const { hasPlayerInfo } = usePlayerInfo();

  return (
    <>
      <Layout>
        {hasPlayerInfo() ? <GamePage /> : <LobbyPage />}
      </Layout>
    </>
  )
}

export default App
