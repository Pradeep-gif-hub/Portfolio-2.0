
# 🚀 Portfolio 2.0

<div align="center">

<!--[Portfolio Banner](https://pradeepawasthi.vercel.app/1200x400/1a1a2e/00d4ff?text=Portfolio+2.0)-->

**A production-ready, full-stack portfolio solution for developers and creators**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

</div>

## 📖 Introduction

**Portfolio 2.0** is a modern, enterprise-grade portfolio platform designed for developers, designers, and tech professionals who want complete control over their online presence. Unlike traditional portfolio builders with limitations and monthly fees, this is a fully customizable, self-hosted solution that you own and control.

### 🎯 Why Portfolio 2.0?

Building a portfolio from scratch is time-consuming, and using no-code platforms often means sacrificing customization and paying recurring fees. Portfolio 2.0 bridges this gap by providing:

- **🔐 Full Ownership** - Your content, your data, your domain. No vendor lock-in.
- **⚡ Production Ready** - Battle-tested architecture with MongoDB, serverless APIs, and optimized performance
- **🎨 Fully Customizable** - Every component, color, and layout can be tailored to your brand
- **📊 Built-in Analytics** - Track visitors, sessions, and engagement without third-party trackers
- **🛡️ Enterprise Security** - JWT authentication, 2FA, password hashing, and protected routes
- **📱 Responsive Design** - Pixel-perfect on every device from mobile to 4K displays
- **🚀 Easy Deployment** - One-click deploy to Vercel with serverless architecture
- **💰 Cost Effective** - Free hosting on Vercel (hobby tier) + MongoDB Atlas free tier

### 🎨 Perfect For

- **Software Developers** showcasing projects and technical skills
- **UI/UX Designers** displaying portfolio work and case studies
- **Freelancers** building client trust with professional presence
- **Tech Bloggers** sharing knowledge with built-in blog platform
- **Job Seekers** standing out with a modern, interactive resume

### 🌟 What Makes It Special

Unlike static portfolios or template sites, Portfolio 2.0 is a **full-stack application** with a powerful admin panel. Update your content, add new projects, write blog posts, and manage everything through a beautiful interface - no code deployment needed!

**Zero downtime updates** • **SEO optimized** • **Markdown blog support** • **Real-time Spotify integration** • **2FA security** • **Mobile-first design**

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** - Sleek dark theme with gradient accents and smooth animations
- **Responsive Design** - Fully responsive across all devices
- **Framer Motion Animations** - Smooth, engaging transitions and interactions
- **Theme Toggle** - Light/Dark mode support
- **Performance Optimized** - Built with Vite for lightning-fast load times

### 🎯 Dynamic Sections
- **Hero Section** - Eye-catching introduction with animated text
- **About/Profile** - Personal information and bio
- **Tech Stack** - Visual showcase of skills and technologies with icons
- **Projects** - Featured and detailed project showcases with filtering
- **Experience** - Professional work history timeline
- **Certifications** - Display of professional certifications
- **Blog** - Full-featured blog with markdown support and code highlighting
- **Gallery** - Image gallery for showcasing work/photos
- **Contact** - Multiple ways to connect (Email, WhatsApp, Social links)
- **Spotify Integration** - Real-time now playing widget
- **GitHub Activity** - Display recent GitHub contributions
- **Visitor Analytics** - Real-time visitor counter and statistics

### ⚡ Backend & Admin Panel
- **MongoDB Integration** - Persistent data storage
- **REST API** - Built with Vercel serverless functions
- **Secure Authentication** - JWT-based admin authentication with 2FA support
- **Admin Dashboard** - Full CRUD operations for all content
- **Content Management** - Manage blogs, projects, experience, certifications, tools, and gallery
- **Settings Management** - Configure site-wide settings from admin panel
- **Protected Routes** - Secure admin-only sections

### 📊 Analytics & Tracking
- **Visitor Tracking** - Track unique visitors and page views
- **Session Management** - Monitor active sessions
- **Geographic Data** - Track visitor locations (city, country)
- **Device Info** - Browser and device statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **React Router v6** - Client-side routing
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon set

### Backend
- **Node.js** - Runtime environment
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality (for 2FA)

### Deployment
- **Vercel** - Hosting and serverless functions
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
Portfolio-2.0/
├── api/                          # Vercel serverless functions
│   ├── admin/                    # Admin-only API endpoints
│   │   ├── auth.ts              # Authentication endpoints
│   │   └── content.ts           # Content management CRUD
│   ├── auth/                    # Authentication utilities
│   ├── spotify/                 # Spotify integration
│   │   └── now-playing.ts      # Current playing track
│   ├── public-data.ts          # Public API for fetching content
│   └── visitor.ts              # Visitor tracking endpoint
├── lib/                         # Backend utilities
│   ├── mongodb.ts              # MongoDB connection
│   ├── auth.ts                 # JWT authentication
│   └── models/                 # Mongoose models
│       ├── Blog.ts
│       ├── Certification.ts
│       ├── Experience.ts
│       ├── Gallery.ts
│       ├── OTP.ts
│       ├── Project.ts
│       ├── Settings.ts
│       ├── Tool.ts
│       └── Visitor.ts
├── src/                        # Frontend source code
│   ├── components/             # React components
│   │   ├── admin/             # Admin panel components
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   ├── sections/          # Homepage sections
│   │   ├── styles/            # Component-specific styles
│   │   └── ui/                # Reusable UI components
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx   # Authentication state
│   │   └── ThemeContext.tsx  # Theme management
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAnalytics.ts   # Analytics tracking
│   │   └── useSessionTracker.ts
│   ├── pages/                 # Page components
│   │   ├── admin/            # Admin panel pages
│   │   ├── HomePage.tsx
│   │   ├── BlogPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── ...
│   ├── utils/                 # Utility functions
│   │   ├── api.ts            # API client functions
│   │   ├── helpers.ts        # Helper utilities
│   │   └── techIcons.ts      # Tech icon mapping
│   ├── data/                  # Static data
│   ├── App.tsx               # Root component
│   ├── AppRouter.tsx         # Route configuration
│   └── main.tsx              # Entry point
├── public/                    # Static assets
│   └── logos/                # Technology logos
├── .env.local                 # Environment variables
├── package.json              # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
└── vercel.json              # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Portfolio-2.0.git
   cd Portfolio-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Analytics
   VITE_ANALYTICS_ID=your-analytics-id
   VITE_SITE_URL=http://localhost:5173

   # Admin Authentication
   VITE_ADMIN_PASSWORD=your-admin-password

   # MongoDB (Get from MongoDB Atlas)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   MONGODB_DB_NAME=DB name

   # API Configuration
   VITE_API_URL=/api

   # Security Secrets (Generate using the helper scripts)
   JWT_SECRET=your-generated-jwt-secret
   SESSION_SECRET=your-generated-session-secret
   ADMIN_PASSWORD_HASH=your-generated-password-hash

   # Email Configuration (Optional - for 2FA)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # Spotify Integration (Optional)
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   SPOTIFY_REFRESH_TOKEN=your-refresh-token
   ```

4. **Generate security secrets**
   
   Generate JWT secret and session secret:
   ```bash
   node generate-secrets.cjs
   ```
   
   Generate admin password hash:
   ```bash
   node generate-password-hash.cjs
   ```
   
   Copy the generated values to your `.env.local` file.

5. **Set up MongoDB**
   - Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get your connection string and add it to `MONGODB_URI`
   - Create a database user with read/write permissions

6. **Initialize your portfolio settings** ⭐ **IMPORTANT**
   
   This step sets up your personal information and email (required for 2FA):
   ```bash
   node initialize-settings.cjs
   ```
   
   The script will ask you for:
   - **Your name and tagline** - Displayed across the site
   - **Email address** - Required for 2FA and contact form (use a real email!)
   - **Phone number** - Optional, for WhatsApp integration
   - **Social links** - GitHub, LinkedIn, Twitter, etc.
   - **Profile image** - URL to your profile picture
   
   > **⚠️ Important:** Without running this script, you won't be able to enable 2FA in the admin panel, which is required for secure access. The email you provide here will be used to send authentication codes.

7. **Seed the database (Optional)**
   
   Add demo data to your database:
   ```bash
   # Add demo projects
   node add-demo-projects.cjs

   # Add demo blogs
   node add-demo-blogs.cjs

   # Add demo experiences
   node add-demo-experiences.cjs

   # Add demo certifications
   node add-demo-certifications.cjs

   # Add demo tools
   node add-demo-tools.cjs
   ```

8. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

9. **Access the admin panel**
   - Navigate to `http://localhost:5173/admin/login`
   - Use the password you set in `VITE_ADMIN_PASSWORD`
   - On first login, enable 2FA using the email you configured in step 6
   - Check your email for the verification code
   - Start customizing your portfolio through the admin dashboard!

## 📝 Configuration

### Customize Profile Information
Edit the following files to personalize your portfolio:

- **Profile Data**: `src/data/profile.ts`
- **Site Config**: `src/data/siteConfig.ts`
- **Social Links**: `src/data/socials.ts`
- **Tech Stack**: `src/data/techStack.ts`

### Upload Technology Logos
Place technology logos in `public/logos/` directory. The app will automatically map them based on tool names from the database.

### Admin Panel
Once logged in to the admin panel (`/admin`), you can:
- Manage all content (Create, Read, Update, Delete)
- Configure site-wide settings
- View visitor analytics
- Upload images for projects, blog posts, etc.

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (copy from `.env.local`)

3. **Configure environment variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local` file
   - Update `VITE_SITE_URL` to your Vercel domain

4. **Deploy**
   - Vercel will automatically build and deploy your site
   - Every push to main branch will trigger a new deployment

### Environment Variables for Production

Make sure to set these in Vercel:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret
- `SESSION_SECRET` - Your session secret
- `ADMIN_PASSWORD_HASH` - Hashed admin password
- `VITE_ADMIN_PASSWORD` - Plain admin password (for frontend)
- `VITE_SITE_URL` - Your production URL
- All other optional variables (Spotify, SMTP, etc.)

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **2FA Support** - Two-factor authentication via email
- **Protected API Routes** - Admin-only endpoints with middleware
- **CORS Configuration** - Proper cross-origin resource sharing
- **Environment Variables** - Sensitive data kept in env files

## 📱 Spotify Integration (Optional)

To enable the "Now Playing" widget:

1. Create a Spotify app at [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Get your Client ID and Client Secret
3. Generate a refresh token using the Spotify OAuth flow
4. Add credentials to `.env.local`:
   ```env
   SPOTIFY_CLIENT_ID=your-client-id
   SPOTIFY_CLIENT_SECRET=your-client-secret
   SPOTIFY_REFRESH_TOKEN=your-refresh-token
   ```

## 📊 API Endpoints

### Public Endpoints
- `GET /api/public-data?type=blogs` - Get all blogs
- `GET /api/public-data?type=projects` - Get all projects
- `GET /api/public-data?type=experience` - Get all experiences
- `GET /api/public-data?type=certifications` - Get certifications
- `GET /api/public-data?type=tools` - Get tech stack tools
- `GET /api/public-data?type=gallery` - Get gallery images
- `GET /api/public-data?type=settings` - Get site settings
- `POST /api/visitor` - Track visitor

### Admin Endpoints (Protected)
- `POST /api/admin/auth` - Admin login
- `GET /api/admin/content?type={type}` - Get content
- `POST /api/admin/content?type={type}` - Create content
- `PUT /api/admin/content?type={type}` - Update content
- `DELETE /api/admin/content?type={type}&id={id}` - Delete content

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## � Contributors

This project exists thanks to all the people who contributed:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Pradeep-gif-hub">
        <img src="https://github.com/Pradeep-gif-hub.png" width="100px;" alt="Pradeep Kumar Awasthi"/>
        <br />
        <sub><b>Pradeep Kumar Awasthi</b></sub>
      </a>
      <br />
      <sub>Lead Developer</sub>
    </td>
    <td align="center">
      <a href="https://github.com/SAmarjeet05">
        <img src="https://github.com/SAmarjeet05.png" width="100px;" alt="Amarjeet Singh"/>
        <br />
        <sub><b>Amarjeet Singh</b></sub>
      </a>
      <br />
      <sub>Lead Developer</sub>
    </td>
  </tr>
</table>

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev)
- Animations by [Framer Motion](https://www.framer.com/motion)
- UI framework by [Tailwind CSS](https://tailwindcss.com)
- Deployment on [Vercel](https://vercel.com)

---

⭐ If you found this project helpful, please consider giving it a star on GitHub!
