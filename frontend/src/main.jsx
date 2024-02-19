import "./globals.css";
import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import BreakPoint from "./components/BreakPoint";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <BreakPoint />
  </React.StrictMode>
);
