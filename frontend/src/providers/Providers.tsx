import { BfcacheRefresher } from "@/components/bf-cache-refresher";
import AuthProvider from "@/providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../libs/queryClient";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BfcacheRefresher />
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
}
