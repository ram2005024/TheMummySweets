import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
