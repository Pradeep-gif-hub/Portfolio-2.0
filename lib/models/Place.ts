import mongoose, { Schema, Document } from 'mongoose';

export interface IPlace extends Document {
  name: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude] for GeoJSON/MapLibre
  image?: string;
  imageUrl?: string;
  category?: string;
  description?: string;
  visitedDate?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: function (val: number[]) {
          return Array.isArray(val) && val.length === 2 && !isNaN(val[0]) && !isNaN(val[1]);
        },
        message: 'Coordinates must be [longitude, latitude] numbers',
      },
    },
    image: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    category: { type: String, default: 'City', trim: true },
    description: { type: String, trim: true },
    visitedDate: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PlaceSchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.Place || mongoose.model<IPlace>('Place', PlaceSchema);
