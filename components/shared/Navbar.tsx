"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code, Menu, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming cn utility is correctly implemented
import Image from "next/image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "/projects" },
    { label: "Partners", href: "#partners" },
    { label: "Team", href: "#team" },
    { label: "Products", href: "#products" },
  ];

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      // Check if we are on the home page or a different page
      if (
        window.location.pathname === "/" ||
        window.location.pathname === "/projects"
      ) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          // Navigate to home if element isn't found (e.g., currently on /projects)
          window.location.href = `/${href}`;
        }
      } else {
        // For nested pages, navigate to home and use the hash
        window.location.href = `/${href}`;
      }
    }
  };

  // Style for the modern navigation link
  const linkClasses =
    "relative text-sm font-medium text-slate transition-colors before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-teal before:transition-transform before:duration-300 hover:text-white hover:before:scale-x-100";

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-navy/80 backdrop-blur-lg shadow-xl" // Increased blur and shadow
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* --- Logo --- */}
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
          <Image
              src="/logo.png"
              alt="Debug Technologies Logo"
              width={200}
              height={40}
              className="object-contain group-hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* --- Desktop Links --- */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.href.startsWith("#") ? (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={linkClasses}
                >
                  {item.label}
                </button>
              ) : (
                <Link key={item.href} href={item.href} className={linkClasses}>
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* --- Contact Button --- */}
          <div className="hidden md:flex">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="bg-teal text-navy hover:bg-teal-dark font-semibold transition-all shadow-md hover:shadow-lg hover:shadow-teal/30"
            >
              Start a Project
              <Plus />
            </Button>
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-teal p-2"
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      <div
        className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-navy-light/95 backdrop-blur-sm px-4 pt-4 pb-6 space-y-3">
          {navItems.map((item) =>
            item.href.startsWith("#") ? (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-teal block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors hover:bg-navy-dark"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-teal block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors hover:bg-navy-dark"
              >
                {item.label}
              </Link>
            )
          )}
          <div className="pt-4">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="w-full bg-teal text-navy hover:bg-teal-dark font-semibold"
            >
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
