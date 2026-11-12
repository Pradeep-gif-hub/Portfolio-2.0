import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { fetchProjects } from "../utils/api";
import { fetchToolsForIcons } from "../utils/techIcons";
import { ProjectDeck, type DeckProject } from "../components/sections/ProjectDeck";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<DeckProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        await fetchToolsForIcons();
        const data = await fetchProjects();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("[ProjectsPage] Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Projects", path: "/projects" }]} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <h1 className="heading-1 mb-3">All Projects</h1>
          <p className="text-theme-muted text-base">Explore all my projects and the technologies I&apos;ve worked with</p>
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
            <p className="text-theme-muted">No projects yet.</p>
          </div>
        ) : (
          <ProjectDeck projects={projects} />
        )}
      </SectionWrapper>
    </div>
  );
};
