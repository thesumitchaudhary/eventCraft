import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import App from "./App.tsx";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

import { ContextProvider } from "./context/Context";
import { EventProvider } from "./context/EventContext";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <ContextProvider>
        <EventProvider>
          <BrowserRouter>
            <QueryClientProvider client={client}>
              <App />
              {/* <ReactQueryDevtools /> */}
            </QueryClientProvider>
          </BrowserRouter>
        </EventProvider>
      </ContextProvider>
    </MantineProvider>
  </StrictMode>,
);
