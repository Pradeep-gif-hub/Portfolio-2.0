import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  role: string;
  company: string;
  logo: string;
  duration: string;
  points: string[];
  techStack: string[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String, required: true },
    duration: { type: String, required: true },
    points: [{ type: String }],
    techStack: [{ type: String }],
    featured: { type: Boolean, default: false, required: false },
  },
  { timestamps: true }
);

// Delete from cache to force reload
if (mongoose.models.Experience) {
  delete mongoose.models.Experience;
}

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
