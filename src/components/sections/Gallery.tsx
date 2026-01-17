import React, { useState } from "react";
import { motion } from "framer-motion";
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
  const [selectedImage, setSelectedImage] = useState<{
    id: number;
    image: string;
    alt: string;
    category: string;
  } | null>(null);

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
        {gallery.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg cursor-pointer group h-64"
            onClick={() => setSelectedImage(item)}
          >
            <img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div>
                <p className="text-white font-medium">{item.alt}</p>
                <p className="text-text-secondary text-sm capitalize">
                  {item.category}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="max-w-4xl w-full max-h-96 relative"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.alt}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-bg-primary/80 backdrop-blur-sm p-2 rounded-lg hover:bg-bg-primary transition-smooth text-white"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </SectionWrapper>
  );
};
