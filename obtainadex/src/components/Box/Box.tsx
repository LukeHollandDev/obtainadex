import type { Pokemon } from "../../types.ts";

interface BoxProps {
  pokemon: Pokemon[];
  key?: number;
}

export default function Box({ pokemon, key = 0 }: BoxProps) {
  if (pokemon.length === 0) {
    return;
  }

  return (
    <div key={key} className="border rounded-md">
      <div className="flex items-center p-2">
        <h3 className="text-xl italic">Box {key + 1}</h3>
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
        {pokemon.map((poke: Pokemon, i: number) => renderPokemon(poke, i))}
      </div>
    </div>
  );
}

function renderPokemon(poke: Pokemon, key: number) {
  return (
    <div key={key}>
      <img
        alt={poke.name}
        src={"https://www.serebii.net/" + poke.img_url}
        height={60}
        width={60}
      />
    </div>
  );
}
