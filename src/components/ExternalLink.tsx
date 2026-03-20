import React from "react";
import { open } from "@tauri-apps/plugin-shell";
import { getPokewikiUrl } from "../utils/pokemonUtils";

interface ExternalLinkProps {
  name: string; // The English name from the API (e.g., "bulbasaur" or "sturdy")
  type: "ability" | "pokemon";
  text: string;
  className?: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  name,
  type,
  text,
  className = "",
}) => {
  const url = getPokewikiUrl(name, type);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await open(url);
  };

  return (
    <a
      href={url}
      onClick={handleClick}
      className={`text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-1 inline-flex items-center gap-1 ${className}`}
    >
      {text}
    </a>
  );
};
