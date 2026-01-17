import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/mongodb.js';
import Visitor from '../lib/models/Visitor.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get total visitor count across all pages
      const visitors = await Visitor.find();
      const totalCount = visitors.reduce((sum: number, v: any) => sum + v.count, 0);
      
      return res.status(200).json({ 
        totalCount,
        pages: visitors.map((v: any) => ({ path: v.path, count: v.count, lastVisit: v.lastVisit }))
      });
    }

    if (req.method === 'POST') {
      const { path } = req.body;

      if (!path) {
        return res.status(400).json({ error: 'Path is required' });
      }

      // Don't track admin pages
      if (path.startsWith('/admin')) {
        return res.status(200).json({ success: true, tracked: false });
      }

      // Find or create visitor entry for this path
      let visitor = await Visitor.findOne({ path });

      if (visitor) {
        // Increment count
        visitor.count += 1;
        visitor.lastVisit = new Date();
        await visitor.save();
      } else {
        // Create new entry
        visitor = await Visitor.create({
          path,
          count: 1,
          lastVisit: new Date(),
        });
      }

      return res.status(200).json({
        success: true,
        tracked: true,
        path: visitor.path,
        count: visitor.count,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return res.status(500).json({ error: 'Failed to track visitor' });
  }
}
