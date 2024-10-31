import { ChangeEvent, useRef } from "react";
import { useUserData } from "../../hooks/useUserData.ts";

export default function Actions() {
  const { import: importFn } = useUserData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (!file) {
      // TODO: add some error handling here
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target?.result as string;
      const result = importFn(contents);
      if (result.error) {
        // TODO: add some error handling here
        console.error(result.error);
      } else {
        console.log("Imported Data:", result.data);
      }
    };
    reader.readAsText(file); // Read the file as text
  };

  return (
    <div className="flex flex-col text-center max-w-4xl m-auto gap">
      <h2 className="text-2xl">Actions</h2>

      <div className="flex justify-center gap-2">
        <div className="border-2 p-2 rounded-md">
          <h3 className="text-lg">Obtainadex Data</h3>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button
            onClick={() => handleImportClick()}
            className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            import data
          </button>
          <button
            onClick={() => console.log("export")}
            className="text-blue-600 hover:bg-blue-100 font-semibold py-1 px-3 rounded-md transition duration-200"
          >
            export data
          </button>
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
