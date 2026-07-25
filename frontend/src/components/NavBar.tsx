"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Search, ShoppingCart, User, Phone, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../hooks/auth/useUser";
import UserIcon from "./Nav/UserIcon";
import { useLogout } from "../hooks/auth/useLogout";
import { authStore } from "../store/auth";

export default function NavBar() {
  const router = useRouter();
  const logoutMutation=useLogout()
  const [open, setOpen] = useState(false);
  const {data:user}=useUser()
  console.log({
  access: authStore.getState().access,
  user,
  status,
});
  const path = usePathname();
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },

    { name: "Contact", href: "/contact" },
  ];
  return (
    <header className="sticky top-0 z-100 border-b border-gray-200 bg-slate-100 backdrop-blur-lg shadow-xs">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold text-orange-600">The Mummy</h2>
            <p className="text-xs text-gray-500">Sweets & Restaurant</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative font-medium text-gray-700 transition  ${path === item.href ? "text-orange-500 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all hover:after:w-full" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-4 py-2">
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search sweets..."
              className="bg-transparent  text-sm outline-none placeholder:text-gray-700"
            />
          </div>

          <button className="relative rounded-full bg-gray-50 border border-gray-100 p-3 transition hover:bg-orange-50">
            <ShoppingCart size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              2
            </span>
          </button>
          {
            user ? (
              <div className="relative">
                <UserIcon/>
              </div>
            ):(
               <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
            >
              <User size={18} />
              Login
            </button>
            )
          }
        </div>

        {/* Mobile Button */}
        <div

        >
          {open ? <X size={28} onClick={()=>setOpen(!open)} /> :
          <div className="flex gap-2 items-center lg:hidden">
          <div className="relative">
                <UserIcon/>
              </div>
                <button className="relative rounded-full bg-gray-50 border border-gray-100 p-3 transition hover:bg-orange-50">
            <ShoppingCart size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
              2
            </span>
          </button>
          <div  onClick={() => setOpen(!open)}
          className="rounded-full p-2 transition hover:bg-orange-100 ">
          <Menu size={28} />
          </div>
          </div>
          }
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.25 }}
            className="border-t bg-white lg:hidden"
          >
            <div className="space-y-5 p-6">
              {/* Search */}

              <div className="flex items-center gap-3 rounded-full border bg-gray-50 px-4 py-3">
                <Search size={18} />

                <input
                  placeholder="Search..."
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* Links */}

              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-lg font-medium text-gray-700 transition hover:text-orange-500"
                >
                  {item.name}
                </Link>
              ))}

              <hr />



              <a
                href="tel:+9779800000000"
                className="flex items-center justify-center gap-3 rounded-xl border py-3 font-medium hover:bg-orange-50"
              >
                <Phone size={18} />
                Call Us
              </a>
          {user ? (
      <button
      disabled={logoutMutation.isPending}
      onClick={()=>logoutMutation.mutate()}
     className="flex w-full items-center justify-center gap-3
               rounded-xl bg-red-500 cursor-pointer py-3 px-4 font-semibold text-white
               shadow-md transition-all duration-200
               hover:bg-orange-600 hover:shadow-lg active:scale-95"
  >
    <LogOut size={20} />
    {logoutMutation.isPending ? "Logging out...":"Logout"}
  </button>
) : (
  <button
  onClick={()=>router.push("/login")}
    className="flex w-full items-center justify-center gap-3
               rounded-xl bg-orange-500 py-3 px-4 font-semibold text-white
               shadow-md transition-all duration-200
               hover:bg-orange-600 hover:shadow-lg active:scale-95"
  >
    <User size={20} />
    Login
  </button>
)}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
