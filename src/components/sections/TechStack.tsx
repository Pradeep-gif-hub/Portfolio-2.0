import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SectionWrapper } from "../layout/SectionWrapper";

interface Tool {
  _id: string;
  name: string;
  category: string;
  logo: string;
  proficiency: string;
  yearsOfExperience?: number;
  order: number;
}

export const TechStack: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('/api/public-data?type=tools&homepage=true');
      const data = await response.json();
      setTools(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch {
      // Failed to fetch tools
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SectionWrapper id="tech">
        <div className="animate-pulse">
          <div className="mb-10">
            <div className="h-8 bg-theme-subtle rounded w-48 mb-3"></div>
            <div className="h-5 bg-theme-subtle rounded w-64"></div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-24 h-12 bg-theme-subtle border border-theme-border-strong rounded-[999px] flex-shrink-0"></div>
              ))}
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-24 h-12 bg-theme-subtle border border-theme-border-strong rounded-[999px] flex-shrink-0"></div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  if (tools.length === 0) {
    return null;
  }
  
  // Divide tools into 3 equal groups for 3 mobile lines
  const toolsPerLine = Math.ceil(tools.length / 3);
  const line1Tools = tools.slice(0, toolsPerLine);
  const line2Tools = tools.slice(toolsPerLine, toolsPerLine * 2);
  const line3Tools = tools.slice(toolsPerLine * 2);
  
  // Create many duplicates for truly seamless scrolling without visible restart
  // The more duplicates, the longer before restart is visible
  const createSeamlessArray = (arr: Tool[]) => {
    const copies = [];
    for (let i = 0; i < 20; i++) {
      copies.push(...arr);
    }
    return copies;
  };
  
  const duplicatedLine1 = createSeamlessArray(line1Tools);
  const duplicatedLine2 = createSeamlessArray(line2Tools);
  const duplicatedLine3 = createSeamlessArray(line3Tools);
  const duplicatedAllTools = createSeamlessArray(tools);

  return (
    <SectionWrapper id="tech">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.25 }}
        className="mb-10"
      >
        <h2 className="heading-2 mb-3">Tech Stack</h2>
        <p className="text-theme-muted text-base">
          Tools and technologies I work with
        </p>
      </motion.div>

      <div className="relative tech-marquee-mask">
        {/* Container with 2 desktop / 3 mobile lines */}
        <div className="relative overflow-hidden py-4">
          {/* DESKTOP VIEW - 2 lines with ALL tools */}
          <div className="hidden md:block">
            {/* Back line (above, moving right to left) */}
            <motion.div
              className="flex gap-4 mb-3 opacity-55"
              animate={{
                x: [-10000, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 100,
                  ease: "linear",
                },
              }}
            >
              {duplicatedAllTools.map((tool, index) => (
                <div
                  key={`desktop-back-${tool.name}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-theme-subtle rounded-[999px] border border-theme-border-strong hover:border-theme-accent transition-colors whitespace-nowrap group"
                >
                  <img src={tool.logo} alt={tool.name} className="w-5 h-5 object-contain flex-shrink-0" />
                  <span className="font-medium text-theme-muted group-hover:text-theme-text transition-colors text-xs truncate">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Front line (below, moving left to right) */}
            <motion.div
              className="flex gap-4"
              animate={{
                x: [0, -10000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 100,
                  ease: "linear",
                },
              }}
            >
              {duplicatedAllTools.map((tool, index) => (
                <div
                  key={`desktop-main-${tool.name}-${index}`}
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-theme-surface rounded-[999px] border border-theme-border-strong hover:border-theme-accent shadow-card transition-colors whitespace-nowrap group cursor-pointer"
                  style={{
                    minWidth: "fit-content"
                  }}
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-5 h-5 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-theme-muted group-hover:text-theme-text transition-colors text-sm truncate max-w-[140px]">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* MOBILE VIEW - 3 simple horizontal lines with different speeds */}
          <div className="md:hidden space-y-3">
            {/* Line 1 - Moving left to right (slow) */}
            <motion.div
              className="flex gap-3"
              animate={{
                x: [0, -8000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60,
                  ease: "linear",
                },
              }}
            >
              {duplicatedLine1.map((tool, index) => (
                <div
                  key={`mobile-line1-${tool.name}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-theme-surface rounded-[999px] border border-theme-border-strong hover:border-theme-accent transition-colors shadow-card whitespace-nowrap group"
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-4 h-4 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-theme-muted group-hover:text-theme-text transition-colors text-xs">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Line 2 - Moving right to left (medium) */}
            <motion.div
              className="flex gap-3"
              animate={{
                x: [-8000, 0],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 75,
                  ease: "linear",
                },
              }}
            >
              {duplicatedLine2.map((tool, index) => (
                <div
                  key={`mobile-line2-${tool.name}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-theme-surface rounded-[999px] border border-theme-border-strong hover:border-theme-accent transition-colors shadow-card whitespace-nowrap group"
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-4 h-4 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-theme-muted group-hover:text-theme-text transition-colors text-xs">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Line 3 - Moving left to right (fast) */}
            <motion.div
              className="flex gap-3"
              animate={{
                x: [0, -8000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 50,
                  ease: "linear",
                },
              }}
            >
              {duplicatedLine3.map((tool, index) => (
                <div
                  key={`mobile-line3-${tool.name}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-theme-surface rounded-[999px] border border-theme-border-strong hover:border-theme-accent transition-colors shadow-card whitespace-nowrap group"
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-4 h-4 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-theme-muted group-hover:text-theme-text transition-colors text-xs">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};