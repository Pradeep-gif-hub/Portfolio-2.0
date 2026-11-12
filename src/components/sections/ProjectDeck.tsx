import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getTechLogo } from "../../utils/techIcons";

export interface DeckProject {
  _id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  tech: string[];
  image: string;
  featured?: boolean;
  status: "completed" | "in-progress" | "planning";
}

const statusConfig = {
  completed: {
    label: "Completed",
    color:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
  },
  "in-progress": {
    label: "In Progress",
    color:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
  },
  planning: {
    label: "Planning",
    color:
      "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
  },
};

const SLIDE_MS = 5600;

const poseFor = (offset: number) => {
  if (offset <= 0) {
    return "translateY(0) translateZ(0) rotateX(2deg) rotateY(-3deg) scale(1)";
  }
  if (offset === 1) {
    return "translateY(-2.85rem) translateZ(-72px) rotateX(7deg) rotateY(-5.5deg) scale(0.975)";
  }
  return "translateY(-5.4rem) translateZ(-140px) rotateX(12deg) rotateY(-8deg) scale(0.95)";
};

export const ProjectDeck: React.FC<{ projects: DeckProject[] }> = ({ projects }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = projects.length;
  const safeActive = count === 0 ? 0 : active % count;
  const previousActive = useRef(safeActive);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % count);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, safeActive]);

  const previous = previousActive.current;
  useEffect(() => {
    previousActive.current = safeActive;
  }, [safeActive]);

  if (count === 0) return null;

  const step = (delta: number) => {
    setActive((current) => (current + delta + count) % count);
  };

  return (
    <div
      className="project-deck"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="project-deck-stage" aria-roledescription="carousel" aria-label="Projects">
        {projects.map((project, index) => {
          const offset = (index - safeActive + count) % count;
          const previousOffset = (index - previous + count) % count;
          const hidden = offset > 2;
          const jumped = previousOffset <= 2 && offset > 2;
          const status = statusConfig[project.status] ?? statusConfig.planning;
          const features = (project.keyFeatures ?? []).slice(0, 3);
          const extraFeatures = (project.keyFeatures ?? []).length - features.length;
          const tech = (project.tech ?? []).slice(0, 5);
          const extraTech = (project.tech ?? []).length - tech.length;
          const accent = project.featured ? "card-accent-featured" : "card-accent-hover";

          const slide = (
            <div className={`surface-card ${accent} h-full`}>
              <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-theme-border bg-theme-subtle">
                <p className="text-sm font-medium text-theme-text truncate">{project.title}</p>
                <span className={`px-2.5 py-0.5 rounded-[999px] text-xs font-medium border ${status.color} whitespace-nowrap`}>
                  {status.label}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-5 md:gap-8 p-5 md:p-7">
                <div className="md:w-2/5 relative overflow-hidden h-52 md:h-64 flex-shrink-0 rounded-lg border border-theme-border-strong bg-theme-subtle">
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="md:w-3/5">
                  <h3 className="heading-3 mb-3">{project.title}</h3>
                  <p className="text-theme-muted text-sm mb-5 line-clamp-2 leading-[1.7]">{project.description}</p>
                  {features.length > 0 && (
                    <ul className="space-y-2 mb-5">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-theme-muted">
                          <CheckCircle2 size={15} className="text-theme-accent mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {extraFeatures > 0 && (
                        <li className="text-sm text-theme-accent">+{extraFeatures} more</li>
                      )}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-x-2 gap-y-2">
                    {tech.map((item) => (
                      <span
                        key={item}
                        className="flex items-center gap-1.5 px-3 py-1 bg-theme-accent-soft border border-theme-border-strong rounded-[999px] text-xs font-medium text-theme-accent"
                      >
                        <img src={getTechLogo(item)} alt="" className="w-3.5 h-3.5 object-contain" />
                        {item}
                      </span>
                    ))}
                    {extraTech > 0 && (
                      <span className="px-3 py-1 text-xs font-medium text-theme-accent">+{extraTech} more</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <article
              key={project._id}
              className="project-deck-card"
              aria-hidden={offset !== 0}
              style={{
                transform: poseFor(hidden ? 2 : offset),
                opacity: hidden ? 0 : 1,
                zIndex: hidden ? 0 : 12 - offset,
                pointerEvents: hidden ? "none" : "auto",
                transition: jumped
                  ? "none"
                  : "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease",
              }}
            >
              {offset === 0 ? (
                <Link to={`/project/${project._id}`} className="block h-full" aria-label={project.title}>
                  {slide}
                </Link>
              ) : (
                <button
                  type="button"
                  className="block w-full h-full text-left bg-transparent border-0 p-0 cursor-pointer"
                  onClick={() => setActive(index)}
                  tabIndex={hidden ? -1 : 0}
                  aria-label={`Show ${project.title}`}
                >
                  {slide}
                </button>
              )}
            </article>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" className="project-deck-nav" onClick={() => step(-1)} aria-label="Previous project">
            <ChevronLeft size={18} />
          </button>
          <p className="min-w-[4.5rem] text-center text-sm tabular-nums text-theme-muted">
            {String(safeActive + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </p>
          <button type="button" className="project-deck-nav" onClick={() => step(1)} aria-label="Next project">
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
