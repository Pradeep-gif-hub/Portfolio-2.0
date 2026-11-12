import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { fetchProjects } from "../utils/api";
import { fetchToolsForIcons, getTechLogo } from "../utils/techIcons";
import {
  PROJECT_ROTATE_X,
  PROJECT_ROTATE_Y,
  captureProjectImage,
  clearProjectOpen,
  peekProjectOpen,
  projectPlaneClass,
  type ProjectOpenOrigin,
} from "../components/effects/projectOpen";

interface Contributor {
  name: string;
  github?: string;
  linkedin?: string;
}

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
  contributors?: Contributor[];
}

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<{
    origin: ProjectOpenOrigin;
    to: { centerX: number; centerY: number; width: number; height: number };
  } | null>(null);
  
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (!project || !heroRef.current) return;
    const origin = peekProjectOpen(project._id);
    if (!origin) return;
    const rect = heroRef.current.getBoundingClientRect();
    setFlight({
      origin,
      to: {
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: heroRef.current.offsetWidth,
        height: heroRef.current.offsetHeight,
      },
    });
  }, [project]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // Fetch tools for icon mapping
        await fetchToolsForIcons();
        const data = await fetchProjects();
        setProjects(data);
        const foundProject = data.find((p: Project) => p._id === id);
        setProject(foundProject || null);
      } catch (error) {
        // Error occurred while fetching project
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [id]);
  
  // Get 3 other projects for "More Projects" section
  const moreProjects = projects.filter(p => p._id !== id).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="container max-w-container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-theme-subtle rounded w-64 mb-8"></div>
            
            {/* Hero image skeleton */}
            <div className="relative h-[420px] bg-theme-subtle rounded-[12px] mb-10 border border-theme-border-strong">
              <div className="absolute bottom-8 left-8 right-8">
                <div className="h-10 bg-theme-border rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Tech stack skeleton */}
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              <div className="h-9 bg-theme-subtle rounded-[999px] w-24"></div>
              <div className="h-9 bg-theme-subtle rounded-[999px] w-28"></div>
              <div className="h-9 bg-theme-subtle rounded-[999px] w-20"></div>
              <div className="h-9 bg-theme-subtle rounded-[999px] w-32"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="surface-card p-6 mb-10">
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-theme-subtle rounded"></div>
                <div className="h-4 bg-theme-subtle rounded w-11/12"></div>
                <div className="h-4 bg-theme-subtle rounded w-10/12"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 bg-theme-subtle rounded-lg w-32"></div>
                <div className="h-10 bg-theme-subtle rounded-lg w-36"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="heading-1 mb-4">Project not found</h1>
        <Button onClick={() => navigate("/")} variant="primary">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container max-w-container mx-auto px-4 py-8 [perspective:1400px]">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Projects", path: "/projects" },
            { label: project.title, path: `/project/${project._id}` }
          ]} 
        />

        {/* 1. Gallery/Image Section */}
        <div className="mt-6 mb-10">
          <div
            ref={heroRef}
            className="surface-card relative overflow-hidden [transform-style:preserve-3d]"
            style={{
              transform: `rotateX(${PROJECT_ROTATE_X}deg) rotateY(${PROJECT_ROTATE_Y}deg)`,
              opacity: flight ? 0 : 1,
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-[380px] md:h-[460px] object-cover"
              style={{ opacity: flight ? 0 : 1 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.15) 50%, transparent 100%)" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
              initial={flight ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-white mb-1">{project.title}</h1>
            </motion.div>
          </div>
        </div>

        {flight && (
          <div className="pointer-events-none fixed inset-0 z-[80] [perspective:1400px]">
            <motion.img
              src={flight.origin.src}
              alt=""
              className="absolute object-cover"
              initial={{
                left: flight.origin.centerX,
                top: flight.origin.centerY,
                width: flight.origin.width,
                height: flight.origin.height,
                x: "-50%",
                y: "-50%",
                rotateX: PROJECT_ROTATE_X,
                rotateY: PROJECT_ROTATE_Y,
              }}
              animate={{
                left: flight.to.centerX,
                top: flight.to.centerY,
                width: flight.to.width,
                height: flight.to.height,
                x: "-50%",
                y: "-50%",
                rotateX: PROJECT_ROTATE_X,
                rotateY: PROJECT_ROTATE_Y,
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                clearProjectOpen();
                setFlight(null);
              }}
            />
          </div>
        )}

        {/* 2. Tools Used (No Heading) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-2.5 justify-center">
            {project.tech.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-theme-accent-soft rounded-[999px] border border-theme-border-strong text-sm font-medium text-theme-accent"
              >
                <img src={getTechLogo(tech)} alt={tech} className="w-4 h-4 object-contain" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Description with Links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8 surface-card p-6 md:p-8"
        >
          <p className="text-base text-theme-text leading-relaxed mb-4">
            {project.description}
          </p>
          <p className="text-sm text-theme-muted leading-relaxed mb-6">
            This project showcases modern web development practices with a focus on performance, 
            user experience, and maintainable code architecture. Built with the latest technologies 
            and best practices in the industry.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              as="a"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="flex items-center gap-2"
            >
              <Github size={17} />
              View on GitHub
            </Button>
            <Button
              as="a"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="flex items-center gap-2"
            >
              <ExternalLink size={17} />
              Live Demo
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 4. Project Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="surface-card p-6"
          >
            <h3 className="heading-3 mb-4 flex items-center gap-2">
              <Calendar className="text-theme-accent" size={18} />
              Project Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-theme-muted">Status</span>
                <span className={`px-2.5 py-0.5 rounded-[999px] text-xs font-medium border ${
                  project.status === "completed"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60"
                    : project.status === "in-progress"
                    ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60"
                    : "bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                }`}>
                  {project.status === "completed" ? "Completed" :
                   project.status === "in-progress" ? "In Progress" : "Planning"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-theme-muted">Started</span>
                <span className="text-theme-text font-medium">Jan 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-theme-muted">Duration</span>
                <span className="text-theme-text font-medium">3 months</span>
              </div>
            </div>
          </motion.div>

          {/* 5. Contributors */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="surface-card p-6"
          >
            <h3 className="heading-3 mb-4 flex items-center gap-2">
              <Users className="text-theme-accent" size={18} />
              Contributors
            </h3>
            <div className="space-y-3">
              {project.contributors && project.contributors.length > 0 ? (
                project.contributors.map((contributor, index) => {
                  const initials = contributor.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase();
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-theme-subtle rounded-lg border border-theme-border-strong/70">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-theme-accent-soft border border-theme-border-strong flex items-center justify-center text-theme-accent font-semibold text-xs">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-theme-text text-sm">{contributor.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {contributor.github && (
                          <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-theme-surface rounded-lg transition-colors text-theme-muted hover:text-theme-accent">
                            <Github size={16} />
                          </a>
                        )}
                        {contributor.linkedin && (
                          <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-theme-surface rounded-lg transition-colors text-theme-muted hover:text-theme-accent">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center p-3 bg-theme-subtle rounded-lg text-theme-muted">
                  <p className="text-sm">No contributors added yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* 6. Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10 surface-card p-6 md:p-8"
        >
          <h3 className="heading-3 mb-5">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {project.keyFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-theme-subtle rounded-lg border border-theme-border-strong/70">
                <div className="w-5 h-5 rounded-full bg-theme-accent-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-theme-accent text-xs font-semibold">✓</span>
                </div>
                <p className="text-theme-muted text-sm">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7. More Projects */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10"
        >
          <h3 className="heading-2 mb-6">More Projects</h3>
          <div className="grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-thin [perspective:1400px]">
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
              @media (max-width: 768px) {
                .grid.md\\:grid-cols-3 {
                  display: flex;
                  flex-wrap: nowrap;
                }
                .grid.md\\:grid-cols-3 > * {
                  flex: 0 0 80%;
                  scroll-snap-align: start;
                }
              }
            `}</style>
            {moreProjects.map((proj) => (
              <Link
                key={proj._id}
                to={`/project/${proj._id}`}
                onClick={(event) => {
                  const image = event.currentTarget.querySelector("img");
                  if (image instanceof HTMLImageElement) captureProjectImage(proj._id, image);
                }}
              >
                <div className={`surface-card card-accent-hover group h-full ${projectPlaneClass}`}>
                  <div className="relative h-44 overflow-hidden border-b border-theme-border bg-theme-subtle">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs px-2.5 py-0.5 rounded-[999px] bg-theme-surface text-theme-text border border-theme-border-strong font-medium">
                        {proj.status === "completed" ? "✓ Done" : proj.status === "in-progress" ? "🔨 Building" : "📋 Planning"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="heading-4 mb-2 group-hover:text-theme-accent transition-colors">{proj.title}</h4>
                    <p className="text-sm text-theme-muted line-clamp-2 mb-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech.slice(0, 3).map((tech) => (
                        <span key={tech} className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-theme-accent-soft border border-theme-border-strong text-theme-accent rounded-[999px] font-medium">
                          <img src={getTechLogo(tech)} alt={tech} className="w-3 h-3 object-contain" />
                          {tech}
                        </span>
                      ))}
                      {proj.tech.length > 3 && (
                        <span className="text-xs px-2.5 py-0.5 bg-theme-subtle rounded-[999px] border border-theme-border-strong text-theme-muted">
                          +{proj.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
