import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { SectionWrapper } from "../layout/SectionWrapper";
import { useNavigate } from "react-router-dom";

interface Settings {
  fullName: string;
  tagline: string;
  bio: string;
  profileImage: string;
  resumeUrl?: string;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    fullName: '',
    tagline: '',
    bio: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public-data?type=settings');
      if (!response.ok) {
        return;
      }
      const result = await response.json();
      const data = result.data || result;
      // API returns data wrapped in { success: true, data: {...} }
      setSettings({
        fullName: data.fullName || 'Your Name',
        tagline: data.tagline || 'Full Stack Developer',
        bio: data.bio || 'Add your bio here',
        profileImage: data.profileImage || '',
        resumeUrl: data.resumeUrl,
      });
    } catch (error) {
      // Failed to fetch settings
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionWrapper id="hero" className="min-h-[calc(100vh-4rem)] flex items-center relative">
      {loading ? (
        <div className="w-full py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 animate-pulse">
            <div className="w-56 h-56 lg:w-72 lg:h-72 bg-theme-subtle border border-theme-border rounded-2xl flex-shrink-0"></div>
            <div className="flex-1 space-y-5 w-full">
              <div className="h-5 bg-theme-subtle rounded w-40"></div>
              <div className="h-12 bg-theme-subtle rounded w-3/4"></div>
              <div className="h-6 bg-theme-subtle rounded w-1/2"></div>
              <div className="flex gap-4 pt-2">
                <div className="h-11 bg-theme-subtle rounded-lg w-36"></div>
                <div className="h-11 bg-theme-subtle rounded-lg w-36"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
            {/* Image Section - Left Side */}
            <motion.div
              variants={item}
              className="flex-shrink-0"
            >
              <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-2xl overflow-hidden border border-theme-border-strong bg-theme-surface shadow-card">
                <img
                  src={settings.profileImage || '/profile.jpg'}
                  alt={settings.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-theme-accent-soft', 'flex', 'items-center', 'justify-center');
                    const fallback = document.createElement('div');
                    fallback.className = 'text-5xl font-semibold text-theme-accent';
                    fallback.textContent = 'AS';
                    e.currentTarget.parentElement!.appendChild(fallback);
                  }}
                />
              </div>
            </motion.div>

            {/* Text Content - Right Side */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div variants={item}>
                <p className="text-theme-accent text-sm font-medium mb-3">
                  Welcome to my digital space
                </p>
              </motion.div>

              <motion.h1
                variants={item}
                className="heading-1 mb-4 leading-tight"
              >
                {settings.fullName}
                <span
                  className="text-theme-accent"
                  onClick={() => navigate('/admin-login')}
                  style={{ cursor: 'default', pointerEvents: 'auto' }}
                >
                  .
                </span>
              </motion.h1>

              <motion.p variants={item} className="text-lg md:text-xl text-theme-muted mb-8 leading-relaxed">
                {settings.tagline}
              </motion.p>

              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center"
              >
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View My Work
                  <ArrowRight size={17} className="ml-2 inline" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get In Touch
                </Button>
                {settings.resumeUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.open(settings.resumeUrl, '_blank')}
                  >
                    Download Resume
                  </Button>
                )}
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 flex justify-center">
            <div className="w-5 h-9 border border-theme-border rounded-full flex items-start justify-center p-1.5">
              <div className="w-1 h-2 bg-theme-muted rounded-full" />
            </div>
          </div>
        </motion.div>
      )}
    </SectionWrapper>
  );
};
