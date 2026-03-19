import { PokemonType } from "../types/pokemon";

interface TypeBadgeProps {
  type: PokemonType;
  scale?: number;
}

export function TypeBadge({ type, scale = 2 }: TypeBadgeProps) {
  const imagePath = `/images/types/${type.toLowerCase()}.png`;

  return (
    <img
      src={imagePath}
      alt={type}
      style={{
        height: `${14 * scale}px`,
        width: "auto",
        imageRendering: "pixelated",
      }}
      className="inline-block object-contain"
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}
