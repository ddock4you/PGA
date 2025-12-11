import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AppQueryProvider } from "./lib/react-query";
import { PreferencesProvider } from "./features/preferences/PreferencesContext";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppQueryProvider>
      <PreferencesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PreferencesProvider>
    </AppQueryProvider>
  </StrictMode>
);
