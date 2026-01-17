const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function migrateSettings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const settingsCollection = db.collection('settings');

    // Remove the old fields from all settings documents
    const result = await settingsCollection.updateMany(
      {},
      {
        $unset: {
          showHero: "",
          showAbout: "",
          showExperience: "",
          showProjects: "",
          showTechStack: "",
          showCertifications: "",
          showBlogs: "",
          showGitHubActivity: "",
          showContact: "",
          featuredProjectsLimit: "",
          featuredBlogsLimit: "",
          featuredExperienceLimit: "",
        }
      }
    );

    console.log(`✅ Migration completed!`);
    console.log(`   Modified ${result.modifiedCount} document(s)`);
    console.log(`   Matched ${result.matchedCount} document(s)`);
    console.log('\nRemoved fields:');
    console.log('  - showHero, showAbout, showExperience, showProjects');
    console.log('  - showTechStack, showCertifications, showBlogs');
    console.log('  - showGitHubActivity, showContact');
    console.log('  - featuredProjectsLimit, featuredBlogsLimit, featuredExperienceLimit');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

migrateSettings();
