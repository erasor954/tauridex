import { Item } from "../bindings";

interface ItemImageProp {
  item: Item;
}
export function ItemImage({ item }: ItemImageProp) {
  return (
    <div className="relative group">
      <img
        src={item?.sprites?.default}
        alt={item?.name}
        className="w-8 h-8 object-contain -translate-y-2"
      />

      <span className="absolute mt-2 left-1/2 -translate-x-1/2 -translate-y-2 bottom-full hidden group-hover:block w-max px-2 py-1 bg-slate-900 text-white text-xs rounded border border-slate-700 shadow-xl pointer-events-none z-20">
        {item?.name.replace("-", " ").toUpperCase()}
      </span>
    </div>
  );
}
