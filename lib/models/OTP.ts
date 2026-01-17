import mongoose from 'mongoose';

export interface IOTP {
  email: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
  createdAt?: Date;
}

const OTPSchema = new mongoose.Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index - automatically deletes expired documents
  },
  verified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for faster queries
OTPSchema.index({ email: 1, createdAt: -1 });

export const OTP = mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);
