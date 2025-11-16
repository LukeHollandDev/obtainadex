import { hashCode } from "./hash.ts";

// Core Pokemon data
export interface Pokemon {
  name: string;
  img_url: string;
  hash: number;
  dex_number: number; // Position in this specific dex
}

// Game and Dex structure
export type DexType = "regional" | "national" | "special";

export interface Dex {
  id: string; // e.g., "paldea", "kitakami", "galar"
  name: string; // e.g., "Paldea Dex", "Galar Dex"
  type: DexType;
  boxes: Pokemon[][]; // 2D array of boxes
  pokemon_count: number; // Total Pokemon in this dex
}

export interface Game {
  id: string; // e.g., "scarlet-violet", "sword-shield"
  name: string; // e.g., "Pokemon Scarlet/Violet"
  generation: number; // 8, 9, etc.
  region: string; // e.g., "Paldea", "Galar"
  dexes: Dex[];
}

export interface GameRegistry {
  games: Game[];
}

// User data storage
export interface UserPokemonData {
  status: 1 | 2;
}

export interface UserPokemonDataMap {
  [key: string]: UserPokemonData;
}

// Multi-game user data structure
export interface UserDataStore {
  [gameId: string]: {
    [dexId: string]: UserPokemonDataMap;
  };
}

export interface PDFPokemon {
  name: string;
  status: 1 | 2 | null;
}

// Validation functions
// deno-lint-ignore no-explicit-any
export function isPokemon(object: any): object is Pokemon {
  return (
    object &&
    "name" in object &&
    "img_url" in object &&
    "hash" in object &&
    "dex_number" in object
  );
}

// deno-lint-ignore no-explicit-any
export function isDex(object: any): object is Dex {
  return (
    object &&
    "id" in object &&
    "name" in object &&
    "type" in object &&
    "boxes" in object &&
    "pokemon_count" in object &&
    Array.isArray(object.boxes)
  );
}

// deno-lint-ignore no-explicit-any
export function isGame(object: any): object is Game {
  return (
    object &&
    "id" in object &&
    "name" in object &&
    "generation" in object &&
    "region" in object &&
    "dexes" in object &&
    Array.isArray(object.dexes)
  );
}

// deno-lint-ignore no-explicit-any
export function isGameRegistry(object: any): object is GameRegistry {
  return (
    object &&
    "games" in object &&
    Array.isArray(object.games) &&
    object.games.every(isGame)
  );
}

// deno-lint-ignore no-explicit-any
function isUserPokemonData(object: any): boolean {
  return object && (object.status === 1 || object.status === 2);
}

// deno-lint-ignore no-explicit-any
export function isUserPokemonDataMap(object: any): boolean {
  return object && Object.values(object).every(isUserPokemonData);
}

// deno-lint-ignore no-explicit-any
export function isUserDataStore(object: any): object is UserDataStore {
  if (!object || typeof object !== "object") return false;

  return Object.values(object).every((gameData) => {
    if (!gameData || typeof gameData !== "object") return false;
    return Object.values(gameData).every(isUserPokemonDataMap);
  });
}

// Helper function to get Pokemon status from map
export function getPokemonStatus(
  pokemon: Pokemon,
  map: UserPokemonDataMap,
): UserPokemonData["status"] | null {
  const hash = hashCode(`${pokemon.name}${pokemon.img_url}`);
  const key = `${pokemon.name}_${hash}`;

  return key in map ? map[key].status : null;
}

// Helper function to create storage key for multi-game structure
export function createPokemonKey(
  pokemon: Pokemon,
  gameId?: string,
  dexId?: string,
): string {
  const hash = hashCode(`${pokemon.name}${pokemon.img_url}`);
  if (gameId && dexId) {
    return `${gameId}_${dexId}_${pokemon.name}_${hash}`;
  }
  return `${pokemon.name}_${hash}`;
}
