import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Code } from "lucide-react";
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
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
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
    <SectionWrapper id="hero" className="min-h-screen flex items-center relative overflow-hidden">
      {/* Animated Background Elements - Desktop Only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute top-20 right-20 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="hidden lg:block absolute bottom-32 left-20 w-80 h-80 bg-neon-purple/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="hidden lg:block absolute top-1/2 right-1/4 w-48 h-48 bg-green-400/10 rounded-full blur-3xl"
        />
        
        {/* Floating Code Symbols */}
        <motion.div
          animate={{
            y: [-100, 100],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="hidden lg:block absolute top-1/4 right-1/3 text-6xl text-accent-primary/20 font-mono"
        >
          &lt;/&gt;
        </motion.div>
        <motion.div
          animate={{
            y: [100, -100],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="hidden lg:block absolute bottom-1/4 right-1/4 text-5xl text-neon-purple/20 font-mono"
        >
          &#123;&#125;
        </motion.div>
        <motion.div
          animate={{
            y: [-80, 80],
            x: [-20, 20, -20],
            rotate: [0, 360],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 4,
          }}
          className="hidden lg:block absolute top-1/3 right-32 text-4xl text-green-400/20 font-mono"
        >
          ⚡
        </motion.div>

        {/* Additional Desktop Elements */}
        {/* Animated Dots Grid - Top Right */}
        <div className="hidden lg:grid lg:grid-cols-6 absolute top-10 left-10 gap-3">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.15, 0.6, 0.15],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.08,
              }}
              className="w-2.5 h-2.5 bg-accent-primary/40 rounded-full shadow-lg shadow-accent-primary/20"
            />
          ))}
        </div>

        {/* Animated Dots Grid - Bottom Right */}
        <div className="hidden lg:grid lg:grid-cols-6 absolute bottom-10 right-10 gap-3">
          {[...Array(24)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.08,
              }}
              className="w-2 h-2 bg-green-400/30 rounded-full"
            />
          ))}
        </div>

        {/* Platform Icons as Floating Elements */}
        {/* GitHub Icon */}
        <motion.div
          animate={{
            rotate: [0, 360],
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute top-32 right-1/3"
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Github className="w-16 h-16 text-accent-primary/40 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* LinkedIn Icon */}
        <motion.div
          animate={{
            rotate: [360, 0],
            x: [0, 25, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute bottom-32 right-1/3"
        >
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Linkedin className="w-20 h-20 text-neon-purple/40 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Code Brackets </> */}
        <motion.div
          animate={{
            y: [0, -25, 0],
            opacity: [0.25, 0.65, 0.25],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute top-1/2 right-20">
          <motion.div
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Code className="w-14 h-14 text-green-400/40 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Discord Icon (SVG) */}
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="hidden lg:block absolute top-1/4 right-1/4"
        >
          <motion.div
            animate={{
              rotate: [0, -15, 15, 0],
              scale: [1, 1.25, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg className="w-16 h-16 text-accent-primary/40 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* VS Code Icon (SVG) */}
        <motion.div
          animate={{
            x: [0, -28, 0],
            opacity: [0.25, 0.65, 0.25],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="hidden lg:block absolute bottom-1/4 right-1/2">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg className="w-16 h-16 text-neon-purple/40 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* LeetCode Icon (SVG) */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.25, 1],
            y: [-12, 12, -12],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="hidden lg:block absolute top-1/4 right-20"
        >
          <svg className="w-16 h-16 text-green-400/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104a5.35 5.35 0 0 0-.125.513a5.527 5.527 0 0 0 .062 2.362a5.83 5.83 0 0 0 .349 1.017a5.938 5.938 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523a2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"/>
          </svg>
        </motion.div>

        {/* Floating Rectangles */}
        <motion.div
          animate={{
            y: [0, -50, 0],
            x: [0, 30, 0],
            rotate: [0, 15, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute top-32 right-24 w-40 h-24 bg-gradient-to-br from-accent-primary/10 to-transparent border border-accent-primary/20 rounded-lg"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
            rotate: [0, -10, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="hidden lg:block absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-neon-purple/10 to-transparent border border-neon-purple/20 rounded-lg"
        />

        {/* Binary Code Rain Effect */}
        <div className="hidden lg:block absolute top-0 right-1/3 h-full w-px overflow-hidden">
          <motion.div
            animate={{ y: [-100, 800] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="text-accent-primary/20 text-xs font-mono whitespace-nowrap"
          >
            1010101<br/>0101010<br/>1100110<br/>0011001
          </motion.div>
        </div>
        <div className="hidden lg:block absolute top-0 right-1/4 h-full w-px overflow-hidden">
          <motion.div
            animate={{ y: [-200, 800] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
            className="text-green-400/20 text-xs font-mono whitespace-nowrap"
          >
            1110001<br/>0001110<br/>1001100<br/>0110011
          </motion.div>
        </div>

        {/* Plus Signs */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute top-1/3 right-20 text-5xl text-accent-primary/20 font-bold"
        >
          +
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="hidden lg:block absolute bottom-1/3 right-40 text-4xl text-neon-purple/20 font-bold"
        >
          +
        </motion.div>

        {/* Animated Lines */}
        <motion.div
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden lg:block absolute top-1/4 left-0 h-px w-64 bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent"
        />
        <motion.div
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="hidden lg:block absolute bottom-1/4 right-0 h-px w-80 bg-gradient-to-l from-transparent via-green-400/30 to-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      ) : (
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto w-full relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Image Section - Left Side */}
          <motion.div
            variants={item}
            className="flex-shrink-0"
          >
            <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-2xl overflow-hidden border-4 border-accent-primary/30 hover:border-accent-primary/60 transition-all duration-300 shadow-2xl shadow-accent-primary/20">
              <img
                src={settings.profileImage || '/profile.jpg'}
                alt={settings.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-accent-primary/20', 'via-accent-primary/10', 'to-transparent', 'flex', 'items-center', 'justify-center');
                  const fallback = document.createElement('div');
                  fallback.className = 'text-6xl font-bold text-accent-primary';
                  fallback.textContent = 'AS';
                  e.currentTarget.parentElement!.appendChild(fallback);
                }}
              />
            </div>
          </motion.div>

          {/* Text Content - Right Side */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div variants={item}>
              <p className="text-accent-primary font-semibold mb-4">
                Welcome to my digital space
              </p>
            </motion.div>

            <motion.h1
              variants={item}
              className="heading-1 mb-6 leading-tight"
            >
              {settings.fullName}
              <span 
                className="text-accent-primary" 
                onClick={() => navigate('/admin-login')}
                style={{ cursor: 'default', pointerEvents: 'auto' }}
              >
                .
              </span>
            </motion.h1>

            <motion.p variants={item} className="text-2xl text-text-secondary mb-8">
              {settings.tagline}
            </motion.p>

            <motion.p
              variants={item}
              className="text-lg text-text-secondary mb-12 leading-relaxed"
            >
              {settings.bio}
            </motion.p>

            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View My Work
                <ArrowRight size={18} className="ml-2 inline" />
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
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-20 flex justify-center"
        >
          <div className="w-6 h-10 border-2 border-accent-primary rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-accent-primary rounded-full" />
          </div>
        </motion.div>
      </motion.div>
      )}
    </SectionWrapper>
  );
};