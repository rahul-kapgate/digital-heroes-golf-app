import { scoresService } from './scores.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const scoresController = {
  getAll: asyncHandler(async (req, res) => {
    const scores = await scoresService.getAll(req.user.id);
    res.json({ success: true, data: scores });
  }),

  create: asyncHandler(async (req, res) => {
    const score = await scoresService.create(req.user.id, req.body);
    res.status(201).json({ success: true, message: 'Score added', data: score });
  }),

  update: asyncHandler(async (req, res) => {
    const score = await scoresService.update(req.params.id, req.user.id, req.body);
    res.json({ success: true, message: 'Score updated', data: score });
  }),

  delete: asyncHandler(async (req, res) => {
    const result = await scoresService.delete(req.params.id, req.user.id);
    res.json({ success: true, ...result });
  }),
};