import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full bg-theme-surface border border-theme-border-strong hover:border-theme-accent/70 flex items-center justify-center transition-colors shadow-card"
      whileTap={{ scale: 0.96 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {theme === "dark" ? (
          <Moon
            size={18}
            className="text-theme-accent"
            strokeWidth={1.5}
          />
        ) : (
          <Sun
            size={18}
            className="text-theme-accent"
            strokeWidth={1.5}
          />
        )}
      </motion.div>
    </motion.button>
  );
};
