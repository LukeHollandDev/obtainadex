import { useUserPokemonDataMap } from "../../../hooks/useUserPokemonDataMap.ts";

export default function Export() {
  const { exportData } = useUserPokemonDataMap();

  return (
    <button
      onClick={exportData}
      className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
    >
      export data
    </button>
  );
}
