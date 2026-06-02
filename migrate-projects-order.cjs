/**
 * Migration: Populate order field for all existing projects
 * 
 * This script ensures all projects have valid order values.
 * It assigns order based on createdAt date (oldest first).
 * This is run once to fix production database.
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  order: Number,
  createdAt: Date,
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

async function migrateProjectOrder() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in .env.local');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get all projects sorted by createdAt (oldest first)
    const projects = await Project.find({}).sort({ createdAt: 1 });
    console.log(`📊 Found ${projects.length} projects`);

    if (projects.length === 0) {
      console.log('✅ No projects to migrate');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Assign order values (1, 2, 3, ...)
    const bulkOps = projects.map((project, index) => ({
      updateOne: {
        filter: { _id: project._id },
        update: { $set: { order: index + 1 } }
      }
    }));

    if (bulkOps.length > 0) {
      const result = await Project.bulkWrite(bulkOps);
      console.log(`✅ Updated ${result.modifiedCount} projects with order values`);
      
      // Verify
      const updated = await Project.find({}).sort({ order: 1 });
      console.log('\n📋 Projects after migration:');
      updated.forEach(p => {
        console.log(`  - ${p.title} (order: ${p.order}, created: ${p.createdAt.toISOString().split('T')[0]})`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateProjectOrder();
