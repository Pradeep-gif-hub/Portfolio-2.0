import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Button } from "../ui/Button";
import { fetchProjects } from "../../utils/api";
import { fetchToolsForIcons, getTechLogo } from "../../utils/techIcons";

interface Project {
  _id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  tech: string[];
  github: string;
  live: string;
  image: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planning';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

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

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // Fetch tools for icon mapping
        await fetchToolsForIcons();
        const data = await fetchProjects();
        // Filter to only show featured projects
        const featured = Array.isArray(data) ? data.filter((p) => p.featured) : [];
        setProjects(featured);
        console.log('[HomePage Projects] Featured projects loaded:', featured.map(p => ({ title: p.title, order: (p as any).order || 'undefined' })));
      } catch (error) {
        console.error('[HomePage Projects] Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <SectionWrapper id="projects">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-10"
      >
        <h2 className="heading-2 mb-3">Featured Projects</h2>
        <p className="text-theme-muted text-base">
          A selection of projects I&apos;m proud of
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 mb-10"
      >
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-theme-surface rounded-[10px] overflow-hidden border border-theme-border shadow-card animate-pulse">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-60 md:h-[400px] bg-theme-subtle"></div>
                  <div className="md:w-3/5 p-6 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-7 bg-theme-subtle rounded w-2/3"></div>
                      <div className="h-6 bg-theme-subtle rounded-full w-20"></div>
                    </div>
                    <div className="h-4 bg-theme-subtle rounded w-full"></div>
                    <div className="h-4 bg-theme-subtle rounded w-5/6"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-theme-subtle rounded w-3/4"></div>
                      <div className="h-3 bg-theme-subtle rounded w-2/3"></div>
                      <div className="h-3 bg-theme-subtle rounded w-4/5"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-7 bg-theme-subtle rounded-full w-20"></div>
                      <div className="h-7 bg-theme-subtle rounded-full w-24"></div>
                      <div className="h-7 bg-theme-subtle rounded-full w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-theme-muted">No featured projects yet. Mark some projects as featured in the admin panel.</p>
          </div>
        ) : (
          <>
            {projects.map((project) => {
              const status = statusConfig[project.status];
              const displayFeatures = project.keyFeatures.slice(0, 4);
              const remainingFeatures = project.keyFeatures.length - 4;
              const displayTech = project.tech.slice(0, 6);
              const remainingTech = project.tech.length - 6;

              return (
                <motion.div key={project._id} variants={itemVariants}>
                  <Link to={`/project/${project._id}`}>
                <div className="group bg-theme-surface rounded-[10px] overflow-hidden border border-theme-border shadow-card card-hover relative">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section */}
                    <div className="md:w-2/5 relative overflow-hidden h-60 md:h-auto md:min-h-[380px] flex-shrink-0 border-b md:border-b-0 md:border-r border-theme-border bg-theme-subtle">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details Section */}
                    <div className="md:w-3/5 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h3 className="heading-3 group-hover:text-theme-accent transition-colors">
                            {project.title}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color} whitespace-nowrap`}
                          >
                            {status.label}
                          </span>
                        </div>

                        <p className="text-theme-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Key Features - Point wise (max 4) */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-theme-text mb-2.5 flex items-center gap-2">
                            <CheckCircle2 size={15} className="text-theme-accent" />
                            Key Features
                          </h4>
                          <ul className="space-y-1.5">
                            {displayFeatures.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-theme-muted"
                              >
                                <span className="text-theme-accent mt-0.5">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {remainingFeatures > 0 && (
                              <li className="flex items-start gap-2 text-sm text-theme-accent">
                                <span className="mt-0.5">•</span>
                                <span>+{remainingFeatures} more</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Tech Stack with Icons (max 6) */}
                        <div>
                          <h4 className="text-sm font-semibold text-theme-text mb-2.5">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {displayTech.map((tech) => (
                              <div
                                key={tech}
                                className="flex items-center gap-1.5 px-3 py-1 bg-theme-accent-soft rounded-full text-xs font-medium text-theme-accent"
                              >
                                <img src={getTechLogo(tech)} alt={tech} className="w-3.5 h-3.5 object-contain" />
                                <span>
                                  {tech}
                                </span>
                              </div>
                            ))}
                            {remainingTech > 0 && (
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-theme-accent-soft rounded-full">
                                <span className="text-xs text-theme-accent font-medium">
                                  +{remainingTech} more
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
          </>
        )}
      </motion.div>

      {/* All Projects Link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Button variant="outline" as={Link} to="/projects">
          View All Projects
          <ArrowRight size={16} className="ml-2 inline" />
        </Button>
      </motion.div>
    </SectionWrapper>
  );
};