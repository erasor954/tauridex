import { EvolutionDetails } from "../bindings";
import { ItemImage } from "./ItemImage";
import { LabelledArrow } from "./LabelledArrow";

export function EvolutionRequirement({
  detail,
  name,
}: {
  detail: EvolutionDetails;
  name: string;
}) {
  const getLabel = () => {
    switch (detail.trigger.name) {
      case "level-up":
        return detail.min_level
          ? `Lvl ${detail.min_level}`
          : "Special Level Up";
      case "use-item":
        return detail.item ? <ItemImage item={detail.item} /> : "no-item";
      case "trade":
        return "Trade";
      case "shed":
        return "Shedding";
      default:
        return `Special ${name}`;
    }
  };

  return (
    <span className="flex items-center">
      <LabelledArrow label={getLabel()} />
    </span>
  );
}
