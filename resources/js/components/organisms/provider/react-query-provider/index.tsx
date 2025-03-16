import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

interface IReactQueryProviderProps {
    children: React.ReactNode;
}

export const queryClient = new QueryClient();

const ReactQueryProvider: React.FC<IReactQueryProviderProps> = ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
