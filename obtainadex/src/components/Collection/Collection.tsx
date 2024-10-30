import { usePokemonData } from "../../hooks/usePokemonData.ts";
import type { Pokemon } from "../../types.ts";
import Box from "../Box/Box.tsx";

export default function Collection() {
  const { boxes, error } = usePokemonData();

  return (
    <div>
      {error ? <p>Handle error here...</p> : null}

      {boxes.length > 0 && !error
        ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {boxes.map((box: Pokemon[], i: number) =>
              Box({ pokemon: box, key: i })
            )}
          </div>
        )
        : null}
    </div>
  );
}
