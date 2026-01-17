import React from "react";
import { motion } from "framer-motion";
import { hobbies } from "../../data/hobbies";
import { SectionWrapper } from "../layout/SectionWrapper";
import * as Icons from "lucide-react";

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
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export const Hobbies: React.FC = () => {
  return (
    <SectionWrapper id="hobbies">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-2 mb-4">Hobbies & Interests</h2>
        <p className="text-text-secondary text-lg">
          What I love doing outside of work
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hobbies.map((hobby) => {
          const IconComponent = (
            Icons[hobby.icon as keyof typeof Icons] as React.ComponentType<{ size: number }>
          ) || Icons.Lightbulb;

          return (
            <motion.div
              key={hobby.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 text-center group cursor-pointer hover:border-accent-primary/50 hover:bg-bg-secondary/80 transition-smooth"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center group-hover:bg-accent-primary/20 transition-smooth text-accent-primary">
                  <IconComponent size={24} />
                </div>
              </div>
              <h3 className="heading-4 mb-2">{hobby.label}</h3>
              {hobby.description && (
                <p className="text-text-secondary text-sm">{hobby.description}</p>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
};
