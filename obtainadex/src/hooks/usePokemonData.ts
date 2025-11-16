import { useMemo } from "react";
import { useGameRegistry } from "./useGameRegistry.ts";
import { isPokemon, type Pokemon } from "../types.ts";

interface PokemonHook {
  boxes: Pokemon[][];
  error: Error | null;
  pokemonCount: number;
}

const formatError = "Pokemon data does not appear to have the correct format";

/**
 * Hook to load Pokemon data for a specific game and dex
 *
 * @param gameId - The game identifier (e.g., "scarlet-violet")
 * @param dexId - The dex identifier (e.g., "paldea")
 * @returns Pokemon boxes, error state, and pokemon count
 */
export const usePokemonData = (
  gameId: string | null,
  dexId: string | null
): PokemonHook => {
  const { getDex } = useGameRegistry();

  return useMemo(() => {
    // Return empty if no game/dex selected
    if (!gameId || !dexId) {
      return {
        boxes: [],
        error: null,
        pokemonCount: 0,
      };
    }

    // Get the dex data
    const dex = getDex(gameId, dexId);

    if (!dex) {
      return {
        boxes: [],
        error: new Error(`Dex not found: ${gameId}/${dexId}`),
        pokemonCount: 0,
      };
    }

    // Validate dex has boxes
    if (!dex.boxes || !dex.boxes.length) {
      return {
        boxes: [],
        error: new Error(formatError),
        pokemonCount: 0,
      };
    }

    // Validate each pokemon in each box
    for (let i = 0; i < dex.boxes.length; i++) {
      const box = dex.boxes[i];

      if (!box || !box.length) {
        return {
          boxes: [],
          error: new Error(formatError),
          pokemonCount: 0,
        };
      }

      for (let j = 0; j < box.length; j++) {
        if (!isPokemon(box[j])) {
          return {
            boxes: [],
            error: new Error(
              `${formatError}, error parsing: ${JSON.stringify(box[j])}`
            ),
            pokemonCount: 0,
          };
        }
      }
    }

    return {
      boxes: dex.boxes,
      error: null,
      pokemonCount: dex.pokemon_count,
    };
  }, [gameId, dexId, getDex]);
};
