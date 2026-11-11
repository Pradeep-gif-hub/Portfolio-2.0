import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gallery } from "../../data/gallery";
import { SectionWrapper } from "../layout/SectionWrapper";

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

export const Gallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => current === null ? null : (current - 1 + gallery.length) % gallery.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => current === null ? null : (current + 1) % gallery.length);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  return (
    <SectionWrapper id="gallery">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-2 mb-4">Gallery</h2>
        <p className="text-text-secondary text-lg">
          A visual collection of my work and adventures
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {gallery.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="surface-card card-hover card-accent-hover group h-64"
            onClick={() => setSelectedIndex(index)}
          >
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-4"
              style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent)" }}
            >
              <div>
                <p className="text-white font-medium">{item.alt}</p>
                <p className="text-neutral-300 text-sm capitalize">
                  {item.category}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      {selectedIndex !== null && gallery[selectedIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.96 }}
            className="max-w-4xl w-full max-h-[85vh] relative flex items-center justify-center"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <img
              src={gallery[selectedIndex].image}
              alt={gallery[selectedIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-[12px]"
            />
            <button
              aria-label="Close image viewer"
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 bg-theme-surface border border-theme-border-strong p-2 rounded-lg hover:border-theme-accent/70 transition-colors text-theme-text"
            >
              <X size={20} />
            </button>
            {gallery.length > 1 && (
              <>
                <button
                  aria-label="Previous image"
                  onClick={() => setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length)}
                  className="absolute left-2 md:-left-14 bg-theme-surface border border-theme-border-strong p-2 rounded-lg hover:border-theme-accent/70 transition-colors text-theme-text"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  aria-label="Next image"
                  onClick={() => setSelectedIndex((selectedIndex + 1) % gallery.length)}
                  className="absolute right-2 md:-right-14 bg-theme-surface border border-theme-border-strong p-2 rounded-lg hover:border-theme-accent/70 transition-colors text-theme-text"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </SectionWrapper>
  );
};
