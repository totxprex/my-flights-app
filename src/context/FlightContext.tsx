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

  const processItinerary = (body: any) => {
    const agents = body?.data?.itineraries?.agents;

    if (!agents || agents.length === 0) {
      throw new Error("No agents found");
    }

    const flights: Flight[] = agents.map((agent: any, index: number) => ({
      id: String(index),
      airline: agent.name,
      price: agent.rating * 100,
      departureTime: "2024-02-15T18:40:00",
      arrivalTime: "2024-02-16T00:20:00",
      stops: agent.isCarrier ? 0 : 1,
      duration: "6h 00m",
      bookingLink: agent.name.includes("Booking") ? "https://www.booking.com" : "#",
    }));

    return setResults(flights);
  };

  const fetchFlights = async () => {
    setLoading(true);
    setResults([]);

    const { placeIdFrom, placeIdTo, departDate, returnDate, passengers } = params;

    if (!placeIdFrom || !placeIdTo || !departDate) {
      setLoading(false);
      return;
    }

    const endpoint = returnDate ? "/web/flights/search-roundtrip" : "/web/flights/search-one-way";

    const qs = new URLSearchParams({
      placeIdFrom,
      placeIdTo,
      departDate,
      passengers: String(passengers),
      ...(returnDate ? { returnDate } : {}),
    }).toString();

    try {
      const res = await fetch(`https://${process.env.REACT_APP_RAPIDAPI_HOST}${endpoint}?${qs}`, {
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY || "",
          "X-RapidAPI-Host": process.env.REACT_APP_RAPIDAPI_HOST || "",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const body = await res.json();
      console.log("API Response:", body);

      if (body.data.itineraries) {
        processItinerary(body);
      } else {
        throw new Error("Invalid response format");
      }
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
