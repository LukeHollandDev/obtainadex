import { hashCode } from "../../../hash.ts";
import { usePokemonData } from "../../../hooks/usePokemonData.ts";
import { useUserPokemonDataMap } from "../../../hooks/useUserPokemonDataMap.ts";
import generatePdf from "../../../pdf/generatePdf.ts";
import type {
  PDFPokemon,
  Pokemon,
  UserPokemonDataMap,
} from "../../../types.ts";

export default function PDFDownloads() {
  const { loadData } = useUserPokemonDataMap();
  const { boxes, error: pokemonError } = usePokemonData();

  if (pokemonError) {
    console.error(pokemonError);
    return null;
  }

  const getUnobtainedPokemon = (data: UserPokemonDataMap): PDFPokemon[] => {
    const pokemon: Pokemon[] = boxes.flat();
    const unobtained: PDFPokemon[] = [];

    for (let i = 0; i < pokemon.length; i++) {
      const hash = hashCode(pokemon[i].name + pokemon[i].img_url);
      const key = `${pokemon[i].name}_${hash}`;

      if (!data[key]) {
        unobtained.push({
          name: pokemon[i].name,
          status: null,
        });
      }
    }

    return unobtained;
  };

  const downloadUnobtained = () => {
    const { data, error } = loadData();

    if (error) {
      // TODO: handle the error
      console.error(error);
      return null;
    }

    const unobtained: PDFPokemon[] = getUnobtainedPokemon(data);

    generatePdf("unobtained", unobtained);
  };

  const downloadNotOwnId = () => {
    const { data, error } = loadData();

    if (error) {
      // TODO: handle the error
      console.error(error);
      return null;
    }

    const notOwnId: PDFPokemon[] = getUnobtainedPokemon(data);

    // filter on status not being 2
    const notOwnIdKeys: string[] = Object.entries(data)
      .filter(([_, data]) => data.status !== 2)
      .map(([key]) => key);

    for (let i = 0; i < notOwnIdKeys.length; i++) {
      const key = notOwnIdKeys[i];
      const lastIndex = key.lastIndexOf("_");
      notOwnId.push({
        name: lastIndex !== -1 ? key.substring(0, lastIndex) : key,
        // can assume status 1 since there's only 2 statuses
        status: 1,
      });
    }

    generatePdf("not-own-id", notOwnId);
  };

  const downloadAll = () => {
    const { data, error } = loadData();

    if (error) {
      // TODO: handle the error
      console.error(error);
      return null;
    }

    const all: PDFPokemon[] = getUnobtainedPokemon(data);

    Object.entries(data).map(([key, value]) => {
      const lastIndex = key.lastIndexOf("_");
      all.push({
        name: lastIndex !== -1 ? key.substring(0, lastIndex) : key,
        status: value.status,
      });
    });

    generatePdf("all", all);
  };

  return (
    <>
      <button
        onClick={downloadUnobtained}
        className="text-orange-600 hover:bg-orange-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        unobtained
      </button>
      <button
        onClick={downloadNotOwnId}
        className="text-orange-600 hover:bg-orange-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        not own id
      </button>
      <button
        onClick={downloadAll}
        className="text-orange-600 hover:bg-orange-100 font-semibold py-1 px-3 rounded-md transition duration-200"
      >
        all
      </button>
    </>
  );
}
