import React, { useContext, useEffect, useState } from "react";
import { FlightContext, Flight } from "../context/FlightContext";
import FlightCard from "../components/FlightCard";
import FilterPanel from "../components/FilterPanel";
import "../styles/ResultsPage.css";

const ResultsPage: React.FC = () => {
  const { results, loading, fetchFlights } = useContext(FlightContext);
  const [filtered, setFiltered] = useState<Flight[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxStops, setMaxStops] = useState<number>(5);

  // Run fetchFlights only once, on mount
  useEffect(() => {
    fetchFlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters whenever results or criteria change
  useEffect(() => {
    setFiltered(
      results
        .filter((f) => f.price >= minPrice && f.stops <= maxStops)
        .sort((a, b) => a.price - b.price)
    );
  }, [results, minPrice, maxStops]);

  return (
    <div className="results-page">
      <FilterPanel
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxStops={maxStops}
        setMaxStops={setMaxStops}
      />

      <div className="flight-list">
        {loading ? (
          <p>Loading flights...</p>
        ) : filtered.length ? (
          filtered.map((f) => <FlightCard key={f.id} flight={f} />)
        ) : (
          <p>No flights match your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
