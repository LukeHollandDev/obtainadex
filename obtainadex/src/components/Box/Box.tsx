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
    <div key={key}>
      <h3>Box</h3>
      <div>
        {pokemon.map((poke: Pokemon, i: number) => renderPokemon(poke, i))}
      </div>
    </div>
  );
}

function renderPokemon(poke: Pokemon, key: number) {
  return <div key={key}>{poke.name}</div>;
}
