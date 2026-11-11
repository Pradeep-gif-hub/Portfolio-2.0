import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { Badge } from "../components/ui/Badge";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { Code2,Code, Target, User, Gamepad2, Cpu, Github, Camera, Music, Award, ExternalLink, Link2 } from "lucide-react";
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
    { name: "Playing Cricket", icon: Gamepad2 },
    { name: "Experimenting with new tech tools", icon: Cpu },
    { name: "Always keen for Open source contribution", icon: Github },
    { name: "Connecting to New People", icon: User},
    { name: "Watching Documentary", icon: Camera },
    { name: "Playing Free Fire", icon: Music },
  ];

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "About", path: "/about" }]} />
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
            <p className="mt-4 text-theme-muted">Loading...</p>
          </div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-12"
        >
          <h1 className="heading-1 mb-8">{"< About Me />"}</h1>

          {/* Professional Summary */}
          <div className="surface-card p-6 md:p-8 mb-6">
            <div className="flex items-start gap-4 mb-2">
              <User size={28} className="text-theme-accent flex-shrink-0 mt-1" />
              <div>
                <h2 className="heading-3 mb-3">Professional Summary</h2>
                <div className="space-y-4 text-theme-muted text-base leading-relaxed">
                  <p>{settings.bio}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* What I Do */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="surface-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <Code2 size={24} className="text-theme-accent" />
                <h2 className="heading-3">What I Do</h2>
              </div>
              <ul className="space-y-3">
                {whatIDo.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-theme-muted text-sm">
                    <span className="w-1.5 h-1.5 bg-theme-accent rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Focus Areas */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="surface-card p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <Target size={24} className="text-theme-accent" />
                <h2 className="heading-3">Focus Areas</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 bg-theme-accent-soft border border-theme-border-strong rounded-[999px] text-xs font-medium text-theme-accent"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* My Links Card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate('/links')}
            className="surface-card p-6 md:p-8 mb-6 card-hover group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-theme-accent-soft rounded-lg">
                  <Link2 size={26} className="text-theme-accent" />
                </div>
                <div>
                  <h2 className="heading-3 mb-1 group-hover:text-theme-accent transition-colors">Link-Tree</h2>
                  <p className="text-theme-muted text-sm">Connect with me on all Social platforms</p>
                </div>
              </div>
              <ExternalLink size={20} className="text-theme-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Achievements Section */}
          {settings.achievements && settings.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="surface-card p-6 md:p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <Award size={24} className="text-theme-accent" />
                <h2 className="heading-3">Achievements & Highlights</h2>
              </div>
              <ul className="grid md:grid-cols-2 gap-3">
                {settings.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-theme-muted text-sm p-3 rounded-lg bg-theme-subtle border border-theme-border-strong/60"
                  >
                    <span className="text-theme-accent mt-0.5">🏆</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="surface-card p-6 md:p-8 mb-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <Award size={24} className="text-theme-accent" />
                <h2 className="heading-3">Certifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <Link
                    key={cert._id}
                    to={`/certification/${cert._id}`}
                    className="block group"
                  >
                    <div className="bg-theme-subtle border border-theme-border-strong/80 rounded-[12px] p-4 hover:border-theme-accent/70 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-theme-text group-hover:text-theme-accent transition-colors text-sm">
                          {cert.title}
                        </h3>
                        <ExternalLink
                          size={15}
                          className="text-theme-accent opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        />
                      </div>
                      <p className="text-theme-muted text-xs mb-2">{cert.issuer}</p>
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
                  className="text-theme-accent hover:underline inline-flex items-center gap-2 text-sm font-medium"
                >
                  View All Certifications
                  <ExternalLink size={15} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Beyond Code - Hobbies & Interests */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="surface-card p-6 md:p-8"
          >
            <div className="flex items-start gap-4">
              <Code size={24} className="text-theme-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="heading-3 mb-4">Beyond Code</h2>
                <div className="flex flex-wrap gap-2.5">
                  {hobbiesAndInterests.map((hobby, idx) => {
                    const Icon = hobby.icon;
                    return (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 bg-theme-accent-soft border border-theme-border-strong rounded-[999px] text-xs font-medium text-theme-accent flex items-center gap-2"
                      >
                        <Icon size={14} className="text-theme-accent" />
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
