import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-8">
      {items.map((item, index) => (
        <motion.div
          key={`${item.path}-${index}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          {index > 0 && (
            <ChevronRight size={16} className="mx-2 text-text-secondary dark:text-dark-500" />
          )}
          {index === items.length - 1 ? (
            <span className="text-text-primary dark:text-dark-100 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-text-secondary dark:text-dark-400 hover:text-accent-primary dark:hover:text-accent-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </motion.div>
      ))}
    </nav>
  );
};
