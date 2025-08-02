import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
} from '../controllers/booking.controller';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = express.Router();

// Guest
router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);

// Admin
router.get('/', protect, adminOnly, getAllBookings);
router.put('/:id/cancel', protect, adminOnly, cancelBooking);

export default router;
