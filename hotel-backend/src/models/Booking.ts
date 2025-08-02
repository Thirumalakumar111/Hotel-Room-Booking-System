import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  room: mongoose.Schema.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  paymentMethod: string; // UPI, Card, etc.
  status: 'booked' | 'cancelled';
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    paymentMethod: { type: String, default: 'UPI' },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
