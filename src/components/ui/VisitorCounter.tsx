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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center gap-3"
      >
        <Eye className="text-theme-muted" size={18} />
        <div className="text-center">
          <p className="text-lg font-semibold text-theme-text font-mono">...</p>
          <p className="text-xs text-theme-muted">Total Visits</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
    >
      {/* Global Total Visits */}
      <div className="flex items-center gap-2">
        <Eye className="text-theme-accent" size={18} />
        <div className="text-left">
          <p className="text-base font-semibold text-theme-text font-mono">
            {displayCount.toLocaleString()}
          </p>
          <p className="text-xs text-theme-muted">Total Visits</p>
        </div>
      </div>

      {/* Your Session Stats */}
      {sessionStats.uniquePagesVisited > 0 && (
        <>
          <div className="w-px h-7 bg-theme-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <User className="text-theme-muted" size={18} />
            <div className="text-left">
              <p className="text-base font-semibold text-theme-text font-mono">
                {sessionStats.uniquePagesVisited}
              </p>
              <p className="text-xs text-theme-muted">Your Pages</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
