import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Card } from "../ui/Card";
import { siteConfig } from "../../data/siteConfig";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const CELL_PITCH_PX = 15; // 12px cell + 3px gap

function buildHeatmapColumns(contributions: ContributionDay[]) {
  if (contributions.length === 0) {
    return { cells: [] as (ContributionDay | null)[], monthLabels: [] as { weekIndex: number; label: string }[], weekCount: 0 };
  }

  const parseUtcDate = (isoDate: string) => {
    const [y, m, d] = isoDate.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  };

  const firstDayOfWeek = parseUtcDate(contributions[0].date).getUTCDay();
  const weeks: (ContributionDay | null)[][] = [];
  let currentWeek: (ContributionDay | null)[] = Array(firstDayOfWeek).fill(null);

  for (const item of contributions) {
    const level = Math.min(4, Math.max(0, Number(item.level) || 0)) as 0 | 1 | 2 | 3 | 4;
    currentWeek.push({ ...item, level });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth: number | null = null;
  let lastLabelWeek = -10;

  weeks.forEach((week, weekIndex) => {
    const firstNonNull = week.find((d) => d !== null);
    if (!firstNonNull) return;
    const month = parseUtcDate(firstNonNull.date).getUTCMonth();
    const isMonthChange = month !== lastMonth;
    const hasEnoughRoomBeforeEnd = weekIndex <= weeks.length - 3;
    if (isMonthChange && (weekIndex === 0 || (weekIndex - lastLabelWeek >= 3 && hasEnoughRoomBeforeEnd))) {
      monthLabels.push({ weekIndex, label: MONTH_NAMES[month] });
      lastLabelWeek = weekIndex;
    }
    lastMonth = month;
  });

  return {
    cells: weeks.flat(),
    monthLabels,
    weekCount: weeks.length,
  };
}

export const GitHubActivity: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(true);
  const [loading, setLoading] = useState(true);
  const username = siteConfig.githubUsername;
  const [calendarSrc] = useState(
    `https://ghchart.rshah.org/10b981/${username}`
  );
  const [contributionCount, setContributionCount] = useState<number | null>(null);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);

  useEffect(() => {
    // Fetch contribution count and daily grid data
    const fetchContributionCount = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`);
        if (response.ok) {
          const data = await response.json();
          const total = data.total?.['last'];
          if (total) setContributionCount(total);
          if (Array.isArray(data.contributions)) {
            setContributions(data.contributions);
          }
        }
      } catch {
        // Could not fetch contribution count
      } finally {
        setLoading(false);
      }
    };
    
    fetchContributionCount();
  }, [username]);

  const { cells, monthLabels, weekCount } = useMemo(
    () => buildHeatmapColumns(contributions),
    [contributions]
  );

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
          <div className="surface-card p-6">
            <div className="bg-theme-subtle border border-theme-border-strong/65 p-4 rounded-lg">
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
          <Card className="mt-8 p-6">
            <a 
              href={`https://github.com/${username}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <div className="flex flex-col">
                {/* Calendar Image - Scrollable on mobile */}
                <div className="bg-theme-subtle border border-theme-border-strong/65 p-4 rounded-lg overflow-x-auto scrollbar-thin">
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
                  {cells.length > 0 ? (
                    <div className="gh-heatmap-grid" role="img" aria-label={`${username} GitHub contributions heatmap`}>
                      <div className="gh-weekdays" aria-hidden="true">
                        <span></span>
                        <span>Mon</span>
                        <span></span>
                        <span>Wed</span>
                        <span></span>
                        <span>Fri</span>
                        <span></span>
                      </div>
                      <div>
                        <div
                          className="gh-months-row"
                          style={{ width: `${Math.max(0, weekCount * CELL_PITCH_PX - 3)}px` }}
                          aria-hidden="true"
                        >
                          {monthLabels.map((m) => (
                            <span
                              key={`${m.label}-${m.weekIndex}`}
                              className="gh-month-label"
                              style={{ left: `${m.weekIndex * CELL_PITCH_PX}px` }}
                            >
                              {m.label}
                            </span>
                          ))}
                        </div>
                        <div className="gh-weeks-grid">
                          {cells.map((day, index) =>
                            day ? (
                              <div
                                key={day.date}
                                className={`gh-cell gh-cell-interactive gh-level-${day.level}`}
                                title={`${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${day.date}`}
                                aria-label={`${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${day.date}`}
                              />
                            ) : (
                              <div key={`spacer-${index}`} className="gh-cell-spacer" aria-hidden="true" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}
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
                    <div className="flex items-center gap-[3px]">
                      {[0, 1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`gh-cell gh-level-${level}`}
                          aria-hidden="true"
                        />
                      ))}
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