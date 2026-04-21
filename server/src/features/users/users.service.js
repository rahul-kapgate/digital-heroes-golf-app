import { usersRepository } from './users.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { ApiError } from '../../utils/ApiError.js';
import { supabase } from '../../lib/supabase.js';

export const usersService = {
  async getProfile(userId) {
    return usersRepository.findById(userId);
  },

  async updateProfile(userId, updates) {
    if (updates.selectedCharityId) {
      const { data } = await supabase
        .from('charities')
        .select('id')
        .eq('id', updates.selectedCharityId)
        .eq('is_active', true)
        .maybeSingle();
      if (!data) throw ApiError.badRequest('Selected charity is invalid');
    }
    return usersRepository.updateProfile(userId, updates);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    const currentHash = await usersRepository.getPasswordHash(userId);
    const isValid = await comparePassword(currentPassword, currentHash);
    if (!isValid) throw ApiError.unauthorized('Current password is incorrect');

    const newHash = await hashPassword(newPassword);
    await usersRepository.updatePasswordHash(userId, newHash);
    return { message: 'Password updated successfully' };
  },

  async getDashboard(userId) {
    return usersRepository.getDashboardData(userId);
  },
};