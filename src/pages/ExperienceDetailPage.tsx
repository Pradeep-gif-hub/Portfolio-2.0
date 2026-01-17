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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-4">Experience not found</h1>
        <Button onClick={() => navigate("/")} variant="primary">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Experience", path: "/" },
            { label: job.role, path: `/experience/${job._id}` }
          ]} 
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 mb-12"
        >
          <div className="flex items-start gap-6 mb-4">
            {/* Company Logo */}
            <img 
              src={job.logo} 
              alt={job.company}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&size=80&background=0891b2&color=fff&bold=true`;
              }}
              className="w-20 h-20 rounded-xl object-cover border-2 border-accent-primary/30 flex-shrink-0"
            />
            <div className="flex-1">
              <h1 className="heading-1 mb-2">{job.role}</h1>
              <h2 className="text-2xl text-accent-primary font-semibold mb-4">{job.company}</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={18} />
                <span className="text-lg">{job.duration}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Responsibilities & Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-effect p-8 rounded-xl">
              <h3 className="heading-3 mb-6">Responsibilities & Achievements</h3>
              <ul className="space-y-4">
                {job.points.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Sidebar - Company Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Company */}
            <div className="glass-effect p-6 rounded-xl">
              <h4 className="heading-4 mb-4">Organization</h4>
              <p className="text-gray-300 font-semibold">{job.company}</p>
            </div>

            {/* Duration */}
            <div className="glass-effect p-6 rounded-xl">
              <h4 className="heading-4 mb-4">Duration</h4>
              <p className="text-gray-300 font-mono">{job.duration}</p>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect p-8 rounded-xl"
        >
          <h3 className="heading-3 mb-6 flex items-center gap-2">
            <Code2 size={24} className="text-accent-primary" />
            Tech Stack
          </h3>
          <div className="flex flex-wrap gap-3">
            {job.techStack.map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-2 bg-dark-900/80 backdrop-blur-sm rounded-xl border border-accent-primary/20 hover:border-accent-primary/40 transition-all group"
              >
                <img src={getTechLogo(tech)} alt={tech} className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-300 font-medium">
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ExperienceDetailPage;
