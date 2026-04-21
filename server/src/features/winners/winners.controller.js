import { winnersService } from './winners.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/ApiError.js';

export const winnersController = {
  getMyWinnings: asyncHandler(async (req, res) => {
    const winnings = await winnersService.getMyWinnings(req.user.id);
    res.json({ success: true, data: winnings });
  }),

  getById: asyncHandler(async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const winner = await winnersService.getById(req.params.id, req.user.id, isAdmin);
    res.json({ success: true, data: winner });
  }),

  uploadProof: asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest('No file uploaded');
    const result = await winnersService.uploadProof(req.params.id, req.user.id, req.file);
    res.json({ success: true, message: 'Proof uploaded', data: result });
  }),

  listAll: asyncHandler(async (req, res) => {
    const winners = await winnersService.listAll(req.query);
    res.json({ success: true, data: winners });
  }),

  verify: asyncHandler(async (req, res) => {
    const result = await winnersService.verify(req.params.id, req.body);
    res.json({ success: true, message: `Winner ${req.body.action}d`, data: result });
  }),

  markPaid: asyncHandler(async (req, res) => {
    const result = await winnersService.markPaid(req.params.id);
    res.json({ success: true, message: 'Marked as paid', data: result });
  }),
};