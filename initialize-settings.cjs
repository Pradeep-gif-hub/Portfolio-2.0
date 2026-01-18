/**
 * Initialize Settings Script
 * 
 * This script helps you set up your portfolio settings for the first time.
 * It will ask for your basic information and create the settings document in MongoDB.
 * 
 * Run this after cloning the repository and setting up your environment variables.
 * 
 * Usage: node initialize-settings.cjs
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const readline = require('readline');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  console.error('Please set up your .env.local file first.');
  process.exit(1);
}

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  tagline: { type: String, required: true },
  bio: { type: String, required: true },
  profileImage: { type: String, required: true },
  resumeUrl: { type: String },
  whatIDo: { type: String },
  focusArea: { type: String },
  achievements: [{ type: String }],
  email: { type: String, required: true },
  phone: { type: String },
  github: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  buyMeACoffee: { type: String },
  discord: { type: String },
  spotify: { type: String },
}, { timestamps: true });

const Settings = mongoose.model('Settings', SettingsSchema);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate URL format
function isValidUrl(url) {
  if (!url) return true; // Optional fields
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Main function
async function initializeSettings() {
  console.log('\n🎨 Portfolio Settings Initialization\n');
  console.log('This script will help you set up your portfolio settings.');
  console.log('You can update these later from the admin panel.\n');
  console.log('━'.repeat(50));
  console.log('\n');

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if settings already exist
    const existingSettings = await Settings.findOne();
    if (existingSettings) {
      console.log('⚠️  Settings already exist in the database!');
      console.log('\nCurrent settings:');
      console.log(`   Name: ${existingSettings.fullName}`);
      console.log(`   Email: ${existingSettings.email}`);
      console.log(`   Tagline: ${existingSettings.tagline}\n`);
      
      const overwrite = await question('Do you want to overwrite existing settings? (yes/no): ');
      if (overwrite.toLowerCase() !== 'yes' && overwrite.toLowerCase() !== 'y') {
        console.log('\n✋ Keeping existing settings. Exiting...');
        rl.close();
        await mongoose.connection.close();
        process.exit(0);
      }
      console.log('');
    }

    // Collect user information
    console.log('📝 Personal Information\n');
    
    const fullName = await question('Full Name (e.g., John Doe): ');
    if (!fullName.trim()) {
      throw new Error('Full name is required');
    }

    const tagline = await question('Tagline (e.g., Full Stack Developer | UI/UX Enthusiast): ');
    if (!tagline.trim()) {
      throw new Error('Tagline is required');
    }

    const bio = await question('Short Bio (2-3 sentences about yourself): ');
    if (!bio.trim()) {
      throw new Error('Bio is required');
    }

    console.log('\n📧 Contact Information\n');
    
    let email = '';
    while (!email) {
      email = await question('Email Address (REQUIRED for 2FA and contact form): ');
      if (!email.trim()) {
        console.log('❌ Email is required!');
        email = '';
      } else if (!isValidEmail(email)) {
        console.log('❌ Please enter a valid email address');
        email = '';
      }
    }

    const phone = await question('Phone Number (optional, for WhatsApp): ');

    console.log('\n🔗 Social Links (optional, press Enter to skip)\n');
    
    let github = await question('GitHub Profile URL: ');
    if (github && !isValidUrl(github)) {
      console.log('⚠️  Invalid URL, skipping...');
      github = '';
    }

    let linkedin = await question('LinkedIn Profile URL: ');
    if (linkedin && !isValidUrl(linkedin)) {
      console.log('⚠️  Invalid URL, skipping...');
      linkedin = '';
    }

    let twitter = await question('Twitter/X Profile URL: ');
    if (twitter && !isValidUrl(twitter)) {
      console.log('⚠️  Invalid URL, skipping...');
      twitter = '';
    }

    console.log('\n🎨 Additional Information (optional)\n');
    
    let profileImage = await question('Profile Image URL (or press Enter for default): ');
    if (!profileImage.trim()) {
      profileImage = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName) + '&size=256&background=6366f1&color=fff';
    }

    const resumeUrl = await question('Resume/CV URL (optional): ');
    const whatIDo = await question('What I Do (optional description): ');
    const buyMeACoffee = await question('Buy Me A Coffee URL (optional): ');

    // Create settings object
    const settingsData = {
      fullName: fullName.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      profileImage: profileImage.trim(),
      resumeUrl: resumeUrl.trim() || undefined,
      whatIDo: whatIDo.trim() || undefined,
      github: github.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      twitter: twitter.trim() || undefined,
      buyMeACoffee: buyMeACoffee.trim() || undefined,
    };

    console.log('\n━'.repeat(50));
    console.log('\n📋 Review Your Settings:\n');
    console.log(`   Name:     ${settingsData.fullName}`);
    console.log(`   Email:    ${settingsData.email}`);
    console.log(`   Tagline:  ${settingsData.tagline}`);
    console.log(`   Phone:    ${settingsData.phone || 'Not provided'}`);
    console.log(`   GitHub:   ${settingsData.github || 'Not provided'}`);
    console.log(`   LinkedIn: ${settingsData.linkedin || 'Not provided'}`);
    console.log(`   Twitter:  ${settingsData.twitter || 'Not provided'}`);
    console.log('\n━'.repeat(50));
    
    const confirm = await question('\n✅ Save these settings to database? (yes/no): ');
    
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('\n❌ Settings not saved. Exiting...');
      rl.close();
      await mongoose.connection.close();
      process.exit(0);
    }

    // Save to database
    console.log('\n💾 Saving settings to database...');
    
    if (existingSettings) {
      await Settings.findByIdAndUpdate(existingSettings._id, settingsData);
      console.log('✅ Settings updated successfully!');
    } else {
      await Settings.create(settingsData);
      console.log('✅ Settings created successfully!');
    }

    console.log('\n🎉 Setup Complete!\n');
    console.log('Next steps:');
    console.log('  1. Run "npm run dev" to start the development server');
    console.log('  2. Visit http://localhost:5173/admin/login to access admin panel');
    console.log('  3. Log in with your VITE_ADMIN_PASSWORD');
    console.log('  4. Configure 2FA with the email you just set up');
    console.log('  5. Start customizing your portfolio!\n');

    rl.close();
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
initializeSettings();