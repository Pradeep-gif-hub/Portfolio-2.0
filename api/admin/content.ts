import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../lib/mongodb.js';
import Blog from '../../lib/models/Blog.js';
import Certification from '../../lib/models/Certification.js';
import Experience from '../../lib/models/Experience.js';
import Gallery from '../../lib/models/Gallery.js';
import Project from '../../lib/models/Project.js';
import Settings from '../../lib/models/Settings.js';
import Tool from '../../lib/models/Tool.js';
import { verifyAuth } from '../../lib/auth.js';

async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify authentication
  const isValid = verifyAuth(req);
  if (!isValid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await connectDB();

  const { type } = req.query;

  // Route to appropriate model handler
  switch (type) {
    case 'blogs':
      return handleBlogs(req, res);
    case 'certifications':
      return handleCertifications(req, res);
    case 'experience':
      return handleExperience(req, res);
    case 'gallery':
      return handleGallery(req, res);
    case 'projects':
      return handleProjects(req, res);
    case 'settings':
      return handleSettings(req, res);
    case 'tools':
      return handleTools(req, res);
    default:
      return res.status(400).json({ error: 'Invalid type parameter' });
  }
}

// Blogs handler
async function handleBlogs(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: blogs });
  }

  if (req.method === 'POST') {
    const blog = await Blog.create(req.body);
    return res.status(201).json({ success: true, data: blog });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const blog = await Blog.findByIdAndUpdate(id, updates, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    return res.status(200).json({ success: true, data: blog });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Certifications handler
async function handleCertifications(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const certifications = await Certification.find({}).sort({ year: -1 });
    return res.status(200).json({ success: true, data: certifications });
  }

  if (req.method === 'POST') {
    const certification = await Certification.create(req.body);
    return res.status(201).json({ success: true, data: certification });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const certification = await Certification.findByIdAndUpdate(id, updates, { new: true });
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    return res.status(200).json({ success: true, data: certification });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const certification = await Certification.findByIdAndDelete(id);
    if (!certification) return res.status(404).json({ error: 'Certification not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Experience handler
async function handleExperience(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const experiences = await Experience.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: experiences });
  }

  if (req.method === 'POST') {
    const experience = await Experience.create(req.body);
    return res.status(201).json({ success: true, data: experience });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const experience = await Experience.findByIdAndUpdate(id, updates, { new: true });
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    return res.status(200).json({ success: true, data: experience });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Gallery handler
async function handleGallery(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const gallery = await Gallery.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: gallery });
  }

  if (req.method === 'POST') {
    const item = await Gallery.create(req.body);
    return res.status(201).json({ success: true, data: item });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const item = await Gallery.findByIdAndUpdate(id, updates, { new: true });
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    return res.status(200).json({ success: true, data: item });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const item = await Gallery.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ error: 'Gallery item not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Projects handler
async function handleProjects(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  }

  if (req.method === 'POST') {
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, data: project });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const project = await Project.findByIdAndUpdate(id, updates, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json({ success: true, data: project });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Settings handler
async function handleSettings(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const settings = await Settings.findOne({});
    return res.status(200).json({ success: true, data: settings });
  }

  if (req.method === 'PUT') {
    const settings = await Settings.findOneAndUpdate({}, req.body, { 
      new: true, 
      upsert: true 
    });
    return res.status(200).json({ success: true, data: settings });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Tools handler
async function handleTools(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const tools = await Tool.find({}).sort({ name: 1 });
    return res.status(200).json({ success: true, data: tools });
  }

  if (req.method === 'POST') {
    const tool = await Tool.create(req.body);
    return res.status(201).json({ success: true, data: tool });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    const tool = await Tool.findByIdAndUpdate(id, updates, { new: true });
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    return res.status(200).json({ success: true, data: tool });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const tool = await Tool.findByIdAndDelete(id);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default handler;
