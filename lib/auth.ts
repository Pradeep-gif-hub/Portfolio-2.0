import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyAuth(req: VercelRequest): boolean {
  console.log('🔐 verifyAuth called');
  console.log('📋 Authorization header:', req.headers.authorization);
  console.log('🍪 Cookie header:', req.headers.cookie);
  console.log('🔑 JWT_SECRET exists:', !!JWT_SECRET);
  
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('🎫 Found Bearer token (length):', token.length);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ Token verified successfully:', decoded);
        return true;
      } catch (e) {
        console.error('❌ Token verification failed:', e);
        throw e;
      }
    }

    // Check cookie
    const cookies = req.headers.cookie?.split(';').map(c => c.trim());
    const adminCookie = cookies?.find(c => c.startsWith('admin_token='));
    
    if (adminCookie) {
      const token = adminCookie.split('=')[1];
      jwt.verify(token, JWT_SECRET);
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

export function authMiddleware(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (!verifyAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return handler(req, res);
  };
}
