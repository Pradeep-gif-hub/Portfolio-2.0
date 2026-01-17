const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const mongoose = require('mongoose');

// Settings Schema
const settingsSchema = new mongoose.Schema(
  {
    // Personal Info
    fullName: { type: String, required: true },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    profileImage: { type: String, required: true },
    resumeUrl: { type: String },
    whatIDo: { type: String },
    focusArea: { type: String },
    achievements: [{ type: String }],
    
    // Contact Info
    email: { type: String, required: true },
    phone: { type: String },
    
    // Social Links
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    buyMeACoffee: { type: String },
    discord: { type: String },
    spotify: { type: String },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);

async function initializeSettings() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if settings already exist
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      console.log('⚠️  Settings already exist in database. Skipping initialization.');
      console.log('📋 Current Settings:');
      console.log(JSON.stringify(existingSettings, null, 2));
      await mongoose.disconnect();
      return;
    }

    // Default settings data
    const defaultSettings = {
      fullName: 'Pradeep Awasthi',
      tagline: 'Full Stack Developer | Open Source Enthusiast',
      bio: 'I build beautiful and functional web applications with modern technologies.',
      profileImage: 'https://via.placeholder.com/300',
      resumeUrl: 'https://example.com/resume.pdf',
      whatIDo: 'Building amazing web experiences',
      focusArea: 'Full Stack Development, React, Node.js',
      achievements: [
        '100+ GitHub Projects',
        'Open Source Contributor',
        '5+ Years Experience'
      ],
      email: 'your-email@example.com',
      phone: '+91-XXXXXXXXXX',
      github: 'https://github.com/pradeepawasthi',
      linkedin: 'https://linkedin.com/in/pradeepawasthi',
      twitter: 'https://twitter.com/pradeepawasthi',
      buyMeACoffee: 'https://buymeacoffee.com/pradeepawasthi',
      discord: 'https://discord.com/users/your-id',
      spotify: 'https://open.spotify.com/user/your-spotify-id'
    };

    // Create and save settings
    const settings = new Settings(defaultSettings);
    await settings.save();

    console.log('✅ Settings initialized successfully!');
    console.log('📋 Created Settings:');
    console.log(JSON.stringify(settings, null, 2));

    await mongoose.disconnect();
    console.log('🔒 Connection closed');
  } catch (error) {
    console.error('❌ Error initializing settings:', error.message);
    process.exit(1);
  }
}

initializeSettings();
