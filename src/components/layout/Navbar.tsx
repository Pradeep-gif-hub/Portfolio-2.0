import React from "react";
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
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950 border-b border-accent-primary/20">
      <nav className="container py-4 flex items-center justify-between">
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-2xl bg-gradient-to-r from-accent-primary to-neon-purple bg-clip-text text-transparent cursor-pointer"
          >
            PA
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <Link key={link.href} to={link.href}>
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`text-text-secondary dark:text-dark-400 hover:text-accent-primary transition-smooth font-mono text-sm italic font-light ${
                  isActive(link.href) ? "text-accent-primary font-medium" : ""
                }`}
              >
                {link.label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-accent-primary/10 rounded-lg transition-smooth text-accent-primary"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Backdrop */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-[60] pointer-events-auto"
          />
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-dark-950 backdrop-blur-lg border-r border-accent-primary/20 md:hidden z-[70] shadow-2xl pointer-events-auto"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-accent-primary/20">
                <div className="font-display font-bold text-2xl bg-gradient-to-r from-accent-primary to-neon-purple bg-clip-text text-transparent">
                  AS
                </div>
              </div>
              
              {/* Nav Links */}
              <div className="flex flex-col gap-2 p-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-smooth font-mono text-base ${
                      isActive(link.href) ? "text-accent-primary bg-accent-primary/10 font-medium" : ""
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
