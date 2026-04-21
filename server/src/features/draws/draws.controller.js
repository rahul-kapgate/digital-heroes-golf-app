import { drawsService } from './draws.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const drawsController = {
  list: asyncHandler(async (req, res) => {
    const draws = await drawsService.listAll(req.query);
    res.json({ success: true, data: draws });
  }),

  getLatest: asyncHandler(async (req, res) => {
    const latest = await drawsService.getLatestPublished();
    res.json({ success: true, data: latest });
  }),

  getById: asyncHandler(async (req, res) => {
    const draw = await drawsService.getById(req.params.id);
    res.json({ success: true, data: draw });
  }),

  run: asyncHandler(async (req, res) => {
    const result = await drawsService.runDraw(req.body);
    res.json({ success: true, data: result });
  }),

  publish: asyncHandler(async (req, res) => {
    const draw = await drawsService.publishDraw(req.params.id);
    res.json({ success: true, message: 'Draw published', data: draw });
  }),

  delete: asyncHandler(async (req, res) => {
    const result = await drawsService.deleteDraw(req.params.id);
    res.json({ success: true, ...result });
  }),
};