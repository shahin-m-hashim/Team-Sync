import "./globals.css";
import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import BreakPoint from "./components/BreakPoint";
import { Flip, ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      autoClose={2000}
      draggable={true}
      transition={Flip}
      theme="colored"
      style={{ width: "250px" }}
      limit={3}
    />
    <BreakPoint />
  </React.StrictMode>
);
