export interface Pokemon {
  name: string;
  img_url: string;
}

// deno-lint-ignore no-explicit-any
export function isPokemon(object: any) {
  return "name" in object && "img_url" in object;
}

export interface UserDataPokemon {
  name: string;
  img_url: string;
  // 1 = obtained; 2 = own trainer id
  status: 1 | 2;
}

// deno-lint-ignore no-explicit-any
export function isUserDataPokemon(object: any) {
  return (
    "name" in object &&
    "img_url" in object &&
    "status" in object &&
    (object?.status === 1 || object?.status === 2)
  );
}
