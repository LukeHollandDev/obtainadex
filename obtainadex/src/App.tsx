import Collection from "./components/Collection/Collection.tsx";
import Header from "./components/Header/Header.tsx";

function App() {
  return (
    <main className="m-4">
      <Header />

      <hr className="my-4 mx-[-1rem]" />

      <Collection />
    </main>
  );
}

export default App;
