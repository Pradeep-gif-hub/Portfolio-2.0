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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-2 mb-4">Experience</h2>
        <p className="text-text-secondary text-lg">
          My professional journey
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading experiences...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary">No featured experiences yet. Mark some experiences as featured in the admin panel.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-8 relative"
        >
          {/* Timeline line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary to-transparent" />

          {experiences.map((exp) => (
          <motion.div
            key={exp._id}
            variants={itemVariants}
            className="relative pl-0 md:pl-24"
          >
            {/* Timeline dot */}
            <div className="hidden md:flex absolute left-0 top-2 w-16 h-16 items-center justify-center">
              <div className="w-4 h-4 bg-accent-primary rounded-full border-4 border-bg-primary" />
            </div>

            <Link to={`/experience/${exp._id}`} className="block">
              <div className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 hover:border-accent-primary transition-smooth cursor-pointer group">
                <div className="flex items-start gap-4 mb-3">
                  {/* Company Logo */}
                  <img 
                    src={exp.logo} 
                    alt={exp.company}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exp.company)}&size=64&background=0891b2&color=fff&bold=true`;
                    }}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-bg-tertiary group-hover:border-accent-primary transition-smooth flex-shrink-0"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="heading-4 group-hover:text-accent-primary transition-smooth">
                          {exp.role}
                        </h3>
                        <p className="text-accent-primary font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <Badge variant="dark" className="w-fit">
                        {exp.duration}
                      </Badge>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 ml-20">
                  {exp.points.map((point, i) => (
                    <li key={i} className="text-text-secondary flex items-start gap-3">
                      <span className="text-accent-primary mt-1">→</span>
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
