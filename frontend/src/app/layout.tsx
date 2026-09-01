import { cn } from "@/lib/utils";
import AuthProvider from "@/providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import queryClient from "../libs/queryClient";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
export const metadata: Metadata = {
  title: {
    default: "The Mummy Sweets",
    template: "%s | The Mummy Sweets",
  },
  description: "Awesome product app",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <Toaster />
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
