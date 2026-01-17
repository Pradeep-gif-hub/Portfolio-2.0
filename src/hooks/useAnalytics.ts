import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface AnalyticsConfig {
  trackPageViews?: boolean;
  trackTimeOnSite?: boolean;
}

export const useAnalytics = (config: AnalyticsConfig = {}) => {
  const { trackPageViews = true } = config;
  const location = useLocation();
  const trackedRef = useRef<Set<string>>(new Set());

  // Track page views
  useEffect(() => {
    if (trackPageViews) {
      const currentPath = location.pathname;
      
      // Don't track admin pages
      if (currentPath.startsWith('/admin')) {
        return;
      }

      // Only track once per session for each unique path
      if (trackedRef.current.has(currentPath)) {
        return;
      }

      // Track visitor count
      fetch('/api/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath }),
      })
        .then(() => {
          trackedRef.current.add(currentPath);
        })
        .catch(() => {
          // Could not track visitor count
        });
    }
  }, [trackPageViews, location.pathname]);

  // Track scroll depth
  useEffect(() => {
    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrolled = window.scrollY;

      const scrollPercent = Math.round(
        ((scrolled + windowHeight) / documentHeight) * 100
      );

      if (scrollPercent >= 75) {
        sessionStorage.setItem("scrolledDeep", "true");
      }
    };

    window.addEventListener("scroll", trackScroll);
    return () => window.removeEventListener("scroll", trackScroll);
  }, []);
};

// Hook to get visitor count
export const useVisitorCount = (refreshTrigger?: any) => {
  const [data, setData] = React.useState<{ totalCount: number; pages: any[] } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/visitor')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [refreshTrigger]);

  return { data, loading };
};
