import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ResultsPage from "./pages/ResultsPage";

const App: React.FC = () => (
  <div className="app">
    <header className="app-header">
      <Link to="/">
        <h1>Spotter Flights</h1>
      </Link>
    </header>
    <main>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </main>
  </div>
);

export default App;
