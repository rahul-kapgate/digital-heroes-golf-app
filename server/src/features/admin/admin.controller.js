import { adminService } from './admin.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const adminController = {
  listUsers: asyncHandler(async (req, res) => {
    const users = await adminService.listUsers(req.query);
    res.json({ success: true, data: users });
  }),

  getUser: asyncHandler(async (req, res) => {
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  }),

  updateUser: asyncHandler(async (req, res) => {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  }),

  analytics: asyncHandler(async (req, res) => {
    const stats = await adminService.getAnalytics();
    res.json({ success: true, data: stats });
  }),

  editScore: asyncHandler(async (req, res) => {
    const score = await adminService.editUserScore(req.params.scoreId, req.body.score);
    res.json({ success: true, data: score });
  }),

  deleteScore: asyncHandler(async (req, res) => {
    const result = await adminService.deleteUserScore(req.params.scoreId);
    res.json({ success: true, ...result });
  }),
};