import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Calendar, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useState, useEffect } from "react";
import { fetchExperiences } from "../utils/api";
import { fetchToolsForIcons, getTechLogo } from "../utils/techIcons";

interface Experience {
  _id: string;
  role: string;
  company: string;
  logo: string;
  duration: string;
  points: string[];
  techStack: string[];
}

const ExperienceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperience = async () => {
      try {
        setLoading(true);
        // Fetch tools for icon mapping
        await fetchToolsForIcons();
        const data = await fetchExperiences();
        const foundJob = data.find((e: Experience) => e._id === id);
        setJob(foundJob || null);
      } catch (error) {
        // Error occurred while fetching experience
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <main className="container max-w-container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-theme-subtle rounded w-56 mb-8"></div>
            
            {/* Header skeleton */}
            <div className="flex items-start gap-6 mb-10">
              <div className="w-16 h-16 bg-theme-subtle rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="h-9 bg-theme-subtle rounded w-3/4"></div>
                <div className="h-6 bg-theme-subtle rounded w-1/2"></div>
                <div className="h-4 bg-theme-subtle rounded w-40"></div>
              </div>
            </div>
            
            {/* Content grid skeleton */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-theme-surface border border-theme-border rounded-[10px] p-6 space-y-3">
                <div className="h-6 bg-theme-subtle rounded w-64 mb-4"></div>
                <div className="h-4 bg-theme-subtle rounded"></div>
                <div className="h-4 bg-theme-subtle rounded w-11/12"></div>
                <div className="h-4 bg-theme-subtle rounded w-10/12"></div>
              </div>
              <div className="space-y-6">
                <div className="h-28 bg-theme-surface border border-theme-border rounded-[10px]"></div>
                <div className="h-28 bg-theme-surface border border-theme-border rounded-[10px]"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="heading-1 mb-4">Experience not found</h1>
        <Button onClick={() => navigate("/")} variant="primary">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container max-w-container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Experience", path: "/" },
            { label: job.role, path: `/experience/${job._id}` }
          ]} 
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 mb-10"
        >
          <div className="flex items-start gap-5 mb-4">
            {/* Company Logo */}
            <img 
              src={job.logo} 
              alt={job.company}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&size=80&background=1F3A34&color=fff&bold=true`;
              }}
              className="w-16 h-16 rounded-lg object-cover border border-theme-border flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="heading-1 mb-2">{job.role}</h1>
              <h2 className="text-xl text-theme-accent font-medium mb-3">{job.company}</h2>
              <div className="flex items-center gap-2 text-theme-muted text-sm">
                <Calendar size={16} />
                <span>{job.duration}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Responsibilities & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-2"
          >
            <div className="bg-theme-surface border border-theme-border p-6 md:p-8 rounded-[10px] shadow-card">
              <h3 className="heading-3 mb-5">Responsibilities & Achievements</h3>
              <ul className="space-y-3">
                {job.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-theme-muted text-sm"
                  >
                    <span className="w-1.5 h-1.5 bg-theme-accent rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Sidebar - Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Company */}
            <div className="bg-theme-surface border border-theme-border p-6 rounded-[10px] shadow-card">
              <h4 className="heading-4 mb-2">Organization</h4>
              <p className="text-theme-muted text-sm font-medium">{job.company}</p>
            </div>

            {/* Duration */}
            <div className="bg-theme-surface border border-theme-border p-6 rounded-[10px] shadow-card">
              <h4 className="heading-4 mb-2">Duration</h4>
              <p className="text-theme-muted text-sm font-mono">{job.duration}</p>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-theme-surface border border-theme-border p-6 md:p-8 rounded-[10px] shadow-card"
        >
          <h3 className="heading-3 mb-5 flex items-center gap-2">
            <Code2 size={20} className="text-theme-accent" />
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.techStack.map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-theme-accent-soft rounded-full text-xs font-medium text-theme-accent"
              >
                <img src={getTechLogo(tech)} alt={tech} className="w-4 h-4 object-contain" />
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExperienceDetailPage;