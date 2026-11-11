import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Github, Linkedin, Twitter, Coffee } from "lucide-react";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Button } from "../ui/Button";

import { SpotifyNowPlaying } from "./SpotifyNowPlaying";

interface Settings {
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  buyMeACoffee?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};



export const Contact: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    email: 'contact@example.com',
    phone: '',
    github: '',
    linkedin: '',
    twitter: '',
    buyMeACoffee: '',
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
        email: data.email || 'contact@example.com',
        phone: data.phone || '',
        github: data.github || '',
        linkedin: data.linkedin || '',
        twitter: data.twitter || '',
        buyMeACoffee: data.buyMeACoffee || '',
      });
    } catch (error) {
      // Error occurred while fetching settings
    } finally {
      setLoading(false);
    }
  };
  return (
    <SectionWrapper id="contact">
      {loading ? (
        <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
          <div className="space-y-6">
            <div className="h-9 bg-theme-subtle rounded w-3/4"></div>
            <div className="h-5 bg-theme-subtle rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-theme-subtle rounded"></div>
              <div className="h-4 bg-theme-subtle rounded w-11/12"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-11 bg-theme-subtle rounded-lg w-40"></div>
              <div className="h-11 bg-theme-subtle rounded-lg w-44"></div>
            </div>
          </div>
          <div className="h-96 surface-card"></div>
        </div>
      ) : (
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h2 className="heading-2 mb-3">Let&apos;s Work Together</h2>
            <p className="text-theme-muted text-base">
              Have a project in mind? Let&apos;s talk about it.
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-theme-muted mb-8 leading-relaxed"
          >
            I&apos;m always interested in hearing about new projects and opportunities.
            Feel free to reach out if you want to collaborate or just say hi!
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                // Detect if user is on mobile device
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                
                if (isMobile) {
                  // On mobile, use mailto: to open native email app
                  window.location.href = `mailto:${settings.email}`;
                } else {
                  // On desktop, open Gmail compose in new tab
                  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${settings.email}`, '_blank');
                }
              }}
            >
              <Mail size={18} className="mr-2" />
              Send me an email
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open(`https://wa.me/${settings.phone ? settings.phone.replace(/\D/g, '') : ''}`, '_blank')}
            >
              <MessageCircle size={18} className="mr-2" />
              Contact on WhatsApp
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-theme-muted text-sm mt-6"
          >
            Usually respond within 24 hours
          </motion.p>

          {/* Spotify Now Playing */}
          <motion.div variants={itemVariants} className="mt-8">
            <SpotifyNowPlaying />
          </motion.div>
        </motion.div>

        {/* Right Side - Social Icons */}
        <motion.div 
          className="relative h-96 hidden lg:block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Social Icons Scattered */}
          {settings.github && (
            <motion.a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                transform: 'rotate(-8deg)',
              }}
              className="surface-card p-5 card-hover"
              title="GitHub"
            >
              <Github size={28} className="text-theme-accent" />
            </motion.a>
          )}
          
          {settings.linkedin && (
            <motion.a
              href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '30%',
                left: '70%',
                transform: 'rotate(8deg)',
              }}
              className="surface-card p-5 card-hover"
              title="LinkedIn"
            >
              <Linkedin size={28} className="text-theme-accent" />
            </motion.a>
          )}
          
          {settings.twitter && (
            <motion.a
              href={settings.twitter}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '60%',
                left: '15%',
                transform: 'rotate(6deg)',
              }}
              className="surface-card p-5 card-hover"
              title="Twitter"
            >
              <Twitter size={28} className="text-theme-accent" />
            </motion.a>
          )}
          
          {settings.email && (
            <motion.a
              href={`mailto:${settings.email}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '75%',
                left: '65%',
                transform: 'rotate(-6deg)',
              }}
              className="surface-card p-5 card-hover"
              title="Email"
            >
              <Mail size={28} className="text-theme-accent" />
            </motion.a>
          )}
          
          {/* Sponsor Icon */}
          {settings.buyMeACoffee && (
            <motion.a
              href={settings.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '45%',
                left: '45%',
              }}
              className="surface-card p-5 card-hover"
              title="Buy Me a Coffee"
            >
              <Coffee size={28} className="text-theme-accent" />
            </motion.a>
          )}
        </motion.div>
      </div>
      )}
    </SectionWrapper>
  );
};