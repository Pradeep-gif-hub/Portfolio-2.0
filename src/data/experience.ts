export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  points: string[];
  techStack: string[];
}

export const experience: Experience[] = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Tech Startup Co.",
    duration: "2022 - Present",
    points: [
      "Led development of 5+ mission-critical frontend applications",
      "Improved performance metrics by 45% through optimization",
      "Mentored team of 3 junior developers",
    ],
    techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Node.js"],
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "Digital Agency",
    duration: "2020 - 2022",
    points: [
      "Built 15+ client projects using React and Node.js",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
      "Designed and implemented REST APIs serving 10M+ requests/month",
    ],
    techStack: ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker"],
  },
  {
    id: 3,
    role: "Junior Developer",
    company: "Web Development Studio",
    duration: "2019 - 2020",
    points: [
      "Developed responsive web applications for various clients",
      "Collaborated with designers to implement UI/UX designs",
      "Maintained codebase and fixed bugs in production systems",
    ],
    techStack: ["JavaScript", "React", "HTML", "CSS", "Git"],
  },
];
