import { useUserData } from "../../../hooks/useUserData.ts";

export default function Export() {
  const { export: exportUserData } = useUserData();

  return (
    <>
      <button
        onClick={exportUserData}
        className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        export data
      </button>
    </>
  );
}
