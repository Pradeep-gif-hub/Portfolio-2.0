import mongoose, { Schema, Document } from 'mongoose';

export interface IContributor {
  name: string;
  github?: string;
  linkedin?: string;
}

export interface IProject extends Document {
  title: string;
  description: string;
  keyFeatures: string[];
  tech: string[];
  github: string;
  live: string;
  image: string;
  featured?: boolean;
  status: 'completed' | 'in-progress' | 'planning';
  timeline?: string;
  contributors: IContributor[];
  createdAt: Date;
  updatedAt: Date;
}

const ContributorSchema = new Schema<IContributor>({
  name: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String },
}, { _id: false });

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    keyFeatures: [{ type: String }],
    tech: [{ type: String }],
    github: { type: String, required: true },
    live: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false, required: false },
    status: { 
      type: String, 
      enum: ['completed', 'in-progress', 'planning'],
      default: 'in-progress' 
    },
    timeline: { type: String },
    contributors: [ContributorSchema],
  },
  { timestamps: true }
);

// Delete from cache to force reload
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model<IProject>('Project', ProjectSchema);
