import React from "react";
import ReactDOM from "react-dom/client";
import { PokedexView } from "./PokedexView";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <PokedexView />
  </React.StrictMode>,
);
