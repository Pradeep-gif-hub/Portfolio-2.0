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
      <div className="min-h-screen">
        <main className="container max-w-container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-theme-subtle rounded w-64 mb-8"></div>
            
            {/* Header skeleton */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-theme-subtle rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-10 bg-theme-subtle rounded w-3/4"></div>
                <div className="h-6 bg-theme-subtle rounded w-1/2"></div>
              </div>
            </div>
            
            {/* Meta badges skeleton */}
            <div className="flex gap-4 mb-10">
              <div className="h-6 bg-theme-subtle rounded-full w-24"></div>
              <div className="h-6 bg-theme-subtle rounded-full w-20"></div>
              <div className="h-6 bg-theme-subtle rounded-full w-24"></div>
            </div>
            
            {/* Certificate image skeleton */}
            <div className="aspect-video bg-theme-subtle border border-theme-border rounded-[10px] mb-10"></div>
            
            {/* Skills skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-theme-subtle rounded w-32 mb-4"></div>
              <div className="flex gap-2">
                <div className="h-7 bg-theme-subtle rounded-full w-20"></div>
                <div className="h-7 bg-theme-subtle rounded-full w-24"></div>
                <div className="h-7 bg-theme-subtle rounded-full w-20"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="heading-1 mb-4">Certification not found</h1>
        <Button onClick={() => navigate("/")} variant="primary">
          Back to Home
        </Button>
      </div>
    );
  }

  const difficultyColor = {
    Beginner:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60",
    Intermediate:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60",
    Advanced:
      "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60",
  };

  return (
    <div className="min-h-screen">
      <main className="container max-w-container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Certifications", path: "/certifications" },
            { label: cert.title, path: `/certification/${cert._id}` }
          ]} 
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 mb-10"
        >
          <div className="flex items-start gap-4 mb-5">
            <Award size={40} className="text-theme-accent flex-shrink-0 mt-1" />
            <div>
              <h1 className="heading-1 mb-2">{cert.title}</h1>
              <h2 className="text-xl text-theme-accent font-medium">{cert.issuer}</h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center text-theme-muted text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{cert.month} {cert.year}</span>
            </div>
            {cert.duration && (
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{cert.duration}</span>
              </div>
            )}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyColor[cert.difficulty]}`}>
              {cert.difficulty}
            </span>
            {cert.projectBased && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
                Project-Based
              </span>
            )}
          </div>
        </motion.div>

        {/* Certificate Image */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10 rounded-[10px] overflow-hidden bg-theme-surface border border-theme-border shadow-card"
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
              <div className="hidden aspect-video bg-theme-subtle items-center justify-center p-12">
                <div className="text-center">
                  <Award size={64} className="mx-auto text-theme-accent mb-4" />
                  <h3 className="heading-3 mb-2">{cert.title}</h3>
                  <p className="text-theme-muted text-sm">{cert.issuer}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-theme-subtle flex items-center justify-center p-12">
              <div className="text-center">
                <Award size={64} className="mx-auto text-theme-accent mb-4" />
                <h3 className="heading-3 mb-2">{cert.title}</h3>
                <p className="text-theme-muted text-sm">{cert.issuer}</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Skills Gained */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-theme-surface border border-theme-border p-6 rounded-[10px] shadow-card"
          >
            <h3 className="heading-3 mb-4 flex items-center gap-2">
              <Target size={20} className="text-theme-accent" />
              Skills Gained
            </h3>
            <div className="flex flex-wrap gap-2">
              {cert.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-theme-accent-soft rounded-full text-xs font-medium text-theme-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Key Info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-theme-surface border border-theme-border p-6 rounded-[10px] shadow-card space-y-4"
          >
            <h3 className="heading-3 mb-4">Details</h3>
            <div className="space-y-3 text-sm text-theme-text">
              <div className="flex justify-between">
                <span className="text-theme-muted">Difficulty:</span>
                <span className="font-semibold">{cert.difficulty}</span>
              </div>
              {cert.duration && (
                <div className="flex justify-between">
                  <span className="text-theme-muted">Duration:</span>
                  <span className="font-semibold">{cert.duration}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-theme-muted">Year:</span>
                <span className="font-semibold">{cert.month} {cert.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-theme-muted">Project-Based:</span>
                <span className="font-semibold">{cert.projectBased ? "Yes" : "No"}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Verification Link */}
        {cert.link && (
          <div className="flex justify-center">
            <Button
              as="a"
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              className="group gap-2"
            >
              <CheckCircle2 size={17} />
              View Credential / Verification
              <ExternalLink size={15} />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CertificationDetailPage;