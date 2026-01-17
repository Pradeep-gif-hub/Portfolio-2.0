require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Design', 'Other'],
    required: true 
  },
  logo: { type: String, required: true },
  proficiency: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate' 
  },
  yearsOfExperience: { type: Number, min: 0 },
  showOnHomepage: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Tool = mongoose.models.Tool || mongoose.model('Tool', toolSchema);

// Common tech logos from CDN (devicon or simple-icons)
const demoTools = [
  // Frontend
  { name: 'React', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 'Expert', yearsOfExperience: 5, order: 1 },
  { name: 'TypeScript', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', proficiency: 'Expert', yearsOfExperience: 4, order: 2 },
  { name: 'JavaScript', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', proficiency: 'Expert', yearsOfExperience: 6, order: 3 },
  { name: 'Next.js', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', proficiency: 'Advanced', yearsOfExperience: 3, order: 4 },
  { name: 'Tailwind CSS', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', proficiency: 'Expert', yearsOfExperience: 3, order: 5 },
  { name: 'HTML5', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', proficiency: 'Expert', yearsOfExperience: 8, order: 6 },
  { name: 'CSS3', category: 'Frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', proficiency: 'Expert', yearsOfExperience: 8, order: 7 },
  
  // Backend
  { name: 'Node.js', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', proficiency: 'Expert', yearsOfExperience: 5, order: 10 },
  { name: 'Express', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 'Advanced', yearsOfExperience: 4, order: 11 },
  { name: 'Python', category: 'Backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', proficiency: 'Advanced', yearsOfExperience: 4, order: 12 },
  
  // Database
  { name: 'MongoDB', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', proficiency: 'Expert', yearsOfExperience: 4, order: 20 },
  { name: 'PostgreSQL', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', proficiency: 'Advanced', yearsOfExperience: 3, order: 21 },
  { name: 'MySQL', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 'Advanced', yearsOfExperience: 3, order: 22 },
  { name: 'Redis', category: 'Database', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', proficiency: 'Intermediate', yearsOfExperience: 2, order: 23 },
  
  // DevOps
  { name: 'Docker', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', proficiency: 'Advanced', yearsOfExperience: 3, order: 30 },
  { name: 'Git', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', proficiency: 'Expert', yearsOfExperience: 6, order: 31 },
  { name: 'GitHub', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', proficiency: 'Expert', yearsOfExperience: 6, order: 32 },
  { name: 'Linux', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', proficiency: 'Advanced', yearsOfExperience: 4, order: 33 },
  { name: 'AWS', category: 'DevOps', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', proficiency: 'Intermediate', yearsOfExperience: 2, order: 34 },
  
  // Design
  { name: 'Figma', category: 'Design', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', proficiency: 'Intermediate', yearsOfExperience: 2, order: 40 },
];

async function seedTools() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing tools
    await Tool.deleteMany({});
    console.log('✅ Cleared existing tools');

    // Insert demo tools
    for (const tool of demoTools) {
      const created = await Tool.create(tool);
      console.log(`✅ Created: ${created.name} (${created.category})`);
    }

    console.log('🎉 Successfully added all demo tools!');
    console.log(`📊 Total tools: ${demoTools.length}`);
    console.log('📁 Categories:', [...new Set(demoTools.map(t => t.category))].join(', '));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedTools();
