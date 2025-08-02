import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Room } from '../models/Room';
import { sendBookingEmail } from '../utils/sendEmail';
import { User } from '../models/User';

interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { roomId, checkIn, checkOut, paymentMethod = 'UPI' } = req.body;

    const room = await Room.findById(roomId);
    if (!room || !room.isAvailable) {
      return res.status(400).json({ message: 'Room not available' });
    }

    const booking = await Booking.create({
      user: req.user?.userId,
      room: roomId,
      checkIn,
      checkOut,
      paymentMethod,
    });

    // Mark room as unavailable
    room.isAvailable = false;
    await room.save();

    // 📩 Send Confirmation Email
    const user = await User.findById(req.user?.userId);

    if (user?.email) {
      const emailBody = `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${user.name},</p>
        <p>Your booking for Room <strong>${room.roomNumber}</strong> is confirmed.</p>
        <p>Check-in: ${new Date(checkIn).toDateString()}</p>
        <p>Check-out: ${new Date(checkOut).toDateString()}</p>
        <p>Thank you for choosing us!</p>
      `;

      await sendBookingEmail(user.email, 'Your Booking is Confirmed', emailBody);
    }

    const populatedBooking = await booking.populate('room');

    return res.status(201).json(populatedBooking);
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ message: 'Booking failed' });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ user: req.user?.userId }).populate('room');
    return res.json(bookings);
  } catch (err) {
    console.error('Get user bookings error:', err);
    return res.status(500).json({ message: 'Failed to get bookings' });
  }
};

export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate('user').populate('room');
    return res.json(bookings);
  } catch (err) {
    console.error('Get all bookings error:', err);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Mark the room as available again
    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    return res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Cancel booking error:', err);
    return res.status(500).json({ message: 'Failed to cancel booking' });
  }
};
