import { useState } from "react";
import { GameProvider } from "./context/GameContext.tsx";
import { Dashboard } from "./components/Dashboard/Dashboard.tsx";
import { GameView } from "./components/GameView/GameView.tsx";

function App() {
  const [currentView, setCurrentView] = useState<{
    type: "dashboard" | "game";
    gameId?: string;
    dexId?: string;
  }>({ type: "dashboard" });

  const handleSelectGame = (gameId: string, dexId: string) => {
    setCurrentView({ type: "game", gameId, dexId });
  };

  const handleBackToDashboard = () => {
    setCurrentView({ type: "dashboard" });
  };

  return (
    <GameProvider>
      <main>
        {currentView.type === "dashboard" ? (
          <Dashboard onSelectGame={handleSelectGame} />
        ) : currentView.gameId && currentView.dexId ? (
          <GameView
            gameId={currentView.gameId}
            initialDexId={currentView.dexId}
            onBackToDashboard={handleBackToDashboard}
          />
        ) : null}
      </main>
    </GameProvider>
  );
}

export default App;
