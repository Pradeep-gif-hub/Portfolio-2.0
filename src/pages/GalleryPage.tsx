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
              <div key={i} className="surface-card aspect-video overflow-hidden animate-pulse">
                <div className="w-full h-full bg-theme-subtle"></div>
              </div>
            ))}
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-12 surface-card">
            <p className="text-theme-muted text-base">No gallery items yet</p>
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
                className="aspect-video surface-card card-hover card-accent-hover group"
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                  style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent)" }}
                >
                  <div>
                    <p className="text-white font-medium text-sm">{item.title}</p>
                    {item.description && (
                      <p className="text-neutral-300 text-xs">{item.description}</p>
                    )}
                    {item.category && (
                      <p className="text-neutral-300 text-xs capitalize mt-1">{item.category}</p>
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
            className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
              className="max-w-4xl w-full max-h-[85vh] relative flex items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={gallery[selectedIndex].image}
                alt={gallery[selectedIndex].title}
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
    </div>
  );
};