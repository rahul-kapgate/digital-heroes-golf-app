import { scoresRepository } from './scores.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { SCORE_RULES } from '../../config/constants.js';

export const scoresService = {
  async getAll(userId) {
    return scoresRepository.findAllByUser(userId);
  },

  async create(userId, { score, playDate }) {
    // Rule: Only one score per date
    const existing = await scoresRepository.findByDate(userId, playDate);
    if (existing) {
      throw ApiError.conflict(
        'A score for this date already exists. Please edit or delete it first.'
      );
    }

    // Get current scores
    const currentScores = await scoresRepository.findAllByUser(userId);

    // If user has 5 scores, delete the oldest before inserting
    if (currentScores.length >= SCORE_RULES.MAX_SCORES_PER_USER) {
      await scoresRepository.deleteOldest(userId);
    }

    return scoresRepository.create({ userId, score, playDate });
  },

  async update(id, userId, { score }) {
    const existing = await scoresRepository.findById(id, userId);
    if (!existing) throw ApiError.notFound('Score not found');
    return scoresRepository.update(id, userId, { score });
  },

  async delete(id, userId) {
    const existing = await scoresRepository.findById(id, userId);
    if (!existing) throw ApiError.notFound('Score not found');
    await scoresRepository.delete(id, userId);
    return { message: 'Score deleted' };
  },
};