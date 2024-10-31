import { ChangeEvent, useRef } from "react";
import { useUserData } from "../../../hooks/useUserData.ts";

export default function Import() {
  const { import: importUserData } = useUserData();

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
      const result = importUserData(contents);
      if (result.error) {
        // TODO: add some error handling here
        console.error(result.error);
      } else {
        console.log("Imported Data:", result.data);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
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
    </>
  );
}
