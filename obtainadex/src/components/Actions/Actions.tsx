import Export from "./Buttons/Export.tsx";
import Import from "./Buttons/Import.tsx";

export default function Actions() {
  return (
    <div className="flex flex-col text-center max-w-4xl m-auto gap">
      <h2 className="text-2xl">Actions</h2>

      <div className="flex justify-center gap-2">
        <div className="border-2 p-2 rounded-md">
          <h3 className="text-lg">Obtainadex Data</h3>
          <Import />
          <Export />
        </div>

        <div className="border-2 p-2 rounded-md">
          <h3 className="text-lg">PDF Download</h3>
          <button
            onClick={() => console.log("unobtained pdf")}
            className="text-orange-600 hover:bg-orange-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            unobtained
          </button>
          <button
            onClick={() => console.log("not own id pdf")}
            className="text-orange-600 hover:bg-orange-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            not own id
          </button>
          <button
            onClick={() => console.log("all pdf")}
            className="text-orange-600 hover:bg-orange-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            all
          </button>
        </div>
      </div>
    </div>
  );
}
