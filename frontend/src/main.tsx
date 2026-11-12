import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { LearningStateProvider } from "./lib/learning-state";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LearningStateProvider>
          <App />
        </LearningStateProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
