import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  image: string; // URL to image
  description?: string;
  category?: string;
  date?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    date: { type: Date },
  },
  { timestamps: true }
);

// Create compound index for efficient sorting by date
GallerySchema.index({ date: -1, createdAt: -1 });

export default mongoose.models.Gallery || mongoose.model<IGallery>('Gallery', GallerySchema);
