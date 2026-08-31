import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthProvider from "@/providers/AuthProvider";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <AuthProvider>
        <NavBar />
        {children}
      </AuthProvider>
      <Footer />
    </div>
  );
}
