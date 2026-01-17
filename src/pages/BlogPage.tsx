import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { SectionWrapper } from "../components/layout/SectionWrapper";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  author: string;
  readTime: number;
  createdAt: string;
  tags: string[];
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/public-data?type=blogs');
        const result = await response.json();
        const data = result.data || result;
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        // Failed to fetch blogs
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SectionWrapper>
        <Breadcrumb items={[{ label: "Home", path: "/" }, { label: "Blog", path: "/blog" }]} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="heading-1 mb-4">Blog</h1>
          <p className="text-text-secondary text-lg">
            Thoughts on development, design, and technology
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search blogs by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-white"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredBlogs.map((blog) => (
            <motion.div key={blog._id} variants={itemVariants}>
              <Link to={`/blog/${blog.slug}`}>
                <Card hoverable className="h-full">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="heading-4 flex-1">{blog.title}</h3>
                  </div>
                  
                  <p className="text-text-secondary mb-4">{blog.summary}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>
    </div>
  );
};
