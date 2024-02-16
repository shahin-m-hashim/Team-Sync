import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import BreakPoint from "./components/BreakPoint";
import { ThemeProvider } from "./contexts/themeContext";
import { ToggleThemeButton } from "./components/ThemeToggler";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
      <BreakPoint />
      <ToggleThemeButton />
    </ThemeProvider>
  </React.StrictMode>,
);
