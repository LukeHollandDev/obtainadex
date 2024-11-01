import Export from "./Buttons/Export.tsx";
import Import from "./Buttons/Import.tsx";
import PDFDownloads from "./Buttons/PDFDownloads.tsx";

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
          <PDFDownloads />
        </div>
      </div>
    </div>
  );
}
