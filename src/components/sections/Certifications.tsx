import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { SectionWrapper } from "../layout/SectionWrapper";
import { ExternalLink, ArrowRight } from "lucide-react";
import { fetchCertifications } from "../../utils/api";

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
  featured?: boolean;
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

export const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setLoading(true);
        const data = await fetchCertifications();
        // Filter to only show featured certifications
        const featured = Array.isArray(data) ? data.filter((c) => c.featured) : [];
        setCertifications(featured);
      } catch (error) {
        // Failed to fetch certifications
      } finally {
        setLoading(false);
      }
    };

    loadCertifications();
  }, []);

  return (
    <SectionWrapper id="certifications">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-10"
      >
        <h2 className="heading-2 mb-3">Certifications</h2>
        <p className="text-theme-muted text-base">
          Professional credentials and achievements
        </p>
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
      ) : certifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-theme-muted">No featured certifications yet. Mark some certifications as featured in the admin panel.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certifications.slice(0, 6).map((cert) => (
            <motion.div
              key={cert._id}
              variants={itemVariants}
              className="h-full"
            >
              <Link to={`/certification/${cert._id}`} className="block h-full">
                <div className="bg-theme-surface border border-theme-border rounded-[10px] p-6 group cursor-pointer card-hover shadow-card h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="heading-4 mb-1 group-hover:text-theme-accent transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <ExternalLink
                        size={16}
                        className="text-theme-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
                      />
                    </div>
                    <p className="text-theme-muted text-sm mb-3">{cert.issuer}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cert.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-0.5 bg-theme-accent-soft text-theme-accent rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 2 && (
                        <span className="text-xs px-2 py-0.5 text-theme-muted">
                          +{cert.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-theme-border">
                    <Badge variant="accent" className="text-xs font-medium">
                      {cert.year}
                    </Badge>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
                      cert.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60'
                        : cert.difficulty === 'Intermediate'
                        ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60'
                        : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60'
                    }`}>
                      {cert.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* View All Button */}
      {!loading && certifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" as={Link} to="/certifications">
            View All Certifications
            <ArrowRight size={16} className="ml-2 inline" />
          </Button>
        </motion.div>
      )}
    </SectionWrapper>
  );
};