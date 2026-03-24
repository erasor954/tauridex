import { createContext, useContext } from "react";

interface SearchContextType {
  handleSearch: (e?: React.SubmitEvent, manualInput?: string) => Promise<void>;
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
