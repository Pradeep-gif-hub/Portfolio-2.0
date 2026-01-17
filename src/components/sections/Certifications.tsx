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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-2 mb-4">Certifications</h2>
        <p className="text-text-secondary text-lg">
          Professional credentials and achievements
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading certifications...</p>
        </div>
      ) : certifications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No featured certifications yet. Mark some certifications as featured in the admin panel.</p>
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
              whileHover={{ scale: 1.05, y: -5 }}
              className="h-full"
            >
              <Link to={`/certification/${cert._id}`} className="block h-full">
                <div className="bg-dark-800 border border-dark-700 rounded-xl p-6 group cursor-pointer hover:border-accent-primary/60 transition-all h-full flex flex-col justify-between shadow-lg hover:shadow-xl hover:shadow-accent-primary/10">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <h3 className="heading-4 mb-2 group-hover:text-accent-primary transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <ExternalLink
                        size={18}
                        className="text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      />
                    </div>
                    <p className="text-text-secondary text-sm mb-3">{cert.issuer}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cert.skills.slice(0, 2).map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-accent-primary/10 text-accent-primary rounded-md">
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 2 && (
                        <span className="text-xs px-2 py-1 text-text-secondary">
                          +{cert.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" className="text-xs font-medium">
                      {cert.year}
                    </Badge>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      cert.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                      cert.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
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
