import mongoose, { Schema, Document } from 'mongoose';

export interface ITool extends Document {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Design' | 'Other';
  logo: string; // URL to logo image
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  showOnHomepage: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ToolSchema = new Schema<ITool>(
  {
    name: { type: String, required: true, unique: true },
    category: { 
      type: String, 
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Design', 'Other'],
      required: true 
    },
    logo: { type: String, required: true },
    proficiency: { 
      type: String, 
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate' 
    },
    yearsOfExperience: { type: Number, min: 0 },
    showOnHomepage: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Tool || mongoose.model<ITool>('Tool', ToolSchema);
