import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import SmoothFollower from "./components/ui/SmoothFollower";
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
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      <SmoothFollower />
      <ScrollProgress />
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
