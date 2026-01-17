import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useVisitorCount } from "../../hooks/useAnalytics";
import { useSessionTracker } from "../../hooks/useSessionTracker";

export const VisitorCounter: React.FC = () => {
  const location = useLocation();
  const { data, loading } = useVisitorCount(location.pathname);
  const sessionStats = useSessionTracker();
  const [_count, setCount] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState<number>(0);

  useEffect(() => {
    if (data && data.totalCount > 0) {
      setCount(data.totalCount);
      
      // Animate count up
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = data.totalCount / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= data.totalCount) {
          setDisplayCount(data.totalCount);
          clearInterval(timer);
        } else {
          setDisplayCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [data]);

  if (loading || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center gap-3"
      >
        <Eye className="text-accent-primary animate-pulse" size={20} />
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary font-mono">...</p>
          <p className="text-xs text-text-secondary">Total Visits</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
    >
      {/* Global Total Visits */}
      <div className="flex items-center gap-2">
        <Eye className="text-accent-primary" size={20} />
        <div className="text-center">
          <motion.p
            className="text-2xl font-bold text-text-primary font-mono"
            key={displayCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {displayCount.toLocaleString()}
          </motion.p>
          <p className="text-xs text-text-secondary">Total Visits</p>
        </div>
      </div>

      {/* Your Session Stats */}
      {sessionStats.uniquePagesVisited > 0 && (
        <>
          <div className="w-px h-8 bg-bg-tertiary hidden sm:block" />

          <div className="flex items-center gap-2">
            <User className="text-neon-purple" size={20} />
            <div className="text-center">
              <motion.p
                className="text-2xl font-bold text-text-primary font-mono"
                key={sessionStats.uniquePagesVisited}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {sessionStats.uniquePagesVisited}
              </motion.p>
              <p className="text-xs text-text-secondary">Your Pages</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
