import { usePokemonData } from "../../hooks/usePokemonData.ts";
import { useUserData } from "../../hooks/useUserData.ts";
import type { Pokemon } from "../../types.ts";
import Box from "../Box/Box.tsx";

export default function Collection() {
  const { boxes, error } = usePokemonData();
  const { load } = useUserData();

  const userData = load();

  return (
    <div>
      {error ? <p>Handle error here...</p> : null}

      {boxes.length > 0 && !error ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {boxes.map((box: Pokemon[], i: number) =>
            Box({ pokemon: box, userData, key: i })
          )}
        </div>
      ) : null}
    </div>
  );
}
