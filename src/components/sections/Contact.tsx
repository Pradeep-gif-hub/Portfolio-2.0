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

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
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
    }
  };
  return (
    <SectionWrapper id="contact">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="heading-2 mb-4">Let&apos;s Work Together</h2>
            <p className="text-text-secondary text-lg">
              Have a project in mind? Let&apos;s talk about it.
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-text-secondary mb-8 leading-relaxed"
          >
            I&apos;m always interested in hearing about new projects and opportunities.
            Feel free to reach out if you want to collaborate or just say hi!
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                window.open(`mailto:${settings.email}`, "_blank")
              }
            >
              <Mail size={20} className="mr-2" />
              Send me an email
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open(`https://wa.me/${settings.phone ? settings.phone.replace(/\D/g, '') : ''}`, '_blank')}
            >
              <MessageCircle size={20} className="mr-2" />
              Contact on WhatsApp
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-text-tertiary text-sm mt-8"
          >
            Usually respond within 24 hours
          </motion.p>

          {/* Spotify Now Playing */}
          <motion.div variants={itemVariants} className="mt-8">
            <SpotifyNowPlaying />
          </motion.div>
        </motion.div>

        {/* Right Side - Random Social Icons */}
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
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              transition={{ delay: 0.1 }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '20%',
                transform: 'rotate(-15deg)',
              }}
              className="glass-effect p-6 rounded-2xl hover:bg-accent-primary/10 transition-all duration-300 border-2 border-accent-primary/20 hover:border-accent-primary/60"
              title="GitHub"
            >
              <Github size={32} className="text-accent-primary" />
            </motion.a>
          )}
          
          {settings.linkedin && (
            <motion.a
              href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 30 }}
              transition={{ delay: 0.2 }}
              style={{
                position: 'absolute',
                top: '30%',
                left: '70%',
                transform: 'rotate(20deg)',
              }}
              className="glass-effect p-6 rounded-2xl hover:bg-accent-primary/10 transition-all duration-300 border-2 border-accent-primary/20 hover:border-accent-primary/60"
              title="LinkedIn"
            >
              <Linkedin size={32} className="text-accent-primary" />
            </motion.a>
          )}
          
          {settings.twitter && (
            <motion.a
              href={settings.twitter}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 20 }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'absolute',
                top: '60%',
                left: '15%',
                transform: 'rotate(10deg)',
              }}
              className="glass-effect p-6 rounded-2xl hover:bg-accent-primary/10 transition-all duration-300 border-2 border-accent-primary/20 hover:border-accent-primary/60"
              title="Twitter"
            >
              <Twitter size={32} className="text-accent-primary" />
            </motion.a>
          )}
          
          {settings.email && (
            <motion.a
              href={`mailto:${settings.email}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                position: 'absolute',
                top: '75%',
                left: '65%',
                transform: 'rotate(-10deg)',
              }}
              className="glass-effect p-6 rounded-2xl hover:bg-accent-primary/10 transition-all duration-300 border-2 border-accent-primary/20 hover:border-accent-primary/60"
              title="Email"
            >
              <Mail size={32} className="text-accent-primary" />
            </motion.a>
          )}
          
          {/* Sponsor Icon */}
          {settings.buyMeACoffee && (
            <motion.a
              href={settings.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                top: '45%',
                left: '45%',
              }}
              className="glass-effect p-6 rounded-2xl hover:bg-accent-primary/10 transition-all duration-300 border-2 border-accent-primary/20 hover:border-accent-primary/60"
              title="Buy Me a Coffee"
            >
              <Coffee size={32} className="text-accent-primary" />
            </motion.a>
          )}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};
