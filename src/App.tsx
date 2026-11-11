import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import { CursorWeb } from "./components/effects/CursorWeb";
import { useAnalytics } from "./hooks/useAnalytics";
import "./styles/globals.css";

function App() {
  const location = useLocation();
  
  // Track page views (excludes admin pages automatically)
  useAnalytics({ trackPageViews: true, trackTimeOnSite: true });

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
      <CursorWeb />
    </div>
  );
}

export default App;
