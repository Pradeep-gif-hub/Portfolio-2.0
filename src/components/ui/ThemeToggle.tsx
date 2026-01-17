import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full bg-bg-secondary dark:bg-dark-700 border border-accent-primary/30 hover:border-accent-primary/60 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/20"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Moon
            size={20}
            className="text-accent-primary"
            strokeWidth={1.5}
          />
        ) : (
          <Sun
            size={20}
            className="text-accent-primary"
            strokeWidth={1.5}
          />
        )}
      </motion.div>
    </motion.button>
  );
};
