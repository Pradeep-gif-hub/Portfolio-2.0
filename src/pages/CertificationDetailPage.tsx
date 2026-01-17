import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Calendar, Award, ExternalLink, Clock, Target, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { useState, useEffect } from "react";
import { fetchCertifications } from "../utils/api";

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  year: number;
  month?: string;
  link?: string;
  image?: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  projectBased: boolean;
}

const CertificationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cert, setCert] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertification = async () => {
      try {
        setLoading(true);
        const data = await fetchCertifications();
        const foundCert = data.find((c: Certification) => c._id === id);
        setCert(foundCert || null);
      } catch (error) {
        // Error occurred while fetching certification
        setCert(null);
      } finally {
        setLoading(false);
      }
    };

    loadCertification();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading certification...</p>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold mb-4">Certification not found</h1>
        <Button onClick={() => navigate("/")} variant="primary">
          Back to Home
        </Button>
      </div>
    );
  }

  const difficultyColor = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="min-h-screen">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Certifications", path: "/certifications" },
            { label: cert.title, path: `/certification/${cert._id}` }
          ]} 
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <Award size={48} className="text-accent-primary flex-shrink-0" />
            <div>
              <h1 className="heading-1 mb-2">{cert.title}</h1>
              <h2 className="text-2xl text-accent-primary font-semibold">{cert.issuer}</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{cert.month} {cert.year}</span>
            </div>
            {cert.duration && (
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{cert.duration}</span>
              </div>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColor[cert.difficulty]}`}>
              {cert.difficulty}
            </span>
            {cert.projectBased && (
              <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
                Project-Based
              </span>
            )}
          </div>
        </motion.div>

        {/* Certificate Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-dark-800/90 via-dark-800/60 to-black border border-accent-primary/30"
        >
          {cert.image ? (
            <div className="relative">
              <img 
                src={cert.image} 
                alt={cert.title}
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
                className="w-full h-auto object-contain"
              />
              {/* Fallback placeholder (hidden by default) */}
              <div className="hidden aspect-video bg-gradient-to-br from-accent-primary/20 via-accent-primary/10 to-transparent items-center justify-center p-12">
                <div className="text-center">
                  <Award size={80} className="mx-auto text-accent-primary/70 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
                  <p className="text-gray-400">{cert.issuer}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-accent-primary/20 via-accent-primary/10 to-transparent flex items-center justify-center p-12">
              <div className="text-center">
                <Award size={80} className="mx-auto text-accent-primary/70 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">{cert.title}</h3>
                <p className="text-gray-400">{cert.issuer}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Skills Gained */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h3 className="heading-3 mb-4 flex items-center gap-2">
              <Target size={24} className="text-accent-primary" />
              Skills Gained
            </h3>
            <div className="flex flex-wrap gap-2">
              {cert.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-dark-900/80 backdrop-blur-sm rounded-lg border border-accent-primary/20 text-sm text-gray-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Key Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect p-6 rounded-xl space-y-4"
          >
            <h3 className="heading-3 mb-4">Details</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Difficulty:</span>
                <span className="font-semibold">{cert.difficulty}</span>
              </div>
              {cert.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-semibold">{cert.duration}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Year:</span>
                <span className="font-semibold">{cert.month} {cert.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Project-Based:</span>
                <span className="font-semibold">{cert.projectBased ? "Yes" : "No"}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Verification Link */}
        {cert.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <Button
              as="a"
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="group"
            >
              <CheckCircle2 size={18} />
              View Credential / Verification
              <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CertificationDetailPage;
