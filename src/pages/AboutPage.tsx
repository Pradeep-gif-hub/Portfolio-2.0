import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Badge } from "../components/ui/Badge";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { Code2, Lightbulb, Target, User, Gamepad2, Cpu, Github, PenTool, Camera, Music, Award, ExternalLink, Link2 } from "lucide-react";
import { fetchCertifications } from "../utils/api";

interface Settings {
  fullName: string;
  bio: string;
  whatIDo?: string;
  focusArea?: string;
  achievements?: string[];
}

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  year: number;
  month?: string;
  link?: string;
  image?: string;
  skills: string[];
  difficulty: string;
  duration?: string;
  projectBased: boolean;
}

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    fullName: '',
    bio: '',
    whatIDo: '',
    focusArea: '',
    achievements: [],
  });
  
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    loadCertifications();
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
        bio: data.bio || 'Add your bio here',
        whatIDo: data.whatIDo || '',
        focusArea: data.focusArea || '',
        achievements: data.achievements || [],
      });
    } catch (error) {
      // Error occurred while fetching settings
    } finally {
      setLoading(false);
    }
  };

  const loadCertifications = async () => {
    try {
      const data = await fetchCertifications();
      setCertifications(Array.isArray(data) ? data.slice(0, 4) : []);
    } catch (error) {
      // Error occurred while fetching certifications
    }
  };

  const defaultWhatIDo = [
    "Build modern web applications",
    "Design clean, scalable UI systems",
    "Work with REST APIs and databases",
    "Deploy and maintain production apps",
  ];

  const defaultFocusAreas = [
    "Full Stack Development",
    "UI/UX Engineering",
    "AI-assisted tooling",
    "Performance optimization",
    "Open-source contribution",
  ];

  // Parse What I Do - handle both line breaks and commas
  const whatIDo = settings.whatIDo && settings.whatIDo.trim()
    ? settings.whatIDo.includes('\n') 
      ? settings.whatIDo.split('\n').filter(line => line.trim())
      : settings.whatIDo.split(',').map(item => item.trim()).filter(item => item)
    : defaultWhatIDo;

  // Parse Focus Areas - handle both commas and line breaks
  const focusAreas = settings.focusArea && settings.focusArea.trim()
    ? settings.focusArea.includes(',')
      ? settings.focusArea.split(',').map(area => area.trim()).filter(area => area)
      : settings.focusArea.split('\n').map(area => area.trim()).filter(area => area)
    : defaultFocusAreas;

  const hobbiesAndInterests = [
    { name: "Gaming", icon: Gamepad2 },
    { name: "Experimenting with new tech tools", icon: Cpu },
    { name: "Open source contribution", icon: Github },
    { name: "Technical writing", icon: PenTool },
    { name: "Photography", icon: Camera },
    { name: "Music", icon: Music },
  ];

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "About", path: "/about" }]} />
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading...</p>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-1 mb-8">{"< About Me />"}</h1>

          {/* Professional Summary */}
          <div className="glass-effect p-8 rounded-xl mb-8">
            <div className="flex items-start gap-4 mb-4">
              <User size={32} className="text-accent-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="heading-3 mb-4">Professional Summary</h2>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                  <p>{settings.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* What I Do */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect p-8 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Code2 size={28} className="text-accent-primary" />
                <h2 className="heading-3">What I Do</h2>
              </div>
              <ul className="space-y-3">
                {whatIDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Focus Areas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect p-8 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target size={28} className="text-accent-primary" />
                <h2 className="heading-3">Focus Areas</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-dark-900/80 backdrop-blur-sm rounded-xl border border-accent-primary/20 text-sm text-gray-300"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* My Links Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => navigate('/links')}
            className="glass-effect p-8 rounded-xl mb-8 cursor-pointer hover:border-accent-primary/50 border border-accent-primary/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-accent-primary/20 to-neon-purple/20 rounded-xl group-hover:scale-110 transition-transform">
                  <Link2 size={32} className="text-accent-primary" />
                </div>
                <div>
                  <h2 className="heading-3 mb-2 group-hover:text-accent-primary transition-colors">My Links</h2>
                  <p className="text-text-secondary">Connect with me on all platforms</p>
                </div>
              </div>
              <ExternalLink size={24} className="text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Achievements Section */}
          {settings.achievements && settings.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect p-8 rounded-xl mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award size={28} className="text-accent-primary" />
                <h2 className="heading-3">Achievements & Highlights</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-4">
                {settings.achievements.map((achievement, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="flex items-start gap-3 text-gray-300 p-3 rounded-lg hover:bg-dark-900/50 transition-colors"
                  >
                    <span className="text-accent-primary mt-1">🏆</span>
                    <span>{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect p-8 rounded-xl mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award size={28} className="text-accent-primary" />
                <h2 className="heading-3">Certifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <Link
                    key={cert._id}
                    to={`/certification/${cert._id}`}
                    className="block group"
                  >
                    <div className="bg-dark-900/50 border border-accent-primary/20 rounded-lg p-4 hover:border-accent-primary/50 transition-all">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-white group-hover:text-accent-primary transition-colors">
                          {cert.title}
                        </h3>
                        <ExternalLink
                          size={16}
                          className="text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        />
                      </div>
                      <p className="text-text-secondary text-sm mb-2">{cert.issuer}</p>
                      <Badge variant="accent" className="text-xs">
                        {cert.month ? `${cert.month} ${cert.year}` : cert.year}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link
                  to="/certifications"
                  className="text-accent-primary hover:underline inline-flex items-center gap-2"
                >
                  View All Certifications
                  <ExternalLink size={16} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Beyond Code - Hobbies & Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect p-8 rounded-xl"
          >
            <div className="flex items-start gap-4">
              <Lightbulb size={28} className="text-accent-primary flex-shrink-0" />
              <div className="flex-1">
                <h2 className="heading-3 mb-4">Beyond Code</h2>
                <div className="flex flex-wrap gap-3">
                  {hobbiesAndInterests.map((hobby, idx) => {
                    const Icon = hobby.icon;
                    return (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-dark-900/80 backdrop-blur-sm rounded-xl border border-accent-primary/20 text-sm text-gray-300 flex items-center gap-2"
                      >
                        <Icon size={16} className="text-accent-primary" />
                        {hobby.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        )}
      </SectionWrapper>
    </div>
  );
};
