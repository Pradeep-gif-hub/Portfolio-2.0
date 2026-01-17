import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SessionStats {
  pagesVisited: string[];
  startTime: number;
  pageViews: number;
}

const STORAGE_KEY = "portfolio_session_stats";

export const useSessionTracker = () => {
  const location = useLocation();
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    pagesVisited: [],
    startTime: Date.now(),
    pageViews: 0,
  });

  useEffect(() => {
    // Load existing session stats
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSessionStats(parsed);
      } catch (e) {
        // Invalid data, start fresh
        initializeSession();
      }
    } else {
      initializeSession();
    }
  }, []);

  useEffect(() => {
    // Track current page
    const currentPath = location.pathname;
    
    // Don't track admin pages
    if (currentPath.startsWith('/admin')) {
      return;
    }

    setSessionStats((prev) => {
      const updatedStats = {
        ...prev,
        pageViews: prev.pageViews + 1,
        pagesVisited: prev.pagesVisited.includes(currentPath)
          ? prev.pagesVisited
          : [...prev.pagesVisited, currentPath],
      };

      // Save to sessionStorage
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats));
      
      return updatedStats;
    });
  }, [location.pathname]);

  const initializeSession = () => {
    const initialStats: SessionStats = {
      pagesVisited: [],
      startTime: Date.now(),
      pageViews: 0,
    };
    setSessionStats(initialStats);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initialStats));
  };

  const getTimeOnSite = () => {
    const minutes = Math.floor((Date.now() - sessionStats.startTime) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
  };

  return {
    uniquePagesVisited: sessionStats.pagesVisited.length,
    totalPageViews: sessionStats.pageViews,
    timeOnSite: getTimeOnSite(),
    pagesVisited: sessionStats.pagesVisited,
  };
};
