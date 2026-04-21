import { usersService } from './users.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const usersController = {
  getProfile: asyncHandler(async (req, res) => {
    const profile = await usersService.getProfile(req.user.id);
    res.json({ success: true, data: profile });
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const updated = await usersService.updateProfile(req.user.id, req.body);
    res.json({ success: true, message: 'Profile updated', data: updated });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const result = await usersService.changePassword(req.user.id, req.body);
    res.json({ success: true, ...result });
  }),

  getDashboard: asyncHandler(async (req, res) => {
    const dashboard = await usersService.getDashboard(req.user.id);
    res.json({ success: true, data: dashboard });
  }),
};