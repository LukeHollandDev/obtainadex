import Actions from "../Actions/Actions.tsx";
import Credit from "../Credit/Credit.tsx";
import Legend from "../Legend/Legend.tsx";

interface HeaderProps {
  gameId: string;
  dexId: string;
}

export function Header({ gameId, dexId }: HeaderProps) {
  return (
    <div className="flex flex-col text-center max-w-4xl m-auto gap-4 mb-6">
      <p className="text-lg text-gray-700">
        Track your Pokemon collection by clicking on each Pokemon to mark it as obtained or with your trainer ID.
      </p>

      <Credit />

      <div className="mt-2">
        <Actions gameId={gameId} dexId={dexId} />
      </div>

      <div className="mt-2">
        <Legend />
      </div>
    </div>
  );
}

export default Header;
