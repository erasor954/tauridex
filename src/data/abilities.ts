import { PokemonType } from "../types/pokemon";

export const ABILITY_MODIFIERS: Record<
  string,
  Partial<Record<PokemonType, number>>
> = {
  levitate: { ground: 0 },
  "earth-eat": { ground: 0 },
  "well-baked-body": { fire: 0 },
  "flash-fire": { fire: 0 },
  "volt-absorb": { electric: 0 },
  "lightning-rod": { electric: 0 },
  "motor-drive": { electric: 0 },
  "water-absorb": { water: 0 },
  "dry-skin": { water: 0, fire: 1.25 }, // Immune to Water, but weak to Fire
  "storm-drain": { water: 0 },
  "sap-sipper": { grass: 0 },
  "thick-fat": { fire: 0.5, ice: 0.5 },
  "purifying-salt": { ghost: 0.5 },
  heatproof: { fire: 0.5 },
  fluffy: { fire: 2.0 }, // Double damage from contact (simplified to Fire here)
  "wonder-guard": {
    /* Special logic needed for this one! */
  },
};
