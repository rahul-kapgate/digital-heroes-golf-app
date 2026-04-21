import { authService } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const authController = {
  signup: asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result,
    });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    res.json({ success: true, data: user });
  }),

  logout: asyncHandler(async (req, res) => {
    // JWT is stateless — client discards token. For server-side blacklist, use Redis.
    res.json({ success: true, message: 'Logged out successfully' });
  }),
};