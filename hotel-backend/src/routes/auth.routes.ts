import express from 'express';
import { register, login } from '../controllers/auth.controller';
import { forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
export default router;
