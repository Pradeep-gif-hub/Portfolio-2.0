import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
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
  ogImage?: string;
  canonicalUrl: string;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    tldr: { type: String, required: true },
    author: { type: String, required: true },
    authorAvatar: { type: String },
    content: { type: String, required: true },
    tags: [{ type: String }],
    keyTakeaways: [{ type: String }],
    references: [{ 
      title: { type: String },
      url: { type: String }
    }],
    cta: {
      text: { type: String },
      link: { type: String }
    },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    ogImage: { type: String },
    canonicalUrl: { type: String, required: true },
    readTime: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
