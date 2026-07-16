import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import queryClient from "./libs/queryClient";
import AuthSynchronizer from "@/providers/AuthSynchronizer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-full flex flex-col">
          <QueryClientProvider client={queryClient}>
            <AuthSynchronizer>{children}</AuthSynchronizer>
          </QueryClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
