import { type EvolutionNode } from "../bindings";
import { PokemonSprite } from "./PokemonSprite";

export function EvolutionTree({ node }: { node: EvolutionNode }) {
  if (node.evolution_details === undefined || node.evolves_to === undefined) {
    return;
  }
  const detail = node.evolution_details[0];

  return (
    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
      {detail && (
        <span style={{ margin: "0 15px", color: "gray" }}>
          →{" "}
          {detail.trigger.name === "level-up" && detail.min_level
            ? `Lvl ${detail.min_level}`
            : detail.trigger.name}{" "}
          →
        </span>
      )}

      <div
        style={{
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <PokemonSprite name={node.species.name} />
      </div>

      {node.evolves_to.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px",
          }}
        >
          {node.evolves_to.map((nextNode, index) => (
            <EvolutionTree key={index} node={nextNode} />
          ))}
        </div>
      )}
    </div>
  );
}
