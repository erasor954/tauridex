import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PokedexView } from "./PokedexView";
import { TypeChartView } from "./TypeChartView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PokedexView />} />
        <Route path="/typechart" element={<TypeChartView />} />
      </Routes>
    </BrowserRouter>
  );
}
