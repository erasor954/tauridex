import { type EvolutionNode } from "../bindings";
import { PokemonSprite } from "./PokemonSprite";
import { EvolutionRequirement } from "./EvolutionRequirement";

export function EvolutionTree({ node }: { node: EvolutionNode }) {
  if (node.evolution_details === undefined || node.evolves_to === undefined) {
    return;
  }
  const detail = node.evolution_details[0];
  var name = "";
  if (detail) {
    name = detail.trigger.name.replace("-", " ");
  }

  return (
    <div className="flex items-center my-2.5 justify-center">
      {detail && (
        <span className="flex">
          <EvolutionRequirement detail={detail} name="name" />
        </span>
      )}

      <div className="p-2.5 border rounded-lg border-slate-500">
        <PokemonSprite name={node.species.name} />
      </div>

      {node.evolves_to.length > 0 && (
        <div className="flex flex-col">
          {node.evolves_to.map((nextNode, index) => (
            <EvolutionTree key={index} node={nextNode} />
          ))}
        </div>
      )}
    </div>
  );
}
