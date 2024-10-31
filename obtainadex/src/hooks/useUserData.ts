import { isUserDataPokemon, type UserDataPokemon } from "../types.ts";

const STORAGE_KEY = "userData";

function loadUserData(): UserDataPokemon[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    // TODO: maybe return error like the pokemon data hook
    return [];
  }

  const dataParsed = JSON.parse(data);

  if (!dataParsed.length) {
    // TODO: maybe return error like the pokemon data hook
    return [];
  }

  const userData: UserDataPokemon[] = [];
  for (let i = 0; i < dataParsed.length; i++) {
    if (isUserDataPokemon(dataParsed[i])) {
      userData.push(dataParsed[i]);
    }
  }

  return userData;
}

function saveUserData(data: UserDataPokemon[]): UserDataPokemon[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  return data;
}

// deno-lint-ignore no-explicit-any
function importFromJson(object: any): {
  data: UserDataPokemon[];
  error: Error | null;
} {
  if (!object) {
    return { data: [], error: Error("Unable to read the imported file.") };
  }

  const dataParsed = JSON.parse(object);

  if (!dataParsed.length && dataParsed.length !== 0) {
    return { data: [], error: Error("Unable to read the imported file.") };
  }

  const userData: UserDataPokemon[] = [];
  for (let i = 0; i < dataParsed.length; i++) {
    if (isUserDataPokemon(dataParsed[i])) {
      userData.push(dataParsed[i]);
    }
  }

  return { data: saveUserData(userData), error: null };
}

function exportUserDataToJson(data: UserDataPokemon[]) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Get data as YYYY-MM-DD format
  const date = new Date();
  const dataFormatted = new Intl.DateTimeFormat("en-CA").format(date);

  // Create anchor with blob as url, click then remove it
  const a = document.createElement("a");
  a.href = url;
  a.download = `obtainadex-data-${dataFormatted}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function updateUserData(data: UserDataPokemon, userData: UserDataPokemon[]) {
  const index = userData.findIndex(
    (entry: UserDataPokemon) =>
      entry.name === data.name && entry.img_url === data.img_url
  );

  if (index === -1) {
    userData.push(data);
  } else {
    userData[index] = data;
  }

  return saveUserData(userData);
}

function updateUserDataBulk(
  data: UserDataPokemon[],
  userData: UserDataPokemon[]
) {
  const indices: number[] = [];

  // collect all relevant indices
  data.forEach((entry: UserDataPokemon) =>
    indices.push(
      userData.findIndex(
        (e: UserDataPokemon) =>
          e.name === entry.name && e.img_url === entry.img_url
      )
    )
  );

  indices.forEach((index: number) => {
    if (index === -1) {
      userData.push(data[index]);
    } else {
      userData[index] = data[index];
    }
  });

  return saveUserData(userData);
}

export const useUserData = () => {
  return {
    load: loadUserData,
    save: saveUserData,
    update: updateUserData,
    bulkUpdate: updateUserDataBulk,
    import: importFromJson,
    export: exportUserDataToJson,
  };
};
