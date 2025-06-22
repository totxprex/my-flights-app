// src/pages/SearchPage.tsx
import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FlightContext } from "../context/FlightContext";
import "../styles/SearchPage.css";

interface AutoCompleteOption {
  PlaceId: string;
  Name: string;
}

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 500;

const SearchPage: React.FC = () => {
  const { setParams } = useContext(FlightContext);
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [originOptions, setOriginOptions] = useState<AutoCompleteOption[]>([]);
  const [destOptions, setDestOptions] = useState<AutoCompleteOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    placeIdFrom: "",
    placeIdTo: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
  });
  const navigate = useNavigate();
  const originAbort = useRef<AbortController | null>(null);
  const destAbort = useRef<AbortController | null>(null);

  // fetch autocomplete helper
  const fetchAuto = async (
    query: string,
    setOptions: React.Dispatch<React.SetStateAction<AutoCompleteOption[]>>,
    abortRef: React.MutableRefObject<AbortController | null>
  ) => {
    setError(null);
    // clear if too short
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setOptions([]);
      return;
    }

    // cancel previous
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const qs = new URLSearchParams({ query: query.trim() }).toString();

    try {
      const res = await fetch(
        `https://${process.env.REACT_APP_RAPIDAPI_HOST}/web/flights/auto-complete?${qs}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY || "",
            "X-RapidAPI-Host": process.env.REACT_APP_RAPIDAPI_HOST || "",
          },
          signal: controller.signal,
        }
      );
      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded");
        if (res.status === 403) throw new Error("Access forbidden");
        throw new Error(`HTTP ${res.status}`);
      }
      const body = await res.json();
      setOptions(body.data || []);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("Auto-complete error:", err);
      setError(err.message);
      setOptions([]);
    }
  };

  // debounced origin autocomplete
  useEffect(() => {
    const handle = setTimeout(
      () => fetchAuto(originQuery, setOriginOptions, originAbort),
      DEBOUNCE_MS
    );
    return () => clearTimeout(handle);
  }, [originQuery]);

  // debounced destination autocomplete
  useEffect(() => {
    const handle = setTimeout(() => fetchAuto(destQuery, setDestOptions, destAbort), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [destQuery]);

  const handleSelect = (option: AutoCompleteOption, field: "placeIdFrom" | "placeIdTo") => {
    setForm((prev) => ({ ...prev, [field]: option.PlaceId }));
    if (field === "placeIdFrom") setOriginQuery(option.Name);
    else setDestQuery(option.Name);
    setOriginOptions([]);
    setDestOptions([]);
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
            onChange={(e) => {
              setOriginQuery(e.target.value);
              setForm((prev) => ({ ...prev, placeIdFrom: "" }));
            }}
            placeholder="Enter city or airport"
            autoComplete="off"
          />
          {originOptions.length > 0 && (
            <ul className="options-list">
              {originOptions.map((opt) => (
                <li key={opt.PlaceId} onClick={() => handleSelect(opt, "placeIdFrom")}>
                  {opt.Name} ({opt.PlaceId})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="autocomplete">
          <label htmlFor="dest">Destination</label>
          <input
            id="dest"
            value={destQuery}
            onChange={(e) => {
              setDestQuery(e.target.value);
              setForm((prev) => ({ ...prev, placeIdTo: "" }));
            }}
            placeholder="Enter city or airport"
            autoComplete="off"
          />
          {destOptions.length > 0 && (
            <ul className="options-list">
              {destOptions.map((opt) => (
                <li key={opt.PlaceId} onClick={() => handleSelect(opt, "placeIdTo")}>
                  {opt.Name} ({opt.PlaceId})
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

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
