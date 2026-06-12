"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        isScrolled
          ? "border-border bg-bg/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6"
      >
        <a href="#" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="grid size-9 place-items-center rounded-full border border-border-light bg-bg-elevated text-sm font-semibold text-text">
            RP
          </span>
          <span className="text-sm font-semibold text-text sm:text-base">
            Rama Putra
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-muted transition-colors hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </div>
          <Button
            href="/cv.pdf"
            download
            variant="outline"
            icon={<Download size={16} />}
          >
            Download CV
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-border-light text-text transition-colors hover:bg-bg-hover md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t border-border bg-bg/95 px-6 py-5 shadow-lg backdrop-blur-md transition-[opacity,transform] duration-200 md:hidden",
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-hover hover:text-text"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <Button
            href="/cv.pdf"
            download
            variant="outline"
            icon={<Download size={16} />}
            className="justify-center"
            onClick={closeMenu}
          >
            Download CV
          </Button>
        </div>
      </div>
    </header>
  );
}
