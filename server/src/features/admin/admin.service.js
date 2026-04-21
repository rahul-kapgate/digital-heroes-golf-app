import { adminRepository } from './admin.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const adminService = {
  async listUsers(filters) {
    return adminRepository.listUsers(filters);
  },

  async getUserById(id) {
    const user = await adminRepository.getUserById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async updateUser(id, updates) {
    const allowed = {};
    if (updates.fullName !== undefined) allowed.full_name = updates.fullName;
    if (updates.role !== undefined) allowed.role = updates.role;
    if (updates.charityPercentage !== undefined) allowed.charity_percentage = updates.charityPercentage;

    return adminRepository.updateUser(id, allowed);
  },

  async getAnalytics() {
    return adminRepository.getAnalytics();
  },

  async editUserScore(scoreId, score) {
    return adminRepository.adminUpdateScore(scoreId, score);
  },

  async deleteUserScore(scoreId) {
    await adminRepository.adminDeleteScore(scoreId);
    return { message: 'Score deleted' };
  },
};