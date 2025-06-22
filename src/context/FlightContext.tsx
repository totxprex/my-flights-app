// src/context/FlightContext.tsx
import React, { createContext, useState, ReactNode } from "react";

export interface Flight {
  id: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  stops: number;
  duration: string;
  bookingLink: string;
}

interface SearchParams {
  placeIdFrom: string;
  placeIdTo: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
}

interface FlightContextType {
  params: SearchParams;
  results: Flight[];
  loading: boolean;
  setParams: (p: SearchParams) => void;
  fetchFlights: () => Promise<void>;
}

export const FlightContext = createContext<FlightContextType>({} as FlightContextType);

export const FlightProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<SearchParams>({
    placeIdFrom: "",
    placeIdTo: "",
    departDate: "",
    returnDate: "",
    passengers: 1,
  });
  const [results, setResults] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);

  const pollIncomplete = async (sessionId: string) => {
    const url = `https://${process.env.REACT_APP_RAPIDAPI_HOST}/web/flights/search-incomplete?sessionId=${sessionId}`;
    while (true) {
      const resp = await fetch(url, {
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": process.env.REACT_APP_RAPIDAPI_HOST || "",
        },
      });
      const body = await resp.json();
      if (body.data.context.status === "complete") {
        return body.data.itineraries.results;
      }
      // wait 1s before retry
      await new Promise((res) => setTimeout(res, 1000));
    }
  };

  const fetchFlights = async () => {
    setLoading(true);
    setResults([]);

    const { placeIdFrom, placeIdTo, departDate, returnDate, passengers } = params;

    // guard required
    if (!placeIdFrom || !placeIdTo || !departDate) {
      setLoading(false);
      return;
    }

    // choose endpoint
    const endpoint = returnDate ? "/web/flights/search-roundtrip" : "/web/flights/search-one-way";

    // build query string
    const qs = new URLSearchParams({
      placeIdFrom,
      placeIdTo,
      departDate,
      passengers: String(passengers),
      ...(returnDate ? { returnDate } : {}),
    }).toString();

    try {
      // initial search
      const res = await fetch(`https://${process.env.REACT_APP_RAPIDAPI_HOST}${endpoint}?${qs}`, {
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": process.env.REACT_APP_RAPIDAPI_HOST || "",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.json();
      let itineraries = body.data.itineraries.results;

      console.log(body);

      // if incomplete, poll until complete
      if (body.data.context.status === "incomplete") {
        const sessionId = body.data.context.sessionId;
        itineraries = await pollIncomplete(sessionId);
      }

      // map to Flight[]
      const flights: Flight[] = itineraries.map((it: any, i: number) => ({
        id: String(i),
        airline: it.legs[0].segments[0].airlineName,
        price: it.price.total,
        departureTime: it.legs[0].departureTime,
        arrivalTime: it.legs[it.legs.length - 1].arrivalTime,
        stops: it.legs[0].stops.length,
        duration: it.legs[0].duration,
        bookingLink: it.bookingLink || "#",
      }));

      setResults(flights);
    } catch (err) {
      console.error("Fetch error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlightContext.Provider value={{ params, results, loading, setParams, fetchFlights }}>
      {children}
    </FlightContext.Provider>
  );
};
