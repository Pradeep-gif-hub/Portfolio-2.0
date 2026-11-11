import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { SectionWrapper } from "../layout/SectionWrapper";
import { fetchExperiences } from "../../utils/api";

interface Experience {
  _id: string;
  role: string;
  company: string;
  logo: string;
  duration: string;
  points: string[];
  techStack: string[];
  featured?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

export const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setLoading(true);
        const data = await fetchExperiences();
        // Filter to only show featured experiences
        const featured = Array.isArray(data) ? data.filter((e) => e.featured) : [];
        setExperiences(featured);
      } catch (error) {
        // Failed to fetch experiences
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  return (
    <SectionWrapper id="experience">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-10"
      >
        <h2 className="heading-2 mb-3">Experience</h2>
        <p className="text-theme-muted text-base">
          My professional journey
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-6 relative">
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-theme-border" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative pl-0 md:pl-20 animate-pulse">
              <div className="surface-card p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-14 h-14 bg-theme-subtle rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-theme-subtle rounded w-2/3"></div>
                    <div className="h-5 bg-theme-subtle rounded w-1/2"></div>
                    <div className="h-4 bg-theme-subtle rounded w-36"></div>
                    <div className="space-y-2 pt-1">
                      <div className="h-4 bg-theme-subtle rounded"></div>
                      <div className="h-4 bg-theme-subtle rounded w-11/12"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-theme-muted">No featured experiences yet. Mark some experiences as featured in the admin panel.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6 relative"
        >
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-theme-border" />

          {experiences.map((exp) => (
          <motion.div
            key={exp._id}
            variants={itemVariants}
            className="relative pl-0 md:pl-20"
          >
            {/* Timeline dot */}
            <div className="hidden md:flex absolute left-0 top-2 w-16 h-16 items-center justify-center">
              <div className="w-3.5 h-3.5 bg-theme-accent rounded-full border-4 border-theme-bg" />
            </div>

            <Link to={`/experience/${exp._id}`} className="block">
              <div className="surface-card p-6 card-hover group">
                <div className="flex items-start gap-4 mb-4">
                  {/* Company Logo */}
                  <img 
                    src={exp.logo} 
                    alt={exp.company}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.company)}&size=64&background=1F3A34&color=fff&bold=true`;
                    }}
                    className="w-14 h-14 rounded-lg object-cover border border-theme-border flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="heading-4 group-hover:text-theme-accent transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-theme-accent text-sm font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="dark" className="w-fit text-xs">
                        {exp.duration}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 md:ml-[4.5rem]">
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-theme-muted text-sm flex items-start gap-3">
                      <span className="text-theme-accent mt-0.5">→</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </motion.div>
        ))}
        </motion.div>
      )}
    </SectionWrapper>
  );
};