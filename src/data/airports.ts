export interface Airport {
  PlaceId: string;
  Name: string;
}

export const airports: Airport[] = [
  // North America
  { PlaceId: "JFK", Name: "New York, NY (JFK)" },
  { PlaceId: "LAX", Name: "Los Angeles, CA (LAX)" },
  { PlaceId: "ORD", Name: "Chicago, IL (ORD)" },
  { PlaceId: "EWR", Name: "Newark, NJ (EWR)" },
  { PlaceId: "ATL", Name: "Atlanta, GA (ATL)" },
  { PlaceId: "DFW", Name: "Dallas/Fort Worth, TX (DFW)" },
  { PlaceId: "MIA", Name: "Miami, FL (MIA)" },
  { PlaceId: "YYZ", Name: "Toronto, Canada (YYZ)" },

  // Europe
  { PlaceId: "CDG", Name: "Paris, France (CDG)" },
  { PlaceId: "AMS", Name: "Amsterdam, Netherlands (AMS)" },
  { PlaceId: "LHR", Name: "London, UK (LHR)" },
  { PlaceId: "FRA", Name: "Frankfurt, Germany (FRA)" },
  { PlaceId: "MAD", Name: "Madrid, Spain (MAD)" },
  { PlaceId: "BCN", Name: "Barcelona, Spain (BCN)" },

  // Asia
  { PlaceId: "DXB", Name: "Dubai, UAE (DXB)" },
  { PlaceId: "NRT", Name: "Tokyo, Japan (NRT)" },
  { PlaceId: "HND", Name: "Tokyo Haneda, Japan (HND)" },
  { PlaceId: "ICN", Name: "Seoul, South Korea (ICN)" },
  { PlaceId: "SIN", Name: "Singapore, Singapore (SIN)" },

  // Australia
  { PlaceId: "SYD", Name: "Sydney, Australia (SYD)" },
  { PlaceId: "MEL", Name: "Melbourne, Australia (MEL)" },

  // Africa
  { PlaceId: "JNB", Name: "Johannesburg, South Africa (JNB)" },
  { PlaceId: "CPT", Name: "Cape Town, South Africa (CPT)" },

  // South America
  { PlaceId: "GRU", Name: "São Paulo, Brazil (GRU)" },
  { PlaceId: "EZE", Name: "Buenos Aires, Argentina (EZE)" },
];
