import { type Pokemon } from "../../types.ts";

interface PokemonSpaceProps {
  pokemon: Pokemon;
  index: number;
  status: 1 | 2 | null;
  onUpdateStatus: (pokemon: Pokemon, newStatus: 1 | 2 | null) => void;
}

export default function PokemonSpace({
  pokemon,
  index,
  status,
  onUpdateStatus,
}: PokemonSpaceProps) {
  const handlePokemonClick = () => {
    let newStatus: 1 | 2 | null = null;

    if (!status) {
      newStatus = 1;
    } else if (status === 1) {
      newStatus = 2;
    }

    onUpdateStatus(pokemon, newStatus);
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
      {status === 1
        ? (
          <div className="absolute top-1">
            <img
              alt="Obtained Icon"
              src="/obtained.svg"
              width={20}
              height={20}
            />
          </div>
        )
        : null}
      {status === 2
        ? (
          <div className="absolute top-1">
            <img
              alt="Obtained Icon"
              src="/own-trainer-id.svg"
              width={20}
              height={20}
            />
          </div>
        )
        : null}
    </div>
  );
}
