import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/mongodb.js';
import Blog from '../lib/models/Blog.js';
import Certification from '../lib/models/Certification.js';
import Experience from '../lib/models/Experience.js';
import Gallery from '../lib/models/Gallery.js';
import Project from '../lib/models/Project.js';
import Settings from '../lib/models/Settings.js';
import Tool from '../lib/models/Tool.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, id } = req.query;

  try {
    await connectDB();

    switch (type) {
      case 'blogs':
        if (id) {
          const blog = await Blog.findOne({ slug: id });
          return res.status(200).json({ success: true, data: blog });
        }
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: blogs });

      case 'certifications':
        const certifications = await Certification.find({}).sort({ year: -1 });
        return res.status(200).json({ success: true, data: certifications });

      case 'experience':
        const experiences = await Experience.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: experiences });

      case 'gallery':
        const gallery = await Gallery.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: gallery });

      case 'projects':
        if (id) {
          const project = await Project.findOne({ slug: id });
          return res.status(200).json({ success: true, data: project });
        }
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: projects });

      case 'settings':
        const settings = await Settings.findOne({});
        return res.status(200).json({ success: true, data: settings });

      case 'tools':
        const homepage = req.query.homepage === 'true';
        let toolQuery: any = {};
        if (homepage) {
          toolQuery.showOnHomepage = true;
        }
        const tools = await Tool.find(toolQuery).sort({ order: 1, name: 1 });
        return res.status(200).json({ success: true, data: tools });

      default:
        return res.status(400).json({ error: 'Invalid type parameter' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
