import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const logError = (error: Error) => {
    console.log(error)
};
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={new QueryClient()}>
            <ErrorBoundary onError={logError} fallback={<div>Something went wrong</div>}>
                <App />
            </ErrorBoundary>
        </QueryClientProvider>
    </React.StrictMode>,
);
