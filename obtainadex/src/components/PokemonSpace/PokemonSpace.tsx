import { useState } from "react";
import { useUserData } from "../../hooks/useUserData.ts";
import type { Pokemon, UserDataPokemon } from "../../types.ts";

export default function PokemonSpace({
  pokemon,
  index,
  data,
}: {
  pokemon: Pokemon;
  index: number;
  data: UserDataPokemon[];
}) {
  const { update } = useUserData();

  const foundData = data.find(
    (entry: UserDataPokemon) =>
      pokemon.name === entry.name && pokemon.img_url === entry.img_url
  );

  const [status, setStatus] = useState<1 | 2>(foundData?.status);

  const handlePokemonClick = () => {
    let newStatus: 1 | 2 | undefined;

    if (!status) {
      newStatus = 1;
    } else if (status === 1) {
      newStatus = 2;
    } else if (status === 2) {
      newStatus = undefined;
    }

    if (newStatus !== undefined) {
      update(
        { name: pokemon.name, img_url: pokemon.img_url, status: newStatus },
        data
      );
      setStatus(newStatus);
    }
  };

  return (
    <div key={index} className="relative">
      <img
        alt={pokemon.name}
        src={"https://www.serebii.net/" + pokemon.img_url}
        height={60}
        width={60}
        onClick={handlePokemonClick}
      />
      {status === 1 ? (
        <div className="absolute top-1">
          <img alt="Obtained Icon" src="/obtained.svg" width={20} height={20} />
        </div>
      ) : null}
      {status === 2 ? (
        <div className="absolute top-1">
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
