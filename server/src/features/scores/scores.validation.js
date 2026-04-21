import { z } from 'zod';
import { SCORE_RULES } from '../../config/constants.js';

export const createScoreSchema = z.object({
  score: z.number()
    .int('Score must be an integer')
    .min(SCORE_RULES.MIN_SCORE, `Score must be at least ${SCORE_RULES.MIN_SCORE}`)
    .max(SCORE_RULES.MAX_SCORE, `Score must be at most ${SCORE_RULES.MAX_SCORE}`),
  playDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const updateScoreSchema = z.object({
  score: z.number().int()
    .min(SCORE_RULES.MIN_SCORE)
    .max(SCORE_RULES.MAX_SCORE),
});