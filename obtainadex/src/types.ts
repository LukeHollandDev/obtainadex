export interface Pokemon {
  name: string;
  img_url: string;
}

// deno-lint-ignore no-explicit-any
export function isPokemon(object: any) {
  return "name" in object && "img_url" in object;
}
