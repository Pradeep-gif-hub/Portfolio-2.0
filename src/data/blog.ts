export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  tldr: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: number;
  tags: string[];
  content: string;
  keyTakeaways: string[];
  references: { title: string; url: string }[];
  cta: { text: string; link: string };
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Building a Data-Driven Portfolio with React",
    slug: "data-driven-portfolio",
    summary: "How to structure your portfolio for easy updates and scalability",
    tldr: "Learn how to separate content from UI in React portfolios for better maintainability and scalability using TypeScript data files.",
    author: "Pradeep Awasthi",
    date: "2024-01-10",
    readTime: 5,
    tags: ["React", "TypeScript", "Portfolio", "Best Practices"],
    content: `
## The Problem
Most developer portfolios hardcode content directly into components, making updates tedious.

## The Solution
Separate your content from UI. Keep all data in TypeScript files and let components render it.

### Benefits
- **Easy Updates**: Change data, not code
- **Scalability**: Add sections without touching components
- **Maintainability**: Clear separation of concerns
- **Type Safety**: Full TypeScript support

Read more...
    `,
    keyTakeaways: [
      "Separate content from UI components for better maintainability",
      "Use TypeScript for type-safe data structures",
      "Enable easy updates without touching component code",
      "Improve scalability by centralizing data management",
    ],
    references: [
      { title: "React Documentation", url: "https://react.dev" },
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" },
    ],
    cta: { text: "View related project", link: "/projects" },
    metaTitle: "Building a Data-Driven Portfolio with React | Pradeep Awasthi",
    metaDescription: "Learn how to structure your React portfolio for easy updates and scalability using TypeScript data files and component separation.",
    canonicalUrl: "https://yoursite.com/blog/data-driven-portfolio",
  },
  {
    id: 2,
    title: "Minimalist Design Principles for Developers",
    slug: "minimalist-design",
    summary: "Creating beautiful UIs without unnecessary complexity",
    tldr: "Master the art of minimalist design: use whitespace effectively, limit your color palette, and choose typography wisely for cleaner, more professional UIs.",
    author: "Pradeep Awasthi",
    date: "2024-01-05",
    readTime: 7,
    tags: ["Design", "UI/UX", "Minimalism", "Best Practices"],
    content: `
## Less is More
In today's web, complexity often equals confusion.

## Core Principles
1. **Whitespace** - Breathing room for content
2. **Color** - One primary accent color
3. **Typography** - Two font families maximum

Read more...
    `,
    keyTakeaways: [
      "Whitespace is a design element, not empty space",
      "Limit your color palette to one primary accent",
      "Use maximum two font families",
      "Simplicity improves user experience",
    ],
    references: [
      { title: "Laws of UX", url: "https://lawsofux.com" },
      { title: "Refactoring UI", url: "https://refactoringui.com" },
    ],
    cta: { text: "See my design work", link: "/projects" },
    metaTitle: "Minimalist Design Principles for Developers | Pradeep Awasthi",
    metaDescription: "Learn essential minimalist design principles to create beautiful, functional UIs without unnecessary complexity.",
    canonicalUrl: "https://yoursite.com/blog/minimalist-design",
  },
  {
    id: 3,
    title: "TypeScript Tips for Better React Code",
    slug: "typescript-react-tips",
    summary: "Leveraging TypeScript to write safer, more maintainable React components",
    tldr: "Discover practical TypeScript patterns for React: proper typing for props, hooks, and events to write safer, more maintainable code.",
    author: "Pradeep Awasthi",
    date: "2023-12-28",
    readTime: 6,
    tags: ["TypeScript", "React", "Best Practices", "Type Safety"],
    content: `
## Type Safety in React
TypeScript can catch bugs before runtime.

## Best Practices
- Use interfaces over types for objects
- Leverage generics for reusable components
- Keep prop types DRY

Read more...
    `,
    keyTakeaways: [
      "Always define interfaces for component props",
      "Use TypeScript generics for reusable components",
      "Properly type hooks and event handlers",
      "Leverage type inference when possible",
    ],
    references: [
      { title: "React TypeScript Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/" },
      { title: "TypeScript Deep Dive", url: "https://basarat.gitbook.io/typescript/" },
    ],
    cta: { text: "Check out my TypeScript projects", link: "/projects" },
    metaTitle: "TypeScript Tips for Better React Code | Pradeep Awasthi",
    metaDescription: "Learn practical TypeScript patterns for React to write safer, more maintainable code with proper typing for props, hooks, and events.",
    canonicalUrl: "https://yoursite.com/blog/typescript-react-tips",
  },
] as const;
