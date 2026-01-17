import React from "react";
import { Hero } from "../components/sections/Hero";
import { GitHubActivity } from "../components/sections/GitHubActivity";
import { TechStack } from "../components/sections/TechStack";
import { Projects } from "../components/sections/Projects";
import { Experience } from "../components/sections/Experience";
import { Certifications } from "../components/sections/Certifications";
import { Contact } from "../components/sections/Contact";

export const HomePage: React.FC = () => {
  return (
    <main>
      <Hero />
      <GitHubActivity />
      <TechStack />
      <Projects />
      <Experience />
      <Certifications />
      <Contact />
    </main>
  );
};
