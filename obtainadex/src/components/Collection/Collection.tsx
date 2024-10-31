import { usePokemonData } from "../../hooks/usePokemonData.ts";
import { useUserPokemonDataMap } from "../../hooks/useUserPokemonDataMap.ts";
import type { Pokemon } from "../../types.ts";
import Box from "../Box/Box.tsx";

export default function Collection() {
  const { boxes, error } = usePokemonData();
  const { data, error: userDataError } = useUserPokemonDataMap().loadData();

  return (
    <div>
      {error ? <p className="text-center">{error.message}</p> : null}

      {userDataError
        ? <p className="text-center">{userDataError.message}</p>
        : null}

      {boxes.length > 0 && !error
        ? (
          <div className="flex flex-wrap gap-6 justify-center">
            {boxes.map((box: Pokemon[], index: number) => (
              <Box key={index} pokemon={box} userData={data} boxIndex={index} />
            ))}
          </div>
        )
        : null}
    </div>
  );
}
