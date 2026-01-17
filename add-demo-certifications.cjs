require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: String },
  link: { type: String },
  image: { type: String },
  skills: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate' 
  },
  duration: { type: String },
  projectBased: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);

const demoCertifications = [
  {
    title: "AWS Certified Solutions Architect - Associate",
    issuer: "Amazon Web Services",
    year: 2023,
    month: "March",
    link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    image: "https://i.ibb.co/placeholder-aws.png",
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "Lambda", "RDS"],
    difficulty: "Intermediate",
    duration: "3 months preparation",
    projectBased: false,
    featured: false,
  },
  {
    title: "Full Stack Web Development Specialization",
    issuer: "Coursera - The Hong Kong University",
    year: 2022,
    month: "September",
    link: "https://www.coursera.org/specializations/full-stack-web-development",
    image: "https://i.ibb.co/placeholder-coursera.png",
    skills: ["React", "Node.js", "MongoDB", "Express", "Bootstrap"],
    difficulty: "Intermediate",
    duration: "6 months",
    projectBased: true,
    featured: false,
  },
  {
    title: "MongoDB Certified Developer Associate",
    issuer: "MongoDB University",
    year: 2023,
    month: "January",
    link: "https://university.mongodb.com/certification",
    image: "https://i.ibb.co/placeholder-mongodb.png",
    skills: ["MongoDB", "Database Design", "Aggregation", "Indexing"],
    difficulty: "Intermediate",
    duration: "2 months preparation",
    projectBased: false,
    featured: false,
  },
  {
    title: "Professional Scrum Master I (PSM I)",
    issuer: "Scrum.org",
    year: 2022,
    month: "June",
    link: "https://www.scrum.org/professional-scrum-master-i-certification",
    image: "https://i.ibb.co/placeholder-scrum.png",
    skills: ["Agile", "Scrum", "Project Management", "Team Leadership"],
    difficulty: "Beginner",
    duration: "1 month preparation",
    projectBased: false,
    featured: false,
  },
];

async function seedCertifications() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing certifications
    await Certification.deleteMany({});
    console.log('✅ Cleared existing certifications');

    // Insert demo certifications
    for (const cert of demoCertifications) {
      const created = await Certification.create(cert);
      console.log(`✅ Created: ${created.title}`);
    }

    console.log('🎉 Successfully added all demo certifications!');
    console.log(`📊 Total certifications: ${demoCertifications.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedCertifications();
