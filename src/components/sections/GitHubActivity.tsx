import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Card } from "../ui/Card";
import { siteConfig } from "../../data/siteConfig";

export const GitHubActivity: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [loading, setLoading] = useState(true);
  const username = siteConfig.githubUsername;
  const [calendarSrc] = useState(
    `https://ghchart.rshah.org/10b981/${username}`
  );
  const [contributionCount, setContributionCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch contribution count
    const fetchContributionCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (response.ok) {
          const data = await response.json();
          const total = data.total?.['last'];
          if (total) setContributionCount(total);
        }
      } catch (err) {
        // Could not fetch contribution count
      } finally {
        setLoading(false);
      }
    };
    
    fetchContributionCount();
  }, [username]);

  return (
    <SectionWrapper id="github-activity">
      {loading ? (
        <div className="animate-pulse">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-7 h-7 bg-theme-subtle rounded"></div>
              <div className="h-9 bg-theme-subtle rounded w-80"></div>
            </div>
            <div className="h-5 bg-theme-subtle rounded w-64"></div>
          </div>
          <div className="bg-theme-surface border border-theme-border rounded-[10px] p-6 shadow-card">
            <div className="bg-theme-subtle p-4 rounded-lg">
              <div className="h-32 bg-theme-border/40 rounded"></div>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="h-5 bg-theme-subtle rounded w-48"></div>
              <div className="h-5 bg-theme-subtle rounded w-32"></div>
            </div>
          </div>
        </div>
      ) : (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-3">
          <GitBranch className="text-theme-accent" size={24} />
          <h2 className="heading-2">Recent GitHub Activity</h2>
        </div>
        <p className="text-theme-muted text-base">
          My latest contributions and commits
        </p>

        {/* Contributions calendar */}
        {showCalendar && (
          <Card className="mt-8 p-6 bg-theme-surface border-theme-border">
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex flex-col">
                {/* Calendar Image - Scrollable on mobile */}
                <div className="bg-theme-subtle border border-theme-border p-4 rounded-lg overflow-x-auto scrollbar-thin">
                  <style>{`
                    .scrollbar-thin::-webkit-scrollbar {
                      height: 6px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                      background: var(--border);
                      border-radius: 4px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                      background: var(--text-muted);
                    }
                  `}</style>
                  <img
                    src={calendarSrc}
                    alt={`${username} GitHub contributions`}
                    className="github-chart-img rounded min-w-[700px] md:w-full md:min-w-0"
                    style={{ 
                      imageRendering: 'crisp-edges'
                    }}
                    onError={() => {
                      setShowCalendar(false);
                    }}
                  />
                </div>
                
                {/* Bottom section: Contribution count + Legend */}
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
                  {/* Left: Contribution count */}
                  <div className="flex items-center gap-2 text-theme-muted">
                    {contributionCount !== null ? (
                      <>
                        <span className="text-base font-semibold text-theme-text">
                          {contributionCount.toLocaleString()}
                        </span>
                        <span>contributions in the last year</span>
                      </>
                    ) : (
                      <span>View full contribution history on GitHub</span>
                    )}
                  </div>
                  
                  {/* Right: Less to More legend */}
                  <div className="flex items-center gap-2 text-theme-muted">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-theme-border"></div>
                      <div className="w-3 h-3 rounded-sm bg-theme-accent/25"></div>
                      <div className="w-3 h-3 rounded-sm bg-theme-accent/50"></div>
                      <div className="w-3 h-3 rounded-sm bg-theme-accent/75"></div>
                      <div className="w-3 h-3 rounded-sm bg-theme-accent"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </a>
          </Card>
        )}
      </motion.div>
      )}
    </SectionWrapper>
  );
};