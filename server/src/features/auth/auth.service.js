import { authRepository } from './auth.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { signToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/ApiError.js';
import { sendWelcomeEmail } from '../../emails/sendEmail.js';
import { logger } from '../../utils/logger.js';

export const authService = {
  async signup({ email, password, fullName, selectedCharityId, charityPercentage }) {
    // Check if user exists
    const existing = await authRepository.findUserByEmail(email);
    if (existing) {
      throw ApiError.conflict('Email already registered');
    }

    // Verify charity exists
    const charityExists = await authRepository.verifyCharityExists(selectedCharityId);
    if (!charityExists) {
      throw ApiError.badRequest('Selected charity does not exist or is inactive');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await authRepository.createUser({
      email,
      passwordHash,
      fullName,
      selectedCharityId,
      charityPercentage,
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.full_name).catch(err => {
      logger.error({ err }, 'Failed to send welcome email');
    });

    // Generate token
    const token = signToken({ userId: user.id, role: user.role });

    return { user, token };
  },

  async login({ email, password }) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const token = signToken({ userId: user.id, role: user.role });

    // Remove password hash from response
    const { password_hash, ...safeUser } = user;

    return { user: safeUser, token };
  },

  async getMe(userId) {
    const { data, error } = await (await import('../../lib/supabase.js')).supabase
      .from('users')
      .select('id, email, full_name, role, selected_charity_id, charity_percentage, created_at')
      .eq('id', userId)
      .single();

    if (error || !data) throw ApiError.notFound('User not found');
    return data;
  },
};