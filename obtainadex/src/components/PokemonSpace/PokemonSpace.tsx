import { type Pokemon } from "../../types.ts";
import obtainedSvg from "../../assets/obtained.svg";
import ownTrainerIdSvg from "../../assets/own-trainer-id.svg";

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
            <img alt="Obtained Icon" src={obtainedSvg} width={20} height={20} />
          </div>
        )
        : null}
      {status === 2
        ? (
          <div className="absolute top-1">
            <img
              alt="Own Trainer ID Icon"
              src={ownTrainerIdSvg}
              width={20}
              height={20}
            />
          </div>
        )
        : null}
    </div>
  );
}
