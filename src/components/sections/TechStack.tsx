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
      setTools(data.data || data);
    } catch (error) {
      // Failed to fetch tools
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SectionWrapper id="tech">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-2 mb-4">Tech Stack</h2>
        <p className="text-text-secondary text-lg">
          Tools and technologies I work with
        </p>
      </motion.div>

      <div className="relative" style={{ perspective: "2000px" }}>
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-dark-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-dark-950 to-transparent z-20 pointer-events-none" />
        
        {/* Container with 4 lines - 2 desktop (hidden mobile), 4 mobile (hidden desktop) */}
        <div className="relative overflow-hidden py-8">
          {/* DESKTOP VIEW - 2 lines with ALL tools */}
          <div className="hidden md:block">
            {/* Back line (above, moving right to left) - appears as shadow */}
            <motion.div
              className="flex gap-4 md:gap-6 mb-2 opacity-30 blur-[1px]"
              style={{ 
                transform: "rotateX(8deg) translateZ(-30px) scale(0.95)",
                transformStyle: "preserve-3d",
              }}
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
                  className="flex items-center gap-2 px-3 py-2 bg-dark-700/50 backdrop-blur-sm rounded-2xl border border-accent-primary/10 whitespace-nowrap"
                >
                  <img src={tool.logo} alt={tool.name} className="w-5 h-5 object-contain flex-shrink-0" />
                  <span className="font-medium text-gray-400 text-xs truncate">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Front line (below, moving left to right) - full visibility */}
            <motion.div
              className="flex gap-4 md:gap-6"
              style={{ 
                transform: "rotateX(5deg) translateZ(30px)",
                transformStyle: "preserve-3d",
              }}
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
                  className="flex items-center gap-2.5 px-4 py-2.5 bg-dark-800/90 backdrop-blur-sm rounded-2xl border border-accent-primary/40 hover:border-accent-primary/70 hover:shadow-xl hover:shadow-accent-primary/30 transition-all whitespace-nowrap group cursor-pointer"
                  style={{
                    transform: "translateZ(20px)",
                    minWidth: "fit-content"
                  }}
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-6 h-6 object-contain flex-shrink-0 group-hover:scale-110 transition-transform" 
                  />
                  <span className="font-medium text-white text-sm truncate max-w-[120px]">
                    {tool.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* MOBILE VIEW - 3 simple horizontal lines with different speeds */}
          <div className="md:hidden space-y-4">
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
                  className="flex items-center gap-2 px-3 py-2 bg-dark-800/90 backdrop-blur-sm rounded-xl border border-accent-primary/40 whitespace-nowrap"
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-5 h-5 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-white text-xs">
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
                  className="flex items-center gap-2 px-3 py-2 bg-dark-800/90 backdrop-blur-sm rounded-xl border border-accent-primary/40 whitespace-nowrap"
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-5 h-5 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-white text-xs">
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
                  className="flex items-center gap-2 px-3 py-2 bg-dark-800/90 backdrop-blur-sm rounded-xl border border-accent-primary/40 whitespace-nowrap"
                >
                  <img 
                    src={tool.logo} 
                    alt={tool.name} 
                    className="w-5 h-5 object-contain flex-shrink-0" 
                  />
                  <span className="font-medium text-white text-xs">
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
