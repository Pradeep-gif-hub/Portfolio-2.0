"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { blogPosts } from "../../data/blog";
import { Badge } from "../ui/Badge";
import { SectionWrapper } from "../layout/SectionWrapper";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

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

export const BlogPreview: React.FC = () => {
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <SectionWrapper id="blog">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="heading-2 mb-4">Latest Articles</h2>
        <p className="text-text-secondary text-lg">
          Thoughts on development, design, and tech
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {recentPosts.map((post) => (
          <motion.div
            key={post.id}
            variants={itemVariants}
          >
            <Link to={`/blog/${post.slug}`} className="block h-full">
              <article className="bg-bg-secondary border border-bg-tertiary rounded-lg p-6 hover:border-accent-primary/50 transition-smooth group cursor-pointer h-full">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="dark">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Badge>
                  <span className="text-text-secondary text-xs">
                    {Math.ceil(post.content.split(/\s+/).length / 200)} min read
                  </span>
                </div>

                <h3 className="heading-4 mb-2 group-hover:text-accent-primary transition-smooth">
                  {post.title}
                </h3>

                <p className="text-text-secondary mb-4 line-clamp-2">
                  {post.content.substring(0, 150)}...
                </p>

                <div className="flex items-center text-accent-primary text-sm font-medium group-hover:gap-2 transition-all">
                  Read More
                  <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Button variant="outline" as={Link} to="/">
          Read All Articles
          <ArrowRight size={16} className="ml-2 inline" />
        </Button>
      </motion.div>
    </SectionWrapper>
  );
};
