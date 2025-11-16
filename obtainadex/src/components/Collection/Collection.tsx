import type { Pokemon, UserPokemonDataMap } from "../../types.ts";
import Box from "../Box/Box.tsx";

interface CollectionProps {
  boxes: Pokemon[][];
  userData: UserPokemonDataMap;
  gameId: string;
  dexId: string;
}

export function Collection({ boxes, userData, gameId, dexId }: CollectionProps) {
  return (
    <div>
      {boxes.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {boxes.map((box: Pokemon[], index: number) => (
            <Box
              key={index}
              pokemon={box}
              userData={userData}
              boxIndex={index}
              gameId={gameId}
              dexId={dexId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No Pokemon in this collection</p>
        </div>
      )}
    </div>
  );
}
