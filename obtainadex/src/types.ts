import { hashCode } from "./hash.ts";

export interface Pokemon {
  name: string;
  img_url: string;
  hash: number;
}

export interface UserPokemonData {
  status: 1 | 2;
}

export interface UserPokemonDataMap {
  [key: string]: UserPokemonData;
}

export interface PDFPokemon {
  name: string;
  status: 1 | 2 | null;
}

// deno-lint-ignore no-explicit-any
export function isPokemon(object: any) {
  return "name" in object && "img_url" in object && "hash" in object;
}

// deno-lint-ignore no-explicit-any
function isUserPokemonData(object: any): boolean {
  return object && (object.status === 1 || object.status === 2);
}
// deno-lint-ignore no-explicit-any
export function isUserPokemonDataMap(object: any): boolean {
  return object && Object.values(object).every(isUserPokemonData);
}

export function getPokemonStatus(
  pokemon: Pokemon,
  map: UserPokemonDataMap,
): UserPokemonData["status"] | null {
  const hash = hashCode(`${pokemon.name}${pokemon.img_url}`);
  const key = `${pokemon.name}_${hash}`;

  return key in map ? map[key].status : null;
}
