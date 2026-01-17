require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: String,
  company: String,
  logo: String,
  duration: String,
  points: [String],
  techStack: [String],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);

const demoExperiences = [
  {
    role: "Senior Full Stack Developer",
    company: "Tech Innovations Inc.",
    logo: "https://ui-avatars.com/api/?name=TI&size=100&background=0891b2&color=fff&bold=true&rounded=true",
    duration: "Jan 2022 - Present",
    points: [
      "Led development of microservices architecture serving 1M+ users",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Mentored team of 5 junior developers",
      "Architected and deployed scalable cloud infrastructure on AWS"
    ],
    techStack: ["React", "Node.js", "TypeScript", "AWS", "Docker", "MongoDB"],
    featured: false,
  },
  {
    role: "Full Stack Developer",
    company: "Digital Solutions Ltd.",
    logo: "https://ui-avatars.com/api/?name=DS&size=100&background=10b981&color=fff&bold=true&rounded=true",
    duration: "Jun 2020 - Dec 2021",
    points: [
      "Developed and maintained 10+ client-facing web applications",
      "Optimized database queries improving response time by 40%",
      "Collaborated with UX team to implement responsive designs",
      "Integrated third-party APIs and payment gateways"
    ],
    techStack: ["Vue.js", "Express", "PostgreSQL", "Redis", "Jest"],
    featured: false,
  },
  {
    role: "Junior Developer",
    company: "StartUp Ventures",
    logo: "https://ui-avatars.com/api/?name=SV&size=100&background=f59e0b&color=fff&bold=true&rounded=true",
    duration: "Jan 2019 - May 2020",
    points: [
      "Built RESTful APIs for mobile and web applications",
      "Participated in agile development process and daily standups",
      "Wrote unit and integration tests achieving 85% code coverage",
      "Assisted in migration from monolith to microservices"
    ],
    techStack: ["JavaScript", "Python", "Django", "MySQL", "Git"],
    featured: false,
  }
];

async function addDemoExperiences() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing experiences
    await Experience.deleteMany({});
    console.log('✅ Cleared existing experiences');

    // Insert demo experiences
    for (const exp of demoExperiences) {
      const created = await Experience.create(exp);
      console.log(`✅ Created: ${created.role} at ${created.company}`);
    }

    console.log('\n🎉 Successfully added all demo experiences!');
    console.log(`📊 Total experiences: ${demoExperiences.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

addDemoExperiences();
