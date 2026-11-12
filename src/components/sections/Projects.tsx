import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Button } from "../ui/Button";
import { fetchProjects } from "../../utils/api";
import { fetchToolsForIcons } from "../../utils/techIcons";
import { ProjectDeck, type DeckProject } from "./ProjectDeck";

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<DeckProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        await fetchToolsForIcons();
        const data = await fetchProjects();
        const featured = Array.isArray(data) ? data.filter((p: DeckProject) => p.featured) : [];
        setProjects(featured);
      } catch (error) {
        console.error("[HomePage Projects] Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <SectionWrapper id="projects">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-8"
      >
        <h2 className="heading-2 mb-3">Featured Projects</h2>
        <p className="text-theme-muted text-base">A selection of projects I&apos;m proud of</p>
      </motion.div>

      {loading ? (
        <div className="surface-card overflow-hidden animate-pulse">
          <div className="h-11 bg-theme-subtle border-b border-theme-border" />
          <div className="flex flex-col md:flex-row gap-5 md:gap-8 p-5 md:p-7">
            <div className="md:w-2/5 h-52 md:h-64 bg-theme-subtle rounded-lg" />
            <div className="md:w-3/5 space-y-3">
              <div className="h-7 bg-theme-subtle rounded w-2/3" />
              <div className="h-4 bg-theme-subtle rounded w-full" />
              <div className="h-4 bg-theme-subtle rounded w-5/6" />
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-theme-muted">No featured projects yet. Mark some projects as featured in the admin panel.</p>
        </div>
      ) : (
        <ProjectDeck projects={projects} />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Button variant="outline" as={Link} to="/projects">
          View All Projects
          <ArrowRight size={16} className="ml-2 inline" />
        </Button>
      </motion.div>
    </SectionWrapper>
  );
};
