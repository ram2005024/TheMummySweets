import { cn } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import queryClient from "../libs/queryClient";
import AuthProvider from "../providers/AuthProvider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NavBar />
            {children}
          </AuthProvider>
        </QueryClientProvider>
        <Footer />
      </body>
    </html>
  );
}
