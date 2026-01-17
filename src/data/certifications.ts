export interface Certification {
  id: number;
  title: string;
  issuer: string;
  year: number;
  month?: string;
  link?: string;
  image?: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  projectBased: boolean;
}

export const certifications: Certification[] = [
  {
    id: 1,
    title: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services",
    year: 2023,
    month: "June",
    link: "https://aws.example.com/cert",
    skills: ["Cloud Architecture", "AWS Services", "Scalability", "Security", "Infrastructure"],
    difficulty: "Intermediate",
    duration: "40 hours",
    projectBased: true,
  },
  {
    id: 2,
    title: "Google Cloud Professional Data Engineer",
    issuer: "Google Cloud",
    year: 2023,
    month: "March",
    link: "https://cloud.google.com/cert",
    skills: ["Data Pipeline", "BigQuery", "ML Engineering", "Cloud SQL"],
    difficulty: "Advanced",
    duration: "50 hours",
    projectBased: true,
  },
  {
    id: 3,
    title: "Certified Kubernetes Administrator",
    issuer: "Linux Foundation",
    year: 2022,
    month: "November",
    link: "https://linuxfoundation.org/cert",
    skills: ["Kubernetes", "Container Orchestration", "DevOps", "Cluster Management"],
    difficulty: "Advanced",
    duration: "60 hours",
    projectBased: false,
  },
  {
    id: 4,
    title: "React Advanced Patterns",
    issuer: "Frontend Masters",
    year: 2022,
    month: "August",
    skills: ["React", "Design Patterns", "Performance", "State Management"],
    difficulty: "Intermediate",
    duration: "8 hours",
    projectBased: true,
  },
];
