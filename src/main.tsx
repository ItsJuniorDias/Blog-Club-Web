import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { Routes, Route } from "react-router";

import Home from "./screens/home/index";
import Redirect from "./screens/redirect-app/index";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/redirect" element={<Redirect />} />
      </Routes>
    </StrictMode>
  </QueryClientProvider>
);
