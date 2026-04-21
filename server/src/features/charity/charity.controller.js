import { charityService } from './charity.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const charityController = {
  list: asyncHandler(async (req, res) => {
    const charities = await charityService.list(req.query);
    res.json({ success: true, data: charities });
  }),

  getById: asyncHandler(async (req, res) => {
    const charity = await charityService.getById(req.params.id);
    res.json({ success: true, data: charity });
  }),

  create: asyncHandler(async (req, res) => {
    const charity = await charityService.create(req.body);
    res.status(201).json({ success: true, data: charity });
  }),

  update: asyncHandler(async (req, res) => {
    const charity = await charityService.update(req.params.id, req.body);
    res.json({ success: true, data: charity });
  }),

  delete: asyncHandler(async (req, res) => {
    const result = await charityService.delete(req.params.id);
    res.json({ success: true, ...result });
  }),
};