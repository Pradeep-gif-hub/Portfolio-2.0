import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useVisitorCount } from "../../hooks/useAnalytics";

export const VisitorStats: React.FC = () => {
  const { data, loading } = useVisitorCount();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-text-tertiary text-sm"
      >
        <Eye size={16} className="animate-pulse" />
        <span>Loading...</span>
      </motion.div>
    );
  }

  if (!data || data.totalCount === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-text-tertiary text-sm"
    >
      <Eye size={16} className="text-accent-primary" />
      <span>
        <span className="text-accent-primary font-semibold">{data.totalCount.toLocaleString()}</span>
        {' '}
        {data.totalCount === 1 ? 'visit' : 'visits'}
      </span>
    </motion.div>
  );
};
