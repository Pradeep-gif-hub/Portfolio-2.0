import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Badge } from "../components/ui/Badge";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { ExternalLink } from "lucide-react";
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
  difficulty: string;
  duration?: string;
  projectBased: boolean;
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

export const CertificationsPage: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true);
        const data = await fetchCertifications();
        setCertifications(data);
      } catch (error) {
        // Failed to fetch certifications
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, []);

  const filteredCertifications = filter === "all"
    ? certifications
    : certifications.filter(cert => cert.difficulty === filter);

  const difficultyLevels = ["all", ...Array.from(new Set(certifications.map(c => c.difficulty)))];

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Certifications", path: "/certifications" }
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <h1 className="heading-1">{"Certifications"}</h1>
          </div>
          <p className="text-theme-muted text-base">
            Professional credentials and achievements
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-wrap gap-2.5 mb-8"
        >
          {difficultyLevels.map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === level
                  ? "bg-theme-accent text-theme-accent-contrast"
                  : "bg-theme-surface border border-theme-border text-theme-muted hover:border-theme-muted hover:text-theme-text"
                }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-theme-surface border border-theme-border rounded-[10px] p-6 shadow-card animate-pulse">
                <div className="mb-4 rounded-lg bg-theme-subtle h-28"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-theme-subtle rounded w-3/4"></div>
                  <div className="h-4 bg-theme-subtle rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-theme-subtle rounded-full w-20"></div>
                    <div className="h-6 bg-theme-subtle rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCertifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-theme-muted">No certifications found.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCertifications.map((cert) => (
              <motion.div
                key={cert._id}
                variants={itemVariants}
              >
                <Link to={`/certification/${cert._id}`} className="block h-full">
                  <div className="bg-theme-surface border border-theme-border rounded-[10px] p-6 h-full group cursor-pointer card-hover shadow-card flex flex-col">
                    {cert.image && (
                      <div className="mb-4 rounded-lg overflow-hidden bg-white border border-theme-border p-2">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-32 object-contain"
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="heading-4 group-hover:text-theme-accent transition-colors">
                          {cert.title}
                        </h3>
                        <ExternalLink
                          size={16}
                          className="text-theme-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
                        />
                      </div>
                      <p className="text-theme-muted text-sm mb-3">{cert.issuer}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="accent">
                          {cert.month ? `${cert.month} ${cert.year}` : cert.year}
                        </Badge>
                        {cert.difficulty && (
                          <Badge variant="dark">
                            {cert.difficulty}
                          </Badge>
                        )}
                        {cert.projectBased && (
                          <Badge variant="accent">
                            Project-Based
                          </Badge>
                        )}
                      </div>

                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2.5 py-0.5 bg-theme-accent-soft rounded-full text-theme-accent font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {cert.skills.length > 3 && (
                            <span className="text-xs px-2.5 py-0.5 bg-theme-subtle rounded-full text-theme-muted border border-theme-border">
                              +{cert.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </SectionWrapper>
    </div>
  );
};