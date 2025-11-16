import { useState, useEffect } from "react";
import { useGameRegistry } from "../../hooks/useGameRegistry.ts";
import { usePokemonData } from "../../hooks/usePokemonData.ts";
import { useUserPokemonDataMap } from "../../hooks/useUserPokemonDataMap.ts";
import { DexSelector } from "../DexSelector/DexSelector.tsx";
import { Collection } from "../Collection/Collection.tsx";
import { Header } from "../Header/Header.tsx";

interface GameViewProps {
  gameId: string;
  initialDexId: string;
  onBackToDashboard: () => void;
}

export function GameView({ gameId, initialDexId, onBackToDashboard }: GameViewProps) {
  const [selectedDexId, setSelectedDexId] = useState(initialDexId);
  const { getGame } = useGameRegistry();
  const game = getGame(gameId);

  const { boxes, error: pokemonError, pokemonCount } = usePokemonData(gameId, selectedDexId);
  const { loadData, saveData } = useUserPokemonDataMap(gameId, selectedDexId);
  const { data: userData, error: userDataError } = loadData();

  // Update selected dex if initialDexId changes
  useEffect(() => {
    setSelectedDexId(initialDexId);
  }, [initialDexId]);

  if (!game) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Game not found: {gameId}</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (pokemonError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading Pokemon: {pokemonError.message}</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (userDataError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading user data: {userDataError.message}</p>
          <button
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedDex = game.dexes.find((d) => d.id === selectedDexId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to Dashboard Button */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={onBackToDashboard}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Game Header */}
      <div className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
          <p className="text-gray-600">
            {game.region} • Generation {game.generation}
          </p>
        </div>
      </div>

      {/* Dex Selector */}
      <div className="container mx-auto px-4">
        <DexSelector
          dexes={game.dexes}
          selectedDexId={selectedDexId}
          onSelectDex={setSelectedDexId}
        />
      </div>

      {/* Header with Actions */}
      <div className="container mx-auto px-4">
        <Header gameId={gameId} dexId={selectedDexId} />
      </div>

      {/* Collection */}
      <div className="container mx-auto px-4 pb-8">
        {selectedDex && boxes.length > 0 ? (
          <div>
            <div className="mb-4 text-center text-gray-600">
              <p className="text-sm">
                {selectedDex.name} - {pokemonCount} Pokemon
              </p>
            </div>
            <Collection boxes={boxes} userData={userData} gameId={gameId} dexId={selectedDexId} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No Pokemon data available for this dex.</p>
          </div>
        )}
      </div>
    </div>
  );
}
