import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../lib/mongodb.js';
import Settings from '../../lib/models/Settings.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { OTP } from '../../lib/models/OTP.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login handler
async function handleLogin(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminPasswordHash) {
    return res.status(500).json({ error: 'Admin password not configured' });
  }

  const isValid = await bcrypt.compare(password, adminPasswordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.status(200).json({ success: true, message: 'Password verified' });
}

// Send OTP handler
async function handleSendOTP(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  try {
    const settings = await Settings.findOne({});
    if (!settings || !settings.email) {
      return res.status(400).json({ error: 'Admin email not configured' });
    }

    const email = settings.email;
    const otp = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ email, otp, expiresAt });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your Admin Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Admin Login Verification</h2>
          <p>Your OTP code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #10b981;">
            ${otp}
          </div>
          <p style="color: #6b7280; margin-top: 20px;">This code will expire in 5 minutes.</p>
          <p style="color: #6b7280;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);
    return res.status(200).json({ success: true, email: maskedEmail });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to send OTP: ' + error.message });
  }
}

// Verify OTP handler
async function handleVerifyOTP(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    const otpRecord = await OTP.findOne({
      otp: otp.toUpperCase(),
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '4h' });

    res.setHeader('Set-Cookie', `admin_token=${token}; HttpOnly; Path=/; Max-Age=14400; SameSite=Strict`);

    return res.status(200).json({
      success: true,
      token,
      expiresIn: 14400,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to verify OTP: ' + error.message });
  }
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  switch (action) {
    case 'login':
      return handleLogin(req, res);
    case 'send-otp':
      return handleSendOTP(req, res);
    case 'verify-otp':
      return handleVerifyOTP(req, res);
    default:
      return res.status(400).json({ error: 'Invalid action' });
  }
}
