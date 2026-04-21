import { charityRepository } from './charity.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const charityService = {
  async list(filters) {
    return charityRepository.findAll(filters);
  },

  async getById(id) {
    const charity = await charityRepository.findById(id);
    if (!charity) throw ApiError.notFound('Charity not found');
    const totalContributions = await charityRepository.getTotalContributions(id);
    return { ...charity, total_contributions: totalContributions };
  },

  // Admin functions
  async create(payload) {
    return charityRepository.create(payload);
  },

  async update(id, payload) {
    const existing = await charityRepository.findById(id);
    if (!existing) throw ApiError.notFound('Charity not found');
    return charityRepository.update(id, payload);
  },

  async delete(id) {
    const existing = await charityRepository.findById(id);
    if (!existing) throw ApiError.notFound('Charity not found');
    await charityRepository.delete(id);
    return { message: 'Charity deleted' };
  },
};