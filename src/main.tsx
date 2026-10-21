import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const staleMinutes: number = 5;

// Tanstack React Query
const tanstackQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: staleMinutes * 3600,
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <QueryClientProvider client={tanstackQueryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
);
