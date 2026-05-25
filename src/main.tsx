import React from "react";
import ReactDOM from "react-dom/client";
import Index from "@/pages/Index";
import { InvestmentProvider } from "@/context/InvestmentContext";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InvestmentProvider>
      <Index />
    </InvestmentProvider>
  </React.StrictMode>
);
