
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../lib/mongodb.js';
import { Exploring } from '../../lib/models/Exploring.js';
import { verifyAuth } from '../../lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Verify authentication
    const isAuthenticated = verifyAuth(req);
    if (!isAuthenticated) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await connectDB();

    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'PUT':
        return await handlePut(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      case 'PATCH':
        return await handlePatch(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Admin exploring API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET - List all exploring items (including inactive)
async function handleGet(req: VercelRequest, res: VercelResponse) {
  try {
    const items = await Exploring.find().sort({ order: 1 }).lean();
    return res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching exploring items:', error);
    return res.status(500).json({ error: 'Failed to fetch items' });
  }
}

// POST - Create new exploring item
async function handlePost(req: VercelRequest, res: VercelResponse) {
  try {
    const { title, description, isActive, order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newItem = await Exploring.create({
      title,
      description: description || undefined,
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    return res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating exploring item:', error);
    return res.status(500).json({ error: 'Failed to create item' });
  }
}

// PUT - Update exploring item
async function handlePut(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    const { title, description, isActive, order } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const updatedItem = await Exploring.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating exploring item:', error);
    return res.status(500).json({ error: 'Failed to update item' });
  }
}

// DELETE - Delete exploring item
async function handleDelete(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    const deletedItem = await Exploring.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting exploring item:', error);
    return res.status(500).json({ error: 'Failed to delete item' });
  }
}

// PATCH - Toggle active status
async function handlePatch(req: VercelRequest, res: VercelResponse) {
  try {
    const { id, action } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Item ID is required' });
    }

    if (action === 'toggle') {
      const item = await Exploring.findById(id);
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      item.isActive = !item.isActive;
      await item.save();

      return res.status(200).json({
        success: true,
        data: item,
      });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Error toggling exploring item:', error);
    return res.status(500).json({ error: 'Failed to toggle item' });
  }
}
