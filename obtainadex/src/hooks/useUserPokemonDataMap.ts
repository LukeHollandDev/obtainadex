import {
  isUserPokemonDataMap,
  isUserDataStore,
  type UserPokemonDataMap,
  type UserDataStore,
} from "../types.ts";

const STORAGE_KEY_V2 = "userDataStore_v2";
const STORAGE_KEY_V1 = "userDataPokemon"; // Legacy key for migration

interface useUserPokemonDataMapResponse {
  data: UserPokemonDataMap;
  error: Error | null;
}

interface useUserDataStoreResponse {
  data: UserDataStore;
  error: Error | null;
}

/**
 * Load all user data for all games/dexes
 */
function loadAllData(): useUserDataStoreResponse {
  // Try to load v2 data first
  const dataV2 = localStorage.getItem(STORAGE_KEY_V2);

  if (dataV2) {
    try {
      const parsedData = JSON.parse(dataV2);

      if (!isUserDataStore(parsedData)) {
        return {
          data: {},
          error: new Error(
            "Your Obtainadex data does not appear to have the correct format"
          ),
        };
      }

      return {
        data: parsedData,
        error: null,
      };
    } catch (err) {
      return {
        data: {},
        error: new Error("Error parsing user data"),
      };
    }
  }

  // Try to migrate from v1 data
  const dataV1 = localStorage.getItem(STORAGE_KEY_V1);
  if (dataV1) {
    try {
      const parsedData = JSON.parse(dataV1);

      if (isUserPokemonDataMap(parsedData)) {
        // Migrate v1 data to v2 format (store under "pokemon-home" -> "depositable")
        const migratedData: UserDataStore = {
          "pokemon-home": {
            "depositable": parsedData,
          },
        };

        // Save migrated data
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migratedData));

        return {
          data: migratedData,
          error: null,
        };
      }
    } catch (err) {
      // Fall through to return empty data
    }
  }

  // No data found
  return { data: {}, error: null };
}

/**
 * Load user data for a specific game and dex
 */
function loadData(
  gameId: string | null,
  dexId: string | null
): useUserPokemonDataMapResponse {
  if (!gameId || !dexId) {
    return { data: {}, error: null };
  }

  const { data: allData, error } = loadAllData();

  if (error) {
    return { data: {}, error };
  }

  // Get data for this specific game/dex
  const gameData = allData[gameId];
  if (!gameData) {
    return { data: {}, error: null };
  }

  const dexData = gameData[dexId];
  if (!dexData) {
    return { data: {}, error: null };
  }

  return { data: dexData, error: null };
}

/**
 * Save user data for a specific game and dex
 */
function saveData(
  gameId: string | null,
  dexId: string | null,
  data: UserPokemonDataMap
) {
  if (!gameId || !dexId) {
    return;
  }

  // Load all existing data
  const { data: allData } = loadAllData();

  // Ensure game exists
  if (!allData[gameId]) {
    allData[gameId] = {};
  }

  // Update dex data
  allData[gameId][dexId] = data;

  // Save back to localStorage
  localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(allData));
}

/**
 * Import data from JSON file
 * Supports both v1 (single game) and v2 (multi-game) formats
 */
// deno-lint-ignore no-explicit-any
function importData(object: any): useUserDataStoreResponse {
  if (!object) {
    return { data: {}, error: new Error("Unable to read the imported json file.") };
  }

  try {
    const parsedData = JSON.parse(object);

    // Check if it's v2 format (multi-game)
    if (isUserDataStore(parsedData)) {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(parsedData));
      return {
        data: parsedData,
        error: null,
      };
    }

    // Check if it's v1 format (single game)
    if (isUserPokemonDataMap(parsedData)) {
      // Import as pokemon-home/depositable
      const migratedData: UserDataStore = {
        "pokemon-home": {
          "depositable": parsedData,
        },
      };

      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(migratedData));

      return {
        data: migratedData,
        error: null,
      };
    }

    return {
      data: {},
      error: new Error(
        "The imported json file does not appear to be in the correct format"
      ),
    };
  } catch (err) {
    return {
      data: {},
      error: new Error("Error parsing imported data"),
    };
  }
}

/**
 * Export all user data for all games/dexes
 */
function exportData() {
  const { data, error } = loadAllData();

  if (error) {
    console.error(error);
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Get date as YYYY-MM-DD format
  const date = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-CA").format(date);

  // Create anchor with blob as url, click then remove it
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-all-${dateFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export data for a specific game
 */
function exportGameData(gameId: string) {
  const { data: allData, error } = loadAllData();

  if (error) {
    console.error(error);
    return;
  }

  const gameData = allData[gameId];
  if (!gameData) {
    console.error(`No data found for game: ${gameId}`);
    return;
  }

  const jsonString = JSON.stringify(gameData, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Get date as YYYY-MM-DD format
  const date = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-CA").format(date);

  // Create anchor with blob as url, click then remove it
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-${gameId}-${dateFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export data for a specific dex
 */
function exportDexData(gameId: string, dexId: string) {
  const { data, error } = loadData(gameId, dexId);

  if (error) {
    console.error(error);
    return;
  }

  if (!Object.keys(data).length) {
    console.error(`No data found for dex: ${gameId}/${dexId}`);
    return;
  }

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Get date as YYYY-MM-DD format
  const date = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-CA").format(date);

  // Create anchor with blob as url, click then remove it
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-${gameId}-${dexId}-${dateFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const useUserPokemonDataMap = (
  gameId: string | null = null,
  dexId: string | null = null
) => {
  return {
    loadData: () => loadData(gameId, dexId),
    loadAllData,
    saveData: (data: UserPokemonDataMap) => saveData(gameId, dexId, data),
    importData,
    exportData,
    exportGameData,
    exportDexData: () => {
      if (gameId && dexId) {
        exportDexData(gameId, dexId);
      }
    },
  };
};
