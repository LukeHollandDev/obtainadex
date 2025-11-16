import Export from "./Buttons/Export.tsx";
import Import from "./Buttons/Import.tsx";
import PDFDownloads from "./Buttons/PDFDownloads.tsx";

interface ActionsProps {
  gameId: string;
  dexId: string;
}

export default function Actions({ gameId, dexId }: ActionsProps) {
  return (
    <div className="flex flex-col text-center max-w-4xl m-auto gap-2">
      <h2 className="text-2xl">Actions</h2>

      <div className="flex justify-center gap-2 flex-wrap">
        <div className="border-2 p-2 rounded-md">
          <h3 className="text-lg">Obtainadex Data</h3>
          <Import />
          <Export gameId={gameId} dexId={dexId} />
        </div>

        <div className="border-2 p-2 rounded-md">
          <h3 className="text-lg">PDF Download</h3>
          <PDFDownloads gameId={gameId} dexId={dexId} />
        </div>
      </div>
    </div>
  );
}
