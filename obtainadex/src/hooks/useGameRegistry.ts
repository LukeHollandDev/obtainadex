import { useState, useEffect } from "react";
import type { GameRegistry, Game } from "../types.ts";
import { isGameRegistry } from "../types.ts";
import gamesData from "../assets/games.json";

interface UseGameRegistryResult {
  games: Game[];
  loading: boolean;
  error: Error | null;
  getGame: (gameId: string) => Game | undefined;
  getDex: (gameId: string, dexId: string) => Game["dexes"][number] | undefined;
}

export function useGameRegistry(): UseGameRegistryResult {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Validate the imported data
      if (!isGameRegistry(gamesData)) {
        throw new Error("Invalid games data format");
      }

      setGames(gamesData.games);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error loading games"));
      setLoading(false);
    }
  }, []);

  const getGame = (gameId: string): Game | undefined => {
    return games.find((game) => game.id === gameId);
  };

  const getDex = (gameId: string, dexId: string): Game["dexes"][number] | undefined => {
    const game = getGame(gameId);
    if (!game) return undefined;
    return game.dexes.find((dex) => dex.id === dexId);
  };

  return {
    games,
    loading,
    error,
    getGame,
    getDex,
  };
}
