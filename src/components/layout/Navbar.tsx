import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Places", href: "/places" },
  { label: "Certifications", href: "/certifications" },
  { label: "Career Innings", href: "/innings" },
  { label: "About", href: "/about" },
];

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onMenuToggle?.(newState);
  };

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-theme-bg border-b transition-colors duration-200 ${
        isScrolled ? "border-theme-border" : "border-transparent"
      }`}
    >
      <nav className="container py-4 flex items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <div className="font-semibold text-base sm:text-lg tracking-[-0.02em] text-theme-text hover:text-theme-accent transition-colors cursor-pointer whitespace-nowrap">
            {`< awasthi.tech />`}
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <span
                className={`px-1.5 lg:px-2 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(link.href)
                    ? "text-theme-accent"
                    : "text-theme-muted hover:text-theme-text"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-text"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 md:hidden z-[60] pointer-events-auto"
          />
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed top-0 left-0 bottom-0 w-[min(280px,86vw)] bg-theme-bg border-r border-theme-border md:hidden z-[70] shadow-card pointer-events-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-theme-border">
                <div className="font-semibold text-lg tracking-[-0.02em] text-theme-text">
                  {`< awasthi.tech />`}
                </div>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-theme-accent bg-theme-accent-soft"
                        : "text-theme-muted hover:text-theme-text hover:bg-theme-subtle"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
};
