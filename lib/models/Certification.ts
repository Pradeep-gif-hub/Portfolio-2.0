import mongoose, { Schema, Document } from 'mongoose';

export interface ICertification extends Document {
  title: string;
  issuer: string;
  year: number;
  month?: string;
  link?: string;
  image?: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  projectBased: boolean;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSchema = new Schema<ICertification>(
  {
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
    featured: { type: Boolean, default: false, required: false },
  },
  { timestamps: true }
);

// Delete from cache to force reload
if (mongoose.models.Certification) {
  delete mongoose.models.Certification;
}

export default mongoose.model<ICertification>('Certification', CertificationSchema);
