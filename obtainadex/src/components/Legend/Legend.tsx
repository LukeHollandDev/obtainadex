export default function Legend() {
  return (
    <>
      <h2 className="text-2xl">Legend</h2>
      <div className="flex flex-col gap-2 text-lg text-left">
        <div className="flex items-center gap-4">
          <img alt="Obtained Icon" src="/obtained.svg" width={35} height={35} />
          <p>Pokemon is owned, click once to mark.</p>
        </div>
        <div className="flex items-center gap-4">
          <img
            alt="Obtained Icon"
            src="/own-trainer-id.svg"
            width={35}
            height={35}
          />
          <p>Pokemon has been has your trainer ID, click twice to mark.</p>
        </div>
        <p>Click a Pokemon a third time to unmark it completely.</p>
      </div>
    </>
  );
}
