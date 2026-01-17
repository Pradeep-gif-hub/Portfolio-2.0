import React from "react";
import { motion } from "framer-motion";
import { VisitorCounter } from "../ui/VisitorCounter";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-bg-tertiary">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Visitor Counter - Left Side */}
          <div className="order-2 md:order-1">
            <VisitorCounter />
          </div>

          {/* Copyright - Right Side */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-text-secondary text-sm text-center md:text-right order-1 md:order-2"
          >
            © {currentYear} Pradeep Awasthi. All rights reserved.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};
