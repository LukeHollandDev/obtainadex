import { useState } from "react";
import {
  getPokemonStatus,
  type Pokemon,
  type UserPokemonDataMap,
} from "../../types.ts";
import PokemonSpace from "../PokemonSpace/PokemonSpace.tsx";
import { hashCode } from "../../hash.ts";
import { useUserPokemonDataMap } from "../../hooks/useUserPokemonDataMap.ts";

interface BoxProps {
  pokemon: Pokemon[];
  userData: UserPokemonDataMap;
  boxIndex?: number;
}

export default function Box({ pokemon, userData, boxIndex = 0 }: BoxProps) {
  const [userPokemonData, setUserPokemonData] = useState<UserPokemonDataMap>(
    userData,
  );
  const { saveData } = useUserPokemonDataMap();

  if (pokemon.length === 0) {
    return null;
  }

  const updatePokemonStatus = (pokemon: Pokemon, newStatus: 1 | 2 | null) => {
    const hash = hashCode(pokemon.name + pokemon.img_url);
    const key = `${pokemon.name}_${hash}`;
    const newData = { ...userPokemonData };

    if (newStatus === null) {
      delete newData[key];
    } else {
      newData[key] = { status: newStatus };
    }

    setUserPokemonData(newData);
    saveData(newData);
  };

  const markAll = () => {
    const newUserPokemonData = { ...userPokemonData };

    pokemon.forEach((poke: Pokemon) => {
      const hash = hashCode(poke.name + poke.img_url);
      const key = `${poke.name}_${hash}`;
      const currentData = newUserPokemonData[key];

      if (!currentData) {
        newUserPokemonData[key] = { status: 1 };
      } else if (currentData.status === 1) {
        newUserPokemonData[key] = { status: 2 };
      } else if (currentData.status === 2) {
        delete newUserPokemonData[key];
      }
    });

    setUserPokemonData(newUserPokemonData);
    saveData(newUserPokemonData);
  };

  const clearAll = () => {
    const newUserPokemonData = { ...userPokemonData };

    pokemon.forEach((poke: Pokemon) => {
      if (getPokemonStatus(poke, newUserPokemonData)) {
        const hash = hashCode(poke.name + poke.img_url);
        delete newUserPokemonData[`${poke.name}_${hash}`];
      }
    });

    setUserPokemonData(newUserPokemonData);
    saveData(newUserPokemonData);
  };

  return (
    <div key={boxIndex} className="border rounded-md">
      <div className="flex items-center p-2">
        <h3 className="text-xl italic">Box {boxIndex + 1}</h3>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={markAll}
            className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            mark all
          </button>

          <button
            onClick={clearAll}
            className="text-red-600 hover:bg-red-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            clear all
          </button>
        </div>
      </div>
      <hr />
      <div className="grid grid-cols-6 gap-2 p-2">
        {pokemon.map((poke: Pokemon, i: number) => {
          const hash = hashCode(poke.name + poke.img_url);
          const key = `${poke.name}_${hash}`;
          const data = userPokemonData[key] || null;

          return (
            <PokemonSpace
              key={`${poke.name}_${i}`}
              pokemon={poke}
              index={i}
              status={data ? data.status : null}
              onUpdateStatus={updatePokemonStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
