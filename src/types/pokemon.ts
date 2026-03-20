export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export const ALL_TYPES: PokemonType[] = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

// export interface Pokemon {
//   id: number;
//   name: string;
//   sprites: {
//     other: {
//       "official-artwork": {
//         front_default: string;
//       };
//     };
//   };
//   abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
//   types: Array<{ type: { name: PokemonType } }>;
//   stats: Array<{ base_stat: number; stat: { name: string } }>;
// }
