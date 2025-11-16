import { useUserPokemonDataMap } from "../../../hooks/useUserPokemonDataMap.ts";

interface ExportProps {
  gameId: string;
  dexId: string;
}

export default function Export({ gameId, dexId }: ExportProps) {
  const { exportData, exportGameData, exportDexData } = useUserPokemonDataMap(gameId, dexId);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={exportDexData}
        className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        export this dex
      </button>
      <button
        onClick={() => exportGameData(gameId)}
        className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        export this game
      </button>
      <button
        onClick={exportData}
        className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        export all data
      </button>
    </div>
  );
}
