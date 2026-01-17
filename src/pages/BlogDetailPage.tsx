import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb } from "../components/ui/Breadcrumb";
import { ArrowLeft, Calendar, Clock, User, Tag, ExternalLink, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useState, useEffect } from "react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  tldr: string;
  author: string;
  authorAvatar?: string;
  content: string;
  tags: string[];
  keyTakeaways: string[];
  references: { title: string; url: string }[];
  cta: { text: string; link: string };
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  readTime: number;
  createdAt: string;
}

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/public-data?type=blogs&id=${slug}`);
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        // Failed to fetch blog
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog post not found</h1>
          <Button onClick={() => navigate("/")} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Simple markdown-to-HTML converter for code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const codeMatch = part.match(/```(\w+)?\n([\s\S]*?)```/);
        if (codeMatch) {
          const [, language = "code", code] = codeMatch;
          return (
            <div key={index} className="relative group mb-6">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={() => copyToClipboard(code, index)}
                  className="p-2 rounded-lg bg-dark-600/80 hover:bg-dark-500 transition-colors"
                  title="Copy code"
                >
                  {copiedCode === index ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} className="text-text-secondary" />
                  )}
                </button>
              </div>
              <div className="bg-dark-700 rounded-xl p-6 overflow-x-auto">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs text-text-secondary font-mono ml-2">
                    {language}
                  </span>
                </div>
                <pre className="text-sm font-mono text-gray-300">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          );
        }
      }
      
      // Regular content parsing
      return part.split("\n").map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h2 key={`${index}-${i}`} className="text-2xl font-bold mt-8 mb-4 text-text-primary dark:text-dark-50">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={`${index}-${i}`} className="text-xl font-bold mt-6 mb-3 text-text-primary dark:text-dark-50">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={`${index}-${i}`} className="ml-6 mb-2 text-text-secondary dark:text-dark-400">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={`${index}-${i}`} />;
        }
        
        // Bold text
        const boldRendered = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent-primary font-semibold">$1</strong>');
        
        return (
          <p 
            key={`${index}-${i}`} 
            className="mb-4 text-text-secondary dark:text-dark-400 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldRendered }}
          />
        );
      });
    });
  };

  return (
    <div className="min-h-screen pb-16">
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
            { label: blog.title, path: `/blog/${blog.slug}` }
          ]} 
        />

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <header className="mb-12 mt-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-text-primary dark:text-dark-50 leading-tight"
            >
              {blog.title}
            </motion.h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 mb-6 text-sm text-text-secondary dark:text-dark-400">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{blog.readTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="accent" className="border-accent-primary">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none mb-12"
          >
            <div className="glass-effect p-8 md:p-12 rounded-xl">
              {renderContent(blog.content)}
            </div>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect p-8 rounded-xl mb-12 glow-accent"
          >
            <h2 className="text-2xl font-bold mb-6 text-text-primary dark:text-dark-50">
              🎯 Key Takeaways
            </h2>
            <ul className="space-y-3">
              {blog.keyTakeaways.map((takeaway, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 text-text-secondary dark:text-dark-400"
                >
                  <Check size={20} className="text-accent-primary mt-1 flex-shrink-0" />
                  <span>{takeaway}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* TL;DR Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect p-6 rounded-xl mb-12 border-l-4 border-accent-primary glow-accent"
          >
            <h2 className="text-lg font-bold mb-2 text-accent-primary flex items-center gap-2">
              <span className="text-2xl">⚡</span> TL;DR
            </h2>
            <p className="text-text-secondary dark:text-dark-400 leading-relaxed">
              {blog.tldr}
            </p>
          </motion.div>

          {/* References */}
          {blog.references.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-effect p-8 rounded-xl mb-12"
            >
              <h2 className="text-2xl font-bold mb-6 text-text-primary dark:text-dark-50">
                📚 References & Further Reading
              </h2>
              <ul className="space-y-3">
                {blog.references.map((ref, index) => (
                  <li key={index}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-accent-primary hover:text-accent-secondary transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>{ref.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Author Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-effect p-8 rounded-xl mb-12 glow-accent"
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-primary to-neon-purple flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {blog.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-dark-50">
                  {blog.author}
                </h3>
                <p className="text-text-secondary dark:text-dark-400 leading-relaxed mb-4">
                  Passionate developer and technical writer sharing insights on web development, 
                  software architecture, and best practices.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/about')}
                  className="border-accent-primary text-accent-primary hover:bg-accent-primary/10"
                >
                  Learn more about me
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-effect p-8 rounded-xl text-center glow-accent"
          >
            <h3 className="text-2xl font-bold mb-4 text-text-primary dark:text-dark-50">
              {blog.cta.text}
            </h3>
            <Button
              onClick={() => navigate(blog.cta.link)}
              variant="primary"
              size="lg"
              className="btn-neon"
            >
              {blog.cta.text}
            </Button>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex justify-between items-center"
          >
            <Button
              onClick={() => navigate('/blog')}
              variant="outline"
              className="border-accent-primary text-accent-primary hover:bg-accent-primary/10"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Blog
            </Button>

            <div className="flex gap-3">
              <Button
                as="a"
                href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
              >
                Share on Twitter
              </Button>
              <Button
                as="a"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="sm"
              >
                Share on LinkedIn
              </Button>
            </div>
          </motion.div>
        </motion.article>
      </main>
    </div>
  );
};

export default BlogDetailPage;
