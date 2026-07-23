import {Toaster} from "react-hot-toast"
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../libs/queryClient";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

      <html lang="en" className={cn("font-sans", geist.variable)}>
        <body className="min-h-full flex flex-col">
          <Toaster/>
      <NavBar />
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    <Footer/>
        </body>
      </html>
  );
}
