require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const contributorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String },
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keyFeatures: [{ type: String }],
  tech: [{ type: String }],
  github: { type: String, required: true },
  live: { type: String, required: true },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['completed', 'in-progress', 'planning'],
    default: 'in-progress' 
  },
  timeline: { type: String },
  contributors: [contributorSchema],
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

const demoProjects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with advanced features including real-time inventory management, secure payment processing, and personalized recommendations. Built with modern technologies for optimal performance and user experience.",
    keyFeatures: [
      "Real-time inventory tracking and management",
      "Secure payment gateway integration (Stripe)",
      "Advanced search and filtering system",
      "User authentication and authorization",
      "Admin dashboard for product and order management",
      "Responsive design for all devices"
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "Stripe", "Redux", "Tailwind CSS"],
    github: "https://github.com/yourusername/ecommerce-platform",
    live: "https://ecommerce-demo.netlify.app",
    image: "https://i.ibb.co/placeholder-ecommerce.png",
    featured: true,
    status: "completed",
    timeline: "January 2024 - April 2024",
    contributors: [
      { name: "John Doe", github: "https://github.com/johndoe", linkedin: "https://linkedin.com/in/johndoe" },
      { name: "Jane Smith", github: "https://github.com/janesmith" }
    ]
  },
  {
    title: "Real-Time Chat Application",
    description: "A modern real-time chat application with WebSocket integration, supporting group chats, direct messaging, and file sharing. Features end-to-end encryption and real-time notifications.",
    keyFeatures: [
      "Real-time messaging with Socket.io",
      "Group chats and direct messages",
      "File and image sharing",
      "Message reactions and emoji support",
      "Online status indicators",
      "Message search and history"
    ],
    tech: ["React", "Socket.io", "Node.js", "MongoDB", "Redis", "TypeScript"],
    github: "https://github.com/yourusername/chat-app",
    live: "https://chat-app-demo.vercel.app",
    image: "https://i.ibb.co/placeholder-chat.png",
    featured: true,
    status: "completed",
    timeline: "March 2024 - June 2024",
    contributors: []
  },
  {
    title: "Task Management System",
    description: "A comprehensive project management tool inspired by Jira and Trello. Features drag-and-drop task boards, sprint planning, time tracking, and team collaboration tools.",
    keyFeatures: [
      "Drag-and-drop Kanban boards",
      "Sprint planning and tracking",
      "Time tracking and reporting",
      "Team collaboration features",
      "Custom workflows and automation",
      "Integration with GitHub and Slack"
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "React Query", "Tailwind CSS"],
    github: "https://github.com/yourusername/task-manager",
    live: "https://task-manager-demo.vercel.app",
    image: "https://i.ibb.co/placeholder-tasks.png",
    featured: true,
    status: "in-progress",
    timeline: "May 2024 - Present",
    contributors: [
      { name: "Alex Chen", linkedin: "https://linkedin.com/in/alexchen" }
    ]
  },
  {
    title: "Weather Forecast App",
    description: "A beautiful and intuitive weather forecast application with 7-day predictions, hourly breakdowns, and severe weather alerts. Features location-based forecasts and customizable units.",
    keyFeatures: [
      "7-day weather forecasts",
      "Hourly weather breakdowns",
      "Severe weather alerts",
      "Location-based detection",
      "Multiple city tracking",
      "Beautiful weather animations"
    ],
    tech: ["React", "OpenWeather API", "Chart.js", "Geolocation API", "CSS Modules"],
    github: "https://github.com/yourusername/weather-app",
    live: "https://weather-app-demo.netlify.app",
    image: "https://i.ibb.co/placeholder-weather.png",
    featured: false,
    status: "completed",
    timeline: "February 2024 - March 2024",
    contributors: []
  },
  {
    title: "AI Content Generator",
    description: "An AI-powered content generation platform that helps users create blog posts, social media content, and marketing copy. Leverages GPT-4 API for high-quality content generation.",
    keyFeatures: [
      "AI-powered content generation",
      "Multiple content templates",
      "Tone and style customization",
      "SEO optimization suggestions",
      "Content history and management",
      "Export to multiple formats"
    ],
    tech: ["React", "OpenAI API", "Node.js", "MongoDB", "TailwindCSS", "TypeScript"],
    github: "https://github.com/yourusername/ai-content-generator",
    live: "https://ai-content-demo.vercel.app",
    image: "https://i.ibb.co/placeholder-ai.png",
    featured: false,
    status: "in-progress",
    timeline: "June 2024 - Present",
    contributors: [
      { name: "Sarah Johnson", github: "https://github.com/sarahjohnson", linkedin: "https://linkedin.com/in/sarahjohnson" }
    ]
  }
];

async function seedProjects() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('✅ Cleared existing projects');

    // Insert demo projects
    for (const project of demoProjects) {
      const created = await Project.create(project);
      console.log(`✅ Created: ${created.title}`);
    }

    console.log('🎉 Successfully added all demo projects!');
    console.log(`📊 Total projects: ${demoProjects.length}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

seedProjects();
