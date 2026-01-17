import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Card } from "../ui/Card";
import { siteConfig } from "../../data/siteConfig";

export const GitHubActivity: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const username = siteConfig.githubUsername;
  const [calendarSrc] = useState(
    `https://ghchart.rshah.org/10b981/${username}`
  );
  const [contributionCount, setContributionCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch contribution count
    const fetchContributionCount = async () => {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (response.ok) {
          const data = await response.json();
          const total = data.total?.['last'];
          if (total) setContributionCount(total);
        }
      } catch (err) {
        // Could not fetch contribution count
      }
    };
    
    fetchContributionCount();
  }, [username]);

  return (
    <SectionWrapper id="github-activity">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="text-green-400" size={28} />
          <h2 className="heading-2">Recent GitHub Activity</h2>
        </div>
        <p className="text-text-secondary text-lg">
          My latest contributions and commits
        </p>

        {/* Contributions calendar with dark theme styling */}
        {showCalendar && (
          <Card className="mt-8 p-6 bg-dark-900 backdrop-blur-sm border-dark-700">
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex flex-col">
                {/* Calendar Image - Scrollable on mobile */}
                <div className="bg-dark-950 p-4 rounded-lg overflow-x-auto scrollbar-thin scrollbar-thumb-green-400/50 scrollbar-track-dark-800/30 hover:scrollbar-thumb-green-400/70">
                  <style>{`
                    .scrollbar-thin::-webkit-scrollbar {
                      height: 8px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                      background: rgba(30, 30, 30, 0.3);
                      border-radius: 4px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                      background: rgba(74, 222, 128, 0.5);
                      border-radius: 4px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                      background: rgba(74, 222, 128, 0.7);
                      box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
                    }
                  `}</style>
                  <img
                    src={calendarSrc}
                    alt={`${username} GitHub contributions`}
                    className="rounded min-w-[700px] md:w-full md:min-w-0"
                    style={{ 
                      filter: 'brightness(0.9) contrast(1.2) invert(0.95) hue-rotate(180deg)',
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
                  <div className="flex items-center gap-2 text-text-secondary">
                    {contributionCount !== null ? (
                      <>
                        <span className="text-lg font-bold text-white">
                          {contributionCount.toLocaleString()}
                        </span>
                        <span>contributions in the last year</span>
                      </>
                    ) : (
                      <span>View full contribution history on GitHub</span>
                    )}
                  </div>
                  
                  {/* Right: Less to More legend */}
                  <div className="flex items-center gap-2 text-text-secondary">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-dark-800"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-400/30"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-400/60"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-400/80"></div>
                      <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </a>
          </Card>
        )}
      </motion.div>

      {/* Commits section hidden - keeping only the calendar */}
    </SectionWrapper>
  );
};
