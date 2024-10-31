import type { Pokemon, UserDataPokemon } from "../../types.ts";

interface BoxProps {
  pokemon: Pokemon[];
  userData: UserDataPokemon[];
  key?: number;
}

export default function Box({ pokemon, userData, key = 0 }: BoxProps) {
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
        {pokemon.map((poke: Pokemon, i: number) =>
          renderPokemon(poke, i, userData)
        )}
      </div>
    </div>
  );
}

function renderPokemon(poke: Pokemon, key: number, data: UserDataPokemon[]) {
  const foundData = data.find(
    (entry: UserDataPokemon) =>
      poke.name === entry.name && poke.img_url === entry.img_url
  );

  const status = foundData?.status;

  return (
    <div key={key} className="relative">
      <img
        alt={poke.name}
        src={"https://www.serebii.net/" + poke.img_url}
        height={60}
        width={60}
      />
      {status === 1 ? (
        <div
          className="absolute top-1"
          onClick={() => console.log("mark obtained")}
        >
          <img alt="Obtained Icon" src="/obtained.svg" width={20} height={20} />
        </div>
      ) : null}
      {status === 2 ? (
        <div
          className="absolute top-1"
          onClick={() => console.log("mark own trainer")}
        >
          <img
            alt="Obtained Icon"
            src="/own-trainer-id.svg"
            width={20}
            height={20}
          />
        </div>
      ) : null}
    </div>
  );
}
