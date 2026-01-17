import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitor extends Document {
  path: string;
  count: number;
  lastVisit: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    path: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    lastVisit: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Delete from cache to force reload
if (mongoose.models.Visitor) {
  delete mongoose.models.Visitor;
}

export default mongoose.model<IVisitor>('Visitor', VisitorSchema);
