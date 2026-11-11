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
    },
    settings.github && {
      name: "GitHub",
      url: settings.github,
      icon: Github,
    },
    settings.linkedin && {
      name: "LinkedIn",
      url: settings.linkedin,
      icon: Linkedin,
    },
    settings.twitter && {
      name: "Twitter",
      url: settings.twitter,
      icon: Twitter,
    },
    settings.discord && {
      name: "Discord",
      url: `https://discord.com/users/${settings.discord}`,
      icon: MessageCircle,
    },
    settings.spotify && {
      name: "Spotify",
      url: settings.spotify,
      icon: Music,
    },
    settings.buyMeACoffee && {
      name: "Buy Me a Coffee",
      url: settings.buyMeACoffee,
      icon: Coffee,
    },
  ].filter(Boolean) as LinkCard[];

  return (
    <SectionWrapper className="min-h-screen py-16">
      <div className="max-w-xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-center mb-10"
        >
          {/* Profile Image */}
          <div className="mb-5">
            <img
              src={settings.profileImage}
              alt={settings.fullName}
              className="w-28 h-28 rounded-full mx-auto border border-theme-border object-cover bg-theme-surface"
            />
          </div>

          {/* Name */}
          <h1 className="heading-1 text-theme-accent mb-2">
            {settings.fullName}
          </h1>
        </motion.div>

        {/* Links Grid */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 surface-card"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-5 surface-card card-hover"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-theme-subtle text-theme-muted group-hover:text-theme-accent transition-colors">
                      <link.icon size={20} />
                    </div>
                    <span className="text-base font-medium text-theme-text">{link.name}</span>
                  </div>
                  <ExternalLink size={18} className="text-theme-muted group-hover:text-theme-accent transition-colors" />
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Support note */}
        {settings.buyMeACoffee && (
          <div className="mt-10 text-center">
            <p className="text-theme-muted text-sm mb-3">☕ Support my work</p>
            <div className="inline-block">
              <Coffee size={24} className="text-theme-muted mx-auto" />
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};
