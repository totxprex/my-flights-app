import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../context/FlightContext";
import { airports, Airport } from "../data/airports";
import "../styles/SearchPage.css";

const SearchPage: React.FC = () => {
  const { setParams } = useContext(FlightContext);
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [originOptions, setOriginOptions] = useState<Airport[]>([]);
  const [destOptions, setDestOptions] = useState<Airport[]>([]);
  const [form, setForm] = useState({
    placeIdFrom: "",
    placeIdTo: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
  });
  const navigate = useNavigate();

  const handleQuery = (
    text: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setOptions: React.Dispatch<React.SetStateAction<Airport[]>>
  ) => {
    setQuery(text);
    setOptions(
      text.trim().length >= 2
        ? airports.filter(
            (a) =>
              a.Name.toLowerCase().includes(text.toLowerCase()) ||
              a.PlaceId.toLowerCase().startsWith(text.toLowerCase())
          )
        : []
    );
  };

  const handleSelect = (
    option: Airport,
    field: "placeIdFrom" | "placeIdTo",
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setOptions: React.Dispatch<React.SetStateAction<Airport[]>>
  ) => {
    setForm((prev) => ({ ...prev, [field]: option.PlaceId }));
    setQuery(option.Name);
    setOptions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.placeIdFrom || !form.placeIdTo || !form.departDate) return;
    setParams(form);
    navigate("/results");
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="autocomplete">
          <label htmlFor="origin">Origin</label>
          <input
            id="origin"
            value={originQuery}
            onChange={(e) => handleQuery(e.target.value, setOriginQuery, setOriginOptions)}
            placeholder="Enter city or airport"
            autoComplete="off"
            required
          />
          {originOptions.length > 0 && (
            <ul className="options-list">
              {originOptions.map((opt) => (
                <li
                  key={opt.PlaceId}
                  onClick={() => handleSelect(opt, "placeIdFrom", setOriginQuery, setOriginOptions)}
                  style={{ cursor: "pointer" }}
                >
                  {opt.Name} ({opt.PlaceId})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="autocomplete">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            value={destQuery}
            onChange={(e) => handleQuery(e.target.value, setDestQuery, setDestOptions)}
            placeholder="Enter city or airport"
            autoComplete="off"
            required
          />
          {destOptions.length > 0 && (
            <ul className="options-list">
              {destOptions.map((opt) => (
                <li
                  key={opt.PlaceId}
                  onClick={() => handleSelect(opt, "placeIdTo", setDestQuery, setDestOptions)}
                  style={{ cursor: "pointer" }}
                >
                  {opt.Name} ({opt.PlaceId})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Depart</label>
          <input
            type="date"
            required
            value={form.departDate}
            onChange={(e) => setForm((prev) => ({ ...prev, departDate: e.target.value }))}
          />
        </div>

        <div>
          <label>Return</label>
          <input
            type="date"
            value={form.returnDate}
            onChange={(e) => setForm((prev) => ({ ...prev, returnDate: e.target.value }))}
          />
        </div>

        <div>
          <label>Passengers</label>
          <input
            type="number"
            min={1}
            value={form.passengers}
            onChange={(e) => setForm((prev) => ({ ...prev, passengers: +e.target.value }))}
          />
        </div>

        <button type="submit">Search Flights</button>
      </form>
    </div>
  );
};

export default SearchPage;
