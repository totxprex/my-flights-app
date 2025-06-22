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

  useEffect(() => {
    fetchFlights();
  }, []);

  useEffect(() => {
    const filteredFlights = results
      .filter((flight) => flight.price >= minPrice && flight.stops <= maxStops)
      .sort((a, b) => a.price - b.price);

    setFiltered(filteredFlights);
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
          filtered.map((flight) => <FlightCard key={flight.id} flight={flight} />)
        ) : (
          <p>No flights found. Try adjusting your filters.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
