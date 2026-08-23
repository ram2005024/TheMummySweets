import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBarLowerSection = () => {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Orders", href: "/orders" },
    { name: "Wishlist", href: "/wishlist" },
    { name: "Mummy AI", href: "/mummy-ai" },
  ];

  return (
    <div className="w-full flex items-center gap-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`relative px-2 py-1 text-sm font-medium transition-colors ${
              isActive ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {link.name}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-0.5 mx-auto h-0.5 w-full bg-orange-600 rounded-full"></span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default NavBarLowerSection;
