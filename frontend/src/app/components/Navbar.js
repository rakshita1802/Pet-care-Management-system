"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Owners", href: "/owners" },
    { name: "Pets", href: "/pets" },
    { name: "Appointments", href: "/appointments" },
    { name: "Vaccinations", href: "/vaccinations" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#f6f4ef]/80 backdrop-blur border-b border-yellow-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-3xl transition-transform group-hover:rotate-6">
            🐾
          </div>
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-gray-900">
              Happy Paws
            </p>
            <p className="text-xs text-gray-600">
              Pet Care Center
            </p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-yellow-200 text-gray-900 shadow-sm"
                      : "text-gray-600 hover:bg-yellow-100 hover:text-gray-900"
                  }
                `}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
