import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./context/adminContext.jsx";
import { DetailsProvider } from "./context/detailsContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DetailsProvider>
        <AdminProvider>
          <App />
        </AdminProvider>
      </DetailsProvider>
    </BrowserRouter>
  </StrictMode>
);
