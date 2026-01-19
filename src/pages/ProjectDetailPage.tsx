import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
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

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

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
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
            
            {/* Hero image skeleton */}
            <div className="relative h-[500px] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-12">
              <div className="absolute bottom-8 left-8 right-8">
                <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            </div>
            
            {/* Tech stack skeleton */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-28"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-20"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-24"></div>
            </div>
            
            {/* Description skeleton */}
            <div className="bg-gradient-to-b from-dark-800/90 to-black p-8 rounded-2xl border border-accent-primary/30 mb-12">
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
              </div>
            </div>
            
            {/* Features skeleton */}
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10/12"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-4">Project not found</h1>
        <Button onClick={() => navigate("/")} variant="primary">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Projects", path: "/projects" },
            { label: project.title, path: `/project/${project._id}` }
          ]} 
        />

        {/* 1. Gallery/Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 mb-12"
        >
          <div className="relative rounded-2xl overflow-hidden border border-accent-primary/30">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{project.title}</h1>
            </div>
          </div>
        </motion.div>

        {/* 2. Tools Used (No Heading) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {project.tech.map((tech) => (
              <div
                key={tech}
                className="flex items-center gap-2 px-4 py-2 bg-dark-800/90 backdrop-blur-sm rounded-xl border border-accent-primary/30 hover:border-accent-primary/60 transition-all group"
              >
                <img src={getTechLogo(tech)} alt={tech} className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-white">{tech}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3. Description with Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12 bg-gradient-to-b from-dark-800/90 to-black p-8 rounded-2xl border border-accent-primary/30"
        >
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            {project.description}
          </p>
          <p className="text-gray-400 leading-relaxed mb-8">
            This project showcases modern web development practices with a focus on performance, 
            user experience, and maintainable code architecture. Built with the latest technologies 
            and best practices in the industry.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Button
              as="a"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="flex items-center gap-2"
            >
              <Github size={18} />
              View on GitHub
            </Button>
            <Button
              as="a"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="flex items-center gap-2 border-accent-primary/50 hover:bg-accent-primary/10"
            >
              <ExternalLink size={18} />
              Live Demo
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 4. Project Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-b from-dark-800/90 to-black p-6 rounded-2xl border border-accent-primary/30"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-accent-primary" size={20} />
              Project Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === "completed" ? "bg-green-500/20 text-green-400" :
                  project.status === "in-progress" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  {project.status === "completed" ? "Completed" :
                   project.status === "in-progress" ? "In Progress" : "Planning"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Started</span>
                <span className="text-white">Jan 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">3 months</span>
              </div>
            </div>
          </motion.div>

          {/* 5. Contributors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-b from-dark-800/90 to-black p-6 rounded-2xl border border-accent-primary/30"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-accent-primary" size={20} />
              Contributors
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-neon-purple flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <p className="font-medium text-white">Amarjeet Singh</p>
                    <p className="text-xs text-gray-400">Lead Developer</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href="https://github.com/amarjeet-singh" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                    <Github size={18} className="text-gray-400 hover:text-white" />
                  </a>
                  <a href="https://linkedin.com/in/amarjeet-singh" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-dark-800 rounded-lg transition-colors">
                    <svg className="w-[18px] h-[18px] text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 6. Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12 bg-gradient-to-b from-dark-800/90 to-black p-8 rounded-2xl border border-accent-primary/30"
        >
          <h3 className="text-2xl font-bold mb-6">Key Features</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {project.keyFeatures.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-dark-900/50 rounded-lg hover:bg-dark-900/70 transition-colors">
                <div className="w-6 h-6 rounded-full bg-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-accent-primary text-sm">✓</span>
                </div>
                <p className="text-gray-300">{feature}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7. More Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6">More Projects</h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-thin scrollbar-thumb-accent-primary/50 scrollbar-track-dark-800/30 hover:scrollbar-thumb-accent-primary/80">
            <style>{`
              .scrollbar-thin::-webkit-scrollbar {
                height: 8px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: rgba(17, 24, 39, 0.3);
                border-radius: 10px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: rgba(0, 212, 255, 0.5);
                border-radius: 10px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 212, 255, 0.8);
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
              <Link key={proj._id} to={`/project/${proj._id}`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-b from-dark-800/90 to-black rounded-xl overflow-hidden border border-accent-primary/30 hover:border-accent-primary/60 transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-gray-300 border border-accent-primary/30">
                        {proj.status === "completed" ? "✓ Done" : proj.status === "in-progress" ? "🔨 Building" : "📋 Planning"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-accent-primary transition-colors">{proj.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{proj.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {proj.tech.slice(0, 3).map((tech) => (
                        <span key={tech} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-dark-900/80 rounded border border-accent-primary/20">
                          <img src={getTechLogo(tech)} alt={tech} className="w-3 h-3 object-contain" />
                          {tech}
                        </span>
                      ))}
                      {proj.tech.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-accent-primary/10 rounded border border-accent-primary/30 text-accent-primary">
                          +{proj.tech.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;