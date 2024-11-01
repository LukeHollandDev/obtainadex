import pokemonData from "../assets/pokemon.json" with { type: "json" };
import { isPokemon, type Pokemon } from "../types.ts";

interface PokemonHook {
  boxes: Pokemon[][];
  error: Error | null;
}

const formatError = "Pokemon data does not appear to have the correct format";

export const usePokemonData = (): PokemonHook => {
  // validate pokemonData is a list
  if (!pokemonData.length) {
    return {
      boxes: [],
      error: new Error(formatError),
    };
  }

  // validate each pokemon has expected data
  for (let i = 0; i < pokemonData.length; i++) {
    const box = pokemonData[i];

    if (!box.length) {
      return {
        boxes: [],
        error: new Error(formatError),
      };
    }

    for (let j = 0; j < box.length; j++) {
      if (!isPokemon(box[j])) {
        return {
          boxes: [],
          error: new Error(
            `${formatError}, error parsing: ${JSON.stringify(box[j])}`,
          ),
        };
      }
    }
  }

  return {
    boxes: pokemonData,
    error: null,
  };
};
