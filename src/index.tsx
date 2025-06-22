import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { FlightProvider } from "./context/FlightContext";
import "./styles/App.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter>
    <FlightProvider>
      <App />
    </FlightProvider>
  </BrowserRouter>
);
