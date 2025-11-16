import { createContext, useContext, useState, ReactNode } from "react";

interface GameContextType {
  selectedGame: string | null;
  selectedDex: string | null;
  setSelectedGame: (gameId: string | null) => void;
  setSelectedDex: (dexId: string | null) => void;
  setGameAndDex: (gameId: string, dexId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedDex, setSelectedDex] = useState<string | null>(null);

  const setGameAndDex = (gameId: string, dexId: string) => {
    setSelectedGame(gameId);
    setSelectedDex(dexId);
  };

  return (
    <GameContext.Provider
      value={{
        selectedGame,
        selectedDex,
        setSelectedGame,
        setSelectedDex,
        setGameAndDex,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}
