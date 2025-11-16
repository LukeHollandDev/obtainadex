import { useGameRegistry } from "../../hooks/useGameRegistry.ts";
import { useUserPokemonDataMap } from "../../hooks/useUserPokemonDataMap.ts";
import type { Game } from "../../types.ts";

interface DashboardProps {
  onSelectGame: (gameId: string, dexId: string) => void;
}

interface GameCardProps {
  game: Game;
  onSelect: (gameId: string, dexId: string) => void;
}

function GameCard({ game, onSelect }: GameCardProps) {
  const { loadAllData } = useUserPokemonDataMap();
  const { data: allUserData } = loadAllData();

  // Calculate progress for each dex
  const dexProgress = game.dexes.map((dex) => {
    const userData = allUserData[game.id]?.[dex.id] || {};
    const obtainedCount = Object.keys(userData).length;
    const totalCount = dex.pokemon_count;
    const percentage = totalCount > 0 ? Math.round((obtainedCount / totalCount) * 100) : 0;

    return {
      dexId: dex.id,
      dexName: dex.name,
      obtained: obtainedCount,
      total: totalCount,
      percentage,
    };
  });

  // Calculate overall progress
  const totalObtained = dexProgress.reduce((sum, d) => sum + d.obtained, 0);
  const totalPokemon = dexProgress.reduce((sum, d) => sum + d.total, 0);
  const overallPercentage = totalPokemon > 0
    ? Math.round((totalObtained / totalPokemon) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
      <p className="text-gray-600 mb-4">
        Generation {game.generation} • {game.region}
      </p>

      {/* Overall Progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{overallPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${overallPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {totalObtained} / {totalPokemon} Pokemon
        </p>
      </div>

      {/* Dex List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Pokedexes:</h3>
        {dexProgress.map((dex) => (
          <button
            key={dex.dexId}
            onClick={() => onSelect(game.id, dex.dexId)}
            className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">{dex.dexName}</span>
              <span className="text-sm text-gray-600">
                {dex.obtained} / {dex.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full"
                style={{ width: `${dex.percentage}%` }}
              ></div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Dashboard({ onSelectGame }: DashboardProps) {
  const { games, loading, error } = useGameRegistry();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Error loading games: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Obtainadex
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Select a game and Pokedex to start tracking your Pokemon collection
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onSelect={onSelectGame} />
        ))}
      </div>
    </div>
  );
}
