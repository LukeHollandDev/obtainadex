import Actions from "../Actions/Actions.tsx";
import Credit from "../Credit/Credit.tsx";
import Legend from "../Legend/Legend.tsx";

export default function Header() {
  return (
    <div className="flex flex-col text-center max-w-4xl m-auto gap">
      <h1 className="text-3xl">
        Welcome to <span className="text-gradient">Obtainadex</span>
      </h1>

      <p className="text-lg">
        Obtainadex has been created to has been created to make it easier to
        track the completion of a form dex.
      </p>

      <Credit />

      <div className="mt-4">
        <Actions />
      </div>

      <div className="mt-4">
        <Legend />
      </div>
    </div>
  );
}
