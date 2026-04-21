import { PRIZE_POOL_DISTRIBUTION } from '../../config/constants.js';
import { drawsRepository } from './draws.repository.js';

export const prizePoolService = {
  /**
   * Calculates pool distribution for a draw month.
   * Includes rollover from previous unclaimed 5-match jackpot.
   */
  async calculatePools(drawMonth) {
    const totalPool = await drawsRepository.getMonthRevenue(drawMonth);

    // Check previous draw for 5-match rollover
    const previousDraw = await drawsRepository.findLatestPublished();
    let rolloverAmount = 0;

    if (previousDraw) {
      // Was there a 5-match winner in the previous draw?
      const { supabase } = await import('../../lib/supabase.js');
      const { data: fiveMatchWinners } = await supabase
        .from('winners')
        .select('id')
        .eq('draw_id', previousDraw.id)
        .eq('match_type', '5-match');

      if (!fiveMatchWinners || fiveMatchWinners.length === 0) {
        // No 5-match winner → rollover previous 5-match pool
        rolloverAmount = Number(previousDraw.pool_5_match) + Number(previousDraw.rollover_amount || 0);
      }
    }

    const pool5 = (totalPool * PRIZE_POOL_DISTRIBUTION.FIVE_MATCH) + rolloverAmount;
    const pool4 = totalPool * PRIZE_POOL_DISTRIBUTION.FOUR_MATCH;
    const pool3 = totalPool * PRIZE_POOL_DISTRIBUTION.THREE_MATCH;

    return {
      total_pool: totalPool,
      pool_5_match: Math.round(pool5 * 100) / 100,
      pool_4_match: Math.round(pool4 * 100) / 100,
      pool_3_match: Math.round(pool3 * 100) / 100,
      rollover_amount: Math.round(rolloverAmount * 100) / 100,
    };
  },

  /** Distributes a pool equally among winners */
  distributeAmong(pool, winnerCount) {
    if (winnerCount === 0) return 0;
    return Math.round((pool / winnerCount) * 100) / 100;
  },
};