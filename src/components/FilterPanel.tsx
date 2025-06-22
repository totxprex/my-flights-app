import React from "react";
import "../styles/FilterPanel.css";

interface Props {
  minPrice: number;
  setMinPrice: (n: number) => void;
  maxStops: number;
  setMaxStops: (n: number) => void;
}

const FilterPanel: React.FC<Props> = ({ minPrice, setMinPrice, maxStops, setMaxStops }) => (
  <aside className="filter-panel">
    <h3>Filters</h3>
    <div>
      <label>Min Price</label>
      <input
        type="number"
        min={0}
        value={minPrice}
        onChange={(e) => setMinPrice(+e.target.value)}
      />
    </div>
    <div>
      <label>Max Stops</label>
      <input
        type="number"
        min={0}
        max={5}
        value={maxStops}
        onChange={(e) => setMaxStops(+e.target.value)}
      />
    </div>
  </aside>
);

export default FilterPanel;
