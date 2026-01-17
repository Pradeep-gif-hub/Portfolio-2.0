import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  // Personal Info
  fullName: string;
  tagline: string;
  bio: string;
  profileImage: string;
  resumeUrl?: string;
  whatIDo?: string;
  focusArea?: string;
  achievements?: string[]; // Array of achievement strings
  
  // Contact Info
  email: string;
  phone?: string;
  
  // Social Links
  github?: string;
  linkedin?: string;
  twitter?: string;
  buyMeACoffee?: string;
  discord?: string;
  spotify?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    // Personal Info
    fullName: { type: String, required: true },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    profileImage: { type: String, required: true },
    resumeUrl: { type: String },
    whatIDo: { type: String },
    focusArea: { type: String },
    achievements: [{ type: String }], // Array of strings for achievements
    
    // Contact Info
    email: { type: String, required: true },
    phone: { type: String },
    
    // Social Links
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    buyMeACoffee: { type: String },
    discord: { type: String },
    spotify: { type: String },
  },
  { timestamps: true }
);

// Delete from cache to force reload
if (mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model<ISettings>('Settings', SettingsSchema);
