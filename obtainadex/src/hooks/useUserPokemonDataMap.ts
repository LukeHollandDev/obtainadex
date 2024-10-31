import { isUserPokemonDataMap, type UserPokemonDataMap } from "../types.ts";

const STORAGE_KEY = "userDataPokemon";

interface useUserPokemonDataMapResponse {
  data: UserPokemonDataMap;
  error: Error | null;
}

function loadData(): useUserPokemonDataMapResponse {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    // no data so just return empty
    return { data: {}, error: null };
  }

  const parsedData = JSON.parse(data);

  if (!isUserPokemonDataMap(parsedData)) {
    // users data is not correct format
    return {
      data: {},
      error: Error(
        "Your Obtainadex data does not appear to have the correct format",
      ),
    };
  }

  return {
    data: parsedData,
    error: null,
  };
}

function saveData(data: UserPokemonDataMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// deno-lint-ignore no-explicit-any
function importData(object: any): useUserPokemonDataMapResponse {
  if (!object) {
    return { data: {}, error: Error("Unable to read the imported json file.") };
  }

  const parsedData = JSON.parse(object);

  if (!isUserPokemonDataMap(parsedData)) {
    // users data is not correct format
    return {
      data: {},
      error: Error(
        "The imported json file does not appear to be in the correct format",
      ),
    };
  }

  saveData(parsedData);

  return {
    data: parsedData,
    error: null,
  };
}

function exportData() {
  const { data, error } = loadData();

  if (error) {
    // TODO: handle error on the UI
    console.error(error);
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Get data as YYYY-MM-DD format
  const date = new Date();
  const dataFormatted = new Intl.DateTimeFormat("en-CA").format(date);

  // Create anchor with blob as url, click then remove it
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-${dataFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const useUserPokemonDataMap = () => {
  return {
    loadData,
    saveData,
    importData,
    exportData,
  };
};
