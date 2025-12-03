import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AppQueryProvider } from "./lib/react-query";
import { PreferencesProvider } from "./features/preferences/PreferencesContext";
import { initI18n } from "./i18n/config";

// i18n 초기화
initI18n();

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
