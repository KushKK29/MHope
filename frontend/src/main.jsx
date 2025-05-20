import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./context/adminContext.jsx";
import { DetailsProvider } from "./context/detailsContext.jsx";
import { DoctorProvider } from "./context/doctorContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DetailsProvider>
        <AdminProvider>
          <DoctorProvider>
            <App />
          </DoctorProvider>
        </AdminProvider>
      </DetailsProvider>
    </BrowserRouter>
  </StrictMode>
);
