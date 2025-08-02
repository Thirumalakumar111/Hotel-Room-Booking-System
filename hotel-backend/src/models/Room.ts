import mongoose from 'mongoose';

export interface IRoom extends mongoose.Document {
  roomNumber: string;
  type: string; // single, double, suite, etc.
  price: number;
  description: string;
  isAvailable: boolean;
  image: string; // for now, use image URL
  amenities: string[];
}

const roomSchema = new mongoose.Schema<IRoom>(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    image: { type: String }, // URL of image
    amenities: [{ type: String }],
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>('Room', roomSchema);
