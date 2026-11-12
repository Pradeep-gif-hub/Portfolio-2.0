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
        const result = await response.json();
        const data = result.data || result;
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
      <div className="min-h-screen">
        <main className="container max-w-container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="h-4 bg-theme-subtle rounded w-48 mb-8"></div>
            
            {/* Title skeleton */}
            <div className="h-10 bg-theme-subtle rounded w-3/4 mb-4"></div>
            
            {/* Meta info skeleton */}
            <div className="flex gap-6 mb-6">
              <div className="h-5 bg-theme-subtle rounded w-32"></div>
              <div className="h-5 bg-theme-subtle rounded w-24"></div>
              <div className="h-5 bg-theme-subtle rounded w-28"></div>
            </div>
            
            {/* Tags skeleton */}
            <div className="flex gap-2 mb-8">
              <div className="h-6 bg-theme-subtle rounded-full w-20"></div>
              <div className="h-6 bg-theme-subtle rounded-full w-24"></div>
              <div className="h-6 bg-theme-subtle rounded-full w-16"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4 mb-8">
              <div className="h-4 bg-theme-subtle rounded"></div>
              <div className="h-4 bg-theme-subtle rounded w-11/12"></div>
              <div className="h-4 bg-theme-subtle rounded w-10/12"></div>
              <div className="h-20 bg-theme-subtle rounded mt-6"></div>
              <div className="h-4 bg-theme-subtle rounded mt-6"></div>
              <div className="h-4 bg-theme-subtle rounded w-11/12"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-1 mb-4">Blog post not found</h1>
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
    if (!content) return null;
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
                  className="p-2 rounded-lg bg-theme-surface border border-theme-border hover:border-theme-muted transition-colors"
                  title="Copy code"
                >
                  {copiedCode === index ? (
                    <Check size={16} className="text-theme-accent" />
                  ) : (
                    <Copy size={16} className="text-theme-muted" />
                  )}
                </button>
              </div>
              <div className="bg-theme-surface border border-theme-border-strong rounded-[12px] p-5 overflow-x-auto">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-theme-muted font-mono">
                    {language}
                  </span>
                </div>
                <pre className="text-sm font-mono text-theme-text">
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
            <h2 key={`${index}-${i}`} className="heading-2 mt-8 mb-4">
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3 key={`${index}-${i}`} className="heading-3 mt-6 mb-3">
              {line.replace("### ", "")}
            </h3>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <li key={`${index}-${i}`} className="ml-6 mb-2 text-theme-muted">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={`${index}-${i}`} />;
        }
        
        // Bold text
        const boldRendered = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-theme-text font-semibold">$1</strong>');
        
        return (
          <p 
            key={`${index}-${i}`} 
            className="mb-4 text-theme-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldRendered }}
          />
        );
      });
    });
  };

  return (
    <div className="min-h-screen pb-16">
      <main className="container max-w-container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
            { label: blog.title, path: `/blog/${blog.slug}` }
          ]} 
        />

        <motion.article
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <header className="mb-10 mt-6">
            <h1 className="heading-1 mb-5 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 mb-5 text-sm text-theme-muted">
              <div className="flex items-center gap-2">
                <User size={15} />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={15} />
                <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} />
                <span>{blog.readTime} min read</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="accent">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Main Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
            <div className="surface-card p-6 md:p-10">
              {renderContent(blog.content)}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="surface-card p-6 md:p-8 mb-8">
            <h2 className="heading-3 mb-5">
              🎯 Key Takeaways
            </h2>
            <ul className="space-y-3">
              {blog.keyTakeaways.map((takeaway, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-theme-muted text-sm"
                >
                  <Check size={18} className="text-theme-accent mt-0.5 flex-shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* TL;DR Section */}
          <div className="surface-card p-6 mb-8 border-l-4 border-l-theme-accent">
            <h2 className="text-base font-semibold mb-2 text-theme-accent flex items-center gap-2">
              <span className="text-lg">⚡</span> TL;DR
            </h2>
            <p className="text-theme-muted text-sm leading-relaxed">
              {blog.tldr}
            </p>
          </div>

          {/* References */}
          {blog.references.length > 0 && (
            <div className="surface-card p-6 md:p-8 mb-8">
              <h2 className="heading-3 mb-5">
                📚 References & Further Reading
              </h2>
              <ul className="space-y-3">
                {blog.references.map((ref, index) => (
                  <li key={index}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-theme-accent hover:text-theme-accent-hover transition-colors text-sm"
                    >
                      <ExternalLink size={15} />
                      <span>{ref.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Author Section */}
          <div className="surface-card p-6 md:p-8 mb-10">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-theme-accent-soft border border-theme-border-strong flex items-center justify-center text-lg font-semibold text-theme-accent flex-shrink-0">
                {blog.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="heading-4 mb-2">
                  {blog.author}
                </h3>
                <p className="text-theme-muted text-sm leading-relaxed mb-4">
                  Passionate developer and technical writer sharing insights on web development, 
                  software architecture, and best practices.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/about')}
                >
                  Learn more about me
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-10 flex flex-wrap gap-4 justify-between items-center">
            <Button
              onClick={() => navigate('/blog')}
              variant="outline"
            >
              <ArrowLeft size={17} className="mr-2" />
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
          </div>
        </motion.article>
      </main>
    </div>
  );
};

export default BlogDetailPage;