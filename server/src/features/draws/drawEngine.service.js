import { DRAW_RULES } from '../../config/constants.js';

/**
 * Core draw engine — generates winning numbers and matches entries.
 */
export const drawEngine = {
  /** Generates 5 unique random numbers between MIN and MAX */
  generateRandomNumbers() {
    const numbers = new Set();
    while (numbers.size < DRAW_RULES.NUMBERS_TO_MATCH) {
      const n = Math.floor(
        Math.random() * (DRAW_RULES.MAX_NUMBER - DRAW_RULES.MIN_NUMBER + 1)
      ) + DRAW_RULES.MIN_NUMBER;
      numbers.add(n);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  },

  /**
   * Algorithmic: weighted by most frequent user scores.
   * Picks from the top 15 most common scores across all subscribers.
   */
  generateAlgorithmicNumbers(subscribers) {
    const frequency = {};
    for (const sub of subscribers) {
      for (const score of sub.scores) {
        frequency[score] = (frequency[score] || 0) + 1;
      }
    }

    // Sort scores by frequency descending
    const ranked = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .map(([score]) => Number(score));

    // Fallback to random if insufficient data
    if (ranked.length < DRAW_RULES.NUMBERS_TO_MATCH) {
      return this.generateRandomNumbers();
    }

    // Take top 15, weighted pick of 5
    const pool = ranked.slice(0, 15);
    const numbers = new Set();
    while (numbers.size < DRAW_RULES.NUMBERS_TO_MATCH && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      numbers.add(pool[idx]);
      pool.splice(idx, 1);
    }

    // Top up with random if needed
    while (numbers.size < DRAW_RULES.NUMBERS_TO_MATCH) {
      const n = Math.floor(
        Math.random() * (DRAW_RULES.MAX_NUMBER - DRAW_RULES.MIN_NUMBER + 1)
      ) + DRAW_RULES.MIN_NUMBER;
      numbers.add(n);
    }

    return Array.from(numbers).sort((a, b) => a - b);
  },

  /**
   * Matches each subscriber's scores against draw numbers.
   * Returns match count and match_type.
   */
  matchScores(userScores, drawNumbers) {
    const drawSet = new Set(drawNumbers);
    const matches = userScores.filter(s => drawSet.has(s)).length;

    let matchType = null;
    if (matches >= 5) matchType = '5-match';
    else if (matches === 4) matchType = '4-match';
    else if (matches === 3) matchType = '3-match';

    return { matches, matchType };
  },
};