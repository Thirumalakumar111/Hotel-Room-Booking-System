import express from 'express';
import { sendBookingEmail } from '../utils/sendEmail';

const router = express.Router();

router.get('/test-email', async (_req, res) => {
  try {
    await sendBookingEmail(
      'ramb74787@gmail.com',
      'Test Email from Hotel Booking',
      '<h3>This is a test email from your backend</h3>'
    );
    res.send('✅ Email sent!');
  } catch {
    res.status(500).send('❌ Email failed.');
  }
});

export default router;
