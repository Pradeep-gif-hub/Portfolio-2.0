import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { fetchProjects } from "../utils/api";
import { fetchToolsForIcons, getTechLogo } from "../utils/techIcons";

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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const statusConfig = {
  completed: { label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  "in-progress": { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  planning: { label: "Planning", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // Fetch tools for icon mapping
        await fetchToolsForIcons();
        const data = await fetchProjects();
        setProjects(data);
      } catch (error) {
        // Failed to fetch projects
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Projects", path: "/projects" }]} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-1 mb-4">All Projects</h1>
          <p className="text-text-secondary text-lg">
            Explore all my projects and the technologies I've worked with
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading projects...</p>
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
                  <div className="group bg-gradient-to-b from-dark-800/90 via-dark-800/60 to-black rounded-2xl overflow-hidden border border-accent-primary/30 hover:border-accent-primary/60 transition-all hover:shadow-xl hover:shadow-accent-primary/20 relative">
                    <div className="flex flex-col md:flex-row">
                      {/* Image Section */}
                      <div className="md:w-2/5 relative overflow-hidden h-64 md:h-[450px] flex-shrink-0">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/50" />
                        {/* Bottom blackish gradient overlay on image */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      </div>

                      {/* Details Section */}
                      <div className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="heading-3 group-hover:text-accent-primary transition-colors">
                              {project.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color} whitespace-nowrap`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <p className="text-text-secondary mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Key Features - Point wise (max 4) */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                              <CheckCircle2 size={16} className="text-accent-primary" />
                              Key Features
                            </h4>
                            <ul className="space-y-2">
                              {displayFeatures.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-gray-300"
                                >
                                  <span className="text-accent-primary mt-0.5">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                              {remainingFeatures > 0 && (
                                <li className="flex items-start gap-2 text-sm text-accent-primary/70">
                                  <span className="mt-0.5">•</span>
                                  <span>+{remainingFeatures} more</span>
                                </li>
                              )}
                            </ul>
                          </div>

                          {/* Tech Stack with Icons (max 6) */}
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">
                              Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {displayTech.map((tech) => (
                                <div
                                  key={tech}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm rounded-xl border border-accent-primary/20 hover:border-accent-primary/40 transition-all group/tech"
                                >
                                  <img src={getTechLogo(tech)} alt={tech} className="w-4 h-4 object-contain group-hover/tech:scale-110 transition-transform" />
                                  <span className="text-xs text-gray-300">
                                    {tech}
                                  </span>
                                </div>
                              ))}
                              {remainingTech > 0 && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-primary/10 backdrop-blur-sm rounded-xl border border-accent-primary/30">
                                  <span className="text-xs text-accent-primary font-medium">
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
      </SectionWrapper>
    </div>
  );
};
