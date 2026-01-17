import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { SectionWrapper } from "../components/layout/SectionWrapper";

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  description?: string;
  category?: string;
  order: number;
}

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

export const GalleryPage: React.FC = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/public-data?type=gallery');
      if (response.ok) {
        const data = await response.json();
        setGallery(data.data);
      }
    } catch (error) {
      // Error occurred while fetching gallery
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Gallery", path: "/gallery" }]} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-1 mb-4">Gallery</h1>
          <p className="text-text-secondary text-lg">
            A visual journey through my work and experiences
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading gallery...</p>
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-12 glass-effect rounded-xl">
            <p className="text-text-secondary text-lg">No gallery items yet</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gallery.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-dark-300 text-sm">{item.description}</p>
                    )}
                    {item.category && (
                      <p className="text-dark-300 text-sm capitalize mt-1">{item.category}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </SectionWrapper>
    </div>
  );
};
