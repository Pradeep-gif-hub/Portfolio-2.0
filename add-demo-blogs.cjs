// Add demo blogs to MongoDB for testing
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  tldr: { type: String, required: true },
  author: { type: String, required: true },
  authorAvatar: { type: String },
  content: { type: String, required: true },
  tags: [{ type: String }],
  keyTakeaways: [{ type: String }],
  references: [{ 
    title: { type: String },
    url: { type: String }
  }],
  cta: {
    text: { type: String },
    link: { type: String }
  },
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
  ogImage: { type: String },
  canonicalUrl: { type: String, required: true },
  readTime: { type: Number, default: 5 },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

const demoBlogs = [
  {
    title: "Building Modern Web Applications with React and TypeScript",
    slug: "building-modern-web-apps-react-typescript",
    summary: "Learn how to build scalable and maintainable web applications using React and TypeScript. This guide covers best practices, patterns, and real-world examples.",
    tldr: "A comprehensive guide to building production-ready React applications with TypeScript, covering component architecture, state management, and performance optimization.",
    author: "Pradeep Awasthi",
    authorAvatar: "https://avatars.githubusercontent.com/u/placeholder",
    content: `## Introduction

React and TypeScript have become the go-to combination for building modern web applications. TypeScript adds static typing to JavaScript, catching errors at compile time and improving developer experience with better autocomplete and refactoring support.

## Why TypeScript with React?

**Type Safety**: Catch bugs before they reach production
**Better IDE Support**: Enhanced autocomplete and intellisense
**Improved Refactoring**: Rename symbols safely across your codebase
**Self-Documenting Code**: Types serve as inline documentation

## Setting Up Your Project

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

## Component Patterns

### Functional Components with Props

\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      onClick={onClick}
      className={\`btn btn-\${variant}\`}
    >
      {label}
    </button>
  );
};
\`\`\`

## State Management

Using hooks for local state and context for global state:

\`\`\`typescript
const [count, setCount] = useState<number>(0);
const { user } = useContext(AuthContext);
\`\`\`

## Performance Optimization

- Use React.memo for expensive components
- Implement useMemo for computed values
- Use useCallback for event handlers
- Lazy load components with React.lazy

## Conclusion

TypeScript with React provides a powerful foundation for building scalable applications. Start small, add types gradually, and enjoy the benefits of type safety.`,
    tags: ["React", "TypeScript", "Web Development", "JavaScript"],
    keyTakeaways: [
      "TypeScript adds type safety and improves developer experience in React projects",
      "Use proper component patterns with interfaces for props",
      "Leverage TypeScript's type inference to reduce boilerplate",
      "Performance optimization is crucial for large-scale applications"
    ],
    references: [
      { title: "React Documentation", url: "https://react.dev" },
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" }
    ],
    cta: {
      text: "Explore More React Tutorials",
      link: "/blog"
    },
    metaTitle: "Building Modern Web Applications with React and TypeScript | Complete Guide",
    metaDescription: "Learn how to build scalable React applications with TypeScript. Covers best practices, patterns, and performance optimization.",
    canonicalUrl: "https://pradeep.dev/blog/building-modern-web-apps-react-typescript",
    readTime: 8
  },
  {
    title: "MongoDB Best Practices for Node.js Applications",
    slug: "mongodb-best-practices-nodejs",
    summary: "Discover essential MongoDB patterns and best practices for building robust Node.js applications. Learn about schema design, indexing, and performance optimization.",
    tldr: "Master MongoDB with Node.js by following industry best practices for schema design, queries, indexing, and error handling to build high-performance applications.",
    author: "Pradeep Awasthi",
    content: `## Introduction

MongoDB is a powerful NoSQL database that pairs perfectly with Node.js. However, to get the most out of it, you need to follow certain best practices.

## Schema Design Principles

### Embedding vs Referencing

**Embed when:**
- Data is always needed together
- One-to-few relationships
- Data doesn't change frequently

**Reference when:**
- Data is accessed separately
- One-to-many or many-to-many relationships
- Data changes frequently

\`\`\`javascript
// Embedding Example
const userSchema = new Schema({
  name: String,
  address: {
    street: String,
    city: String,
    country: String
  }
});

// Referencing Example
const postSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});
\`\`\`

## Connection Management

Always use connection pooling:

\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
});
\`\`\`

## Indexing Strategies

Create indexes for frequently queried fields:

\`\`\`javascript
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ username: 1, email: 1 });
\`\`\`

## Query Optimization

- Use projection to select only needed fields
- Limit results appropriately
- Use lean() for read-only operations
- Avoid N+1 queries with populate

## Error Handling

Always handle errors gracefully:

\`\`\`javascript
try {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
} catch (error) {
  console.error('Database error:', error);
  // Handle appropriately
}
\`\`\`

## Conclusion

Following these MongoDB best practices will help you build faster, more reliable applications. Remember to monitor performance and adjust your strategy as your application scales.`,
    tags: ["MongoDB", "Node.js", "Database", "Backend"],
    keyTakeaways: [
      "Choose between embedding and referencing based on your data access patterns",
      "Always use connection pooling for better performance",
      "Create indexes on frequently queried fields",
      "Use lean queries for read-only operations to improve performance"
    ],
    references: [
      { title: "MongoDB Documentation", url: "https://docs.mongodb.com" },
      { title: "Mongoose Guide", url: "https://mongoosejs.com/docs/guide.html" }
    ],
    cta: {
      text: "Learn More About Databases",
      link: "/blog"
    },
    metaTitle: "MongoDB Best Practices for Node.js | Complete Guide",
    metaDescription: "Essential MongoDB patterns and best practices for Node.js applications. Learn schema design, indexing, and performance optimization.",
    canonicalUrl: "https://Pradeep.dev/blog/mongodb-best-practices-nodejs",
    readTime: 10
  },
  {
    title: "Authentication and Authorization in Modern Web Apps",
    slug: "authentication-authorization-web-apps",
    summary: "A comprehensive guide to implementing secure authentication and authorization in web applications using JWT, sessions, and role-based access control.",
    tldr: "Learn how to implement secure authentication systems with JWT tokens, session management, and role-based access control for modern web applications.",
    author: "Pradeep Awasthi",
    content: `## Introduction

Security is paramount in modern web applications. Understanding authentication (who you are) and authorization (what you can do) is crucial.

## Authentication Methods

### JWT (JSON Web Tokens)

JWT is a stateless authentication method perfect for APIs:

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { userId: user._id, role: 'admin' },
  process.env.JWT_SECRET,
  { expiresIn: '4h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
\`\`\`

### Session-Based Authentication

Traditional session-based auth stores state on the server:

\`\`\`javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    httpOnly: true,
    secure: true,
    maxAge: 3600000 
  }
}));
\`\`\`

## Password Security

Always hash passwords with bcrypt:

\`\`\`javascript
const bcrypt = require('bcryptjs');

// Hash password
const hash = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hash);
\`\`\`

## Authorization Patterns

### Role-Based Access Control (RBAC)

\`\`\`javascript
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden' 
      });
    }
    next();
  };
};

// Usage
app.delete('/api/users/:id', 
  authenticate, 
  authorize(['admin']), 
  deleteUser
);
\`\`\`

## Security Best Practices

- **Never** store passwords in plain text
- Use HTTPS in production
- Set HTTP-only cookies for tokens
- Implement rate limiting
- Add CSRF protection
- Validate and sanitize all inputs

## Protecting Routes

Frontend route protection:

\`\`\`typescript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
\`\`\`

## Conclusion

Security is not optional. Implement proper authentication and authorization from day one, and your users will thank you for protecting their data.`,
    tags: ["Security", "Authentication", "JWT", "Web Development"],
    keyTakeaways: [
      "JWT tokens are ideal for stateless API authentication",
      "Always hash passwords with bcrypt before storing",
      "Use HTTP-only cookies to prevent XSS attacks",
      "Implement role-based access control for fine-grained permissions",
      "Never trust client-side authorization - always verify on the server"
    ],
    references: [
      { title: "JWT.io", url: "https://jwt.io" },
      { title: "OWASP Security Guide", url: "https://owasp.org" }
    ],
    cta: {
      text: "Explore Security Topics",
      link: "/blog"
    },
    metaTitle: "Authentication and Authorization in Web Apps | Security Guide",
    metaDescription: "Comprehensive guide to implementing secure authentication with JWT, sessions, and role-based access control in modern web applications.",
    canonicalUrl: "https://Pradeep.dev/blog/authentication-authorization-web-apps",
    readTime: 12
  }
];

async function addDemoBlogs() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo blogs (optional)
    console.log('\n🗑️  Clearing existing blogs...');
    await Blog.deleteMany({});
    console.log('✅ Cleared existing blogs');

    // Insert demo blogs
    console.log('\n📝 Adding demo blogs...');
    for (const blog of demoBlogs) {
      const created = await Blog.create(blog);
      console.log(`✅ Created: ${created.title}`);
    }

    console.log('\n🎉 Successfully added all demo blogs!');
    console.log('\n📊 Summary:');
    console.log(`   Total blogs: ${demoBlogs.length}`);
    console.log('\n🔗 Test the APIs:');
    console.log('   GET  /api/blogs - List all blogs');
    console.log('   GET  /api/blogs?slug=building-modern-web-apps-react-typescript - Get specific blog');
    console.log('   GET  /api/admin/blogs - Admin list (requires auth)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

addDemoBlogs();
