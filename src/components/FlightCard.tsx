import React from "react";
import { Flight } from "../context/FlightContext";
import "../styles/FlightCard.css";

const FlightCard: React.FC<{ flight: Flight }> = ({ flight }) => (
  <div className="flight-card">
    <div className="times">
      <span>{flight.departureTime}</span> → <span>{flight.arrivalTime}</span>
    </div>
    <div className="details">
      <span>{flight.airline}</span>
      <span>
        {flight.duration} • {flight.stops} stop{flight.stops !== 1 && "s"}
      </span>
    </div>
    <div className="price">
      <strong>${flight.price.toFixed(2)}</strong>
      <a href={flight.bookingLink} target="_blank" rel="noopener noreferrer">
        Book
      </a>
    </div>
  </div>
);

export default FlightCard;
