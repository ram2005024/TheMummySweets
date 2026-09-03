import CartDialog from "@/components/cart/CartDialog";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <CartDialog />
      <main className="mt-30">{children}</main>
      <Footer />
    </div>
  );
}
