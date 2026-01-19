
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../lib/mongodb.js';
import { Exploring } from '../lib/models/Exploring.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Parse limit query parameter
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    // Query only active items, sorted by order
    let query = Exploring.find({ isActive: true }).sort({ order: 1 });

    if (limit && limit > 0) {
      query = query.limit(limit);
    }

    const items = await query.lean();

    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching exploring items:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch exploring items',
    });
  }
}
