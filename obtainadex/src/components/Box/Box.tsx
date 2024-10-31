import type { Pokemon, UserDataPokemon } from "../../types.ts";
import PokemonSpace from "../PokemonSpace/PokemonSpace.tsx";

interface BoxProps {
  pokemon: Pokemon[];
  userData: UserDataPokemon[];
  boxIndex?: number;
}

export default function Box({ pokemon, userData, boxIndex = 0 }: BoxProps) {
  if (pokemon.length === 0) {
    return;
  }

  return (
    <div key={boxIndex} className="border rounded-md">
      <div className="flex items-center p-2">
        <h3 className="text-xl italic">Box {boxIndex + 1}</h3>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => console.log("mark all")}
            className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            mark all
          </button>

          <button
            onClick={() => console.log("clear all")}
            className="text-red-600 hover:bg-red-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            clear all
          </button>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-6 gap-2 p-2">
        {pokemon.map((poke: Pokemon, i: number) => (
          <PokemonSpace key={i} pokemon={poke} index={i} data={userData} />
        ))}
      </div>
    </div>
  );
}
