import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Coffee, Music, MessageCircle, FileText, ExternalLink } from "lucide-react";
import { SectionWrapper } from "../components/layout/SectionWrapper";

interface Settings {
  fullName: string;
  profileImage: string;
  bio: string;
  email?: string;
  resumeUrl?: string;
  github?: string;
  discord?: string;
  spotify?: string;
  twitter?: string;
  linkedin?: string;
  buyMeACoffee?: string;
}

interface LinkCard {
  name: string;
  url?: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  hoverEffect: string;
}

export const LinksPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    fullName: '',
    profileImage: '',
    bio: '',
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
      setSettings({
        fullName: data.fullName || 'Your Name',
        profileImage: data.profileImage || '',
        bio: data.bio || '',
        email: data.email,
        resumeUrl: data.resumeUrl,
        github: data.github,
        linkedin: data.linkedin,
        twitter: data.twitter,
        discord: data.discord,
        spotify: data.spotify,
        buyMeACoffee: data.buyMeACoffee,
      });
    } catch (error) {
      // Error occurred while fetching settings
    } finally {
      setLoading(false);
    }
  };

  const links: LinkCard[] = [
    settings.resumeUrl && {
      name: "Resume",
      url: settings.resumeUrl,
      icon: FileText,
      color: "text-orange-400",
      gradient: "from-orange-500 to-red-500",
      hoverEffect: "hover:shadow-orange-500/50",
    },
    settings.github && {
      name: "GitHub",
      url: settings.github,
      icon: Github,
      color: "text-purple-400",
      gradient: "from-purple-500 to-pink-500",
      hoverEffect: "hover:shadow-purple-500/50",
    },
    settings.linkedin && {
      name: "LinkedIn",
      url: settings.linkedin,
      icon: Linkedin,
      color: "text-blue-500",
      gradient: "from-blue-600 to-blue-400",
      hoverEffect: "hover:shadow-blue-600/50",
    },
    settings.twitter && {
      name: "Twitter",
      url: settings.twitter,
      icon: Twitter,
      color: "text-cyan-400",
      gradient: "from-cyan-500 to-teal-500",
      hoverEffect: "hover:shadow-cyan-500/50",
    },
    settings.discord && {
      name: "Discord",
      url: `https://discord.com/users/${settings.discord}`,
      icon: MessageCircle,
      color: "text-indigo-400",
      gradient: "from-indigo-500 to-purple-500",
      hoverEffect: "hover:shadow-indigo-500/50",
    },
    settings.spotify && {
      name: "Spotify",
      url: settings.spotify,
      icon: Music,
      color: "text-green-400",
      gradient: "from-green-500 to-emerald-500",
      hoverEffect: "hover:shadow-green-500/50",
    },
    settings.buyMeACoffee && {
      name: "Buy Me a Coffee",
      url: settings.buyMeACoffee,
      icon: Coffee,
      color: "text-yellow-400",
      gradient: "from-yellow-500 to-orange-500",
      hoverEffect: "hover:shadow-yellow-500/50",
    },
  ].filter(Boolean) as LinkCard[];

  if (loading) {
    return (
      <SectionWrapper className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6"
          >
            <img
              src={settings.profileImage}
              alt={settings.fullName}
              className="w-32 h-32 rounded-full mx-auto border-4 border-accent-primary/30 shadow-2xl shadow-accent-primary/20"
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-3 bg-gradient-to-r from-accent-primary to-neon-purple bg-clip-text text-transparent"
          >
            {settings.fullName}
          </motion.h1>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-text-secondary max-w-md mx-auto"
          >
            {settings.bio}
          </motion.p>
        </motion.div>

        {/* Links Grid */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`group relative block p-6 rounded-xl bg-gradient-to-r ${link.gradient} bg-opacity-10 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${link.hoverEffect}`}
            >
              {/* Background Glow Effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-dark-900/80 ${link.color}`}>
                    <link.icon size={24} />
                  </div>
                  <span className="text-xl font-semibold text-white">{link.name}</span>
                </div>
                <ExternalLink size={20} className="text-white/60 group-hover:text-white transition-colors" />
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-colors"></div>
            </motion.a>
          ))}
        </div>

        {/* Special Buy Me a Coffee Effect */}
        {settings.buyMeACoffee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + links.length * 0.1 }}
            className="mt-12 text-center"
          >
            <p className="text-text-secondary text-sm mb-4">☕ Support my work</p>
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <Coffee size={32} className="text-yellow-400 mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </SectionWrapper>
  );
};
