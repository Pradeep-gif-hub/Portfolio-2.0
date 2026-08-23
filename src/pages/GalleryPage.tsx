import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

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
  }, [selectedIndex, gallery.length]);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/public-data?type=gallery');
      if (response.ok) {
        const data = await response.json();
        setGallery(data.data);
      }
    } catch {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-950/80 to-transparent">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
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
            {gallery.map((item, index) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative aspect-video rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedIndex(index)}
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

        {selectedIndex !== null && gallery[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full max-h-[85vh] relative flex items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={gallery[selectedIndex].image}
                alt={gallery[selectedIndex].title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <button
                aria-label="Close image viewer"
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 bg-bg-primary/80 backdrop-blur-sm p-2 rounded-lg hover:bg-bg-primary transition-smooth text-white"
              >
                <X size={20} />
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    aria-label="Previous image"
                    onClick={() => setSelectedIndex((selectedIndex - 1 + gallery.length) % gallery.length)}
                    className="absolute left-2 md:-left-14 bg-bg-primary/80 backdrop-blur-sm p-2 rounded-lg hover:bg-bg-primary transition-smooth text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % gallery.length)}
                    className="absolute right-2 md:-right-14 bg-bg-primary/80 backdrop-blur-sm p-2 rounded-lg hover:bg-bg-primary transition-smooth text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </SectionWrapper>
    </div>
  );
};