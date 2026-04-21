import { drawsRepository } from './draws.repository.js';
import { drawEngine } from './drawEngine.service.js';
import { prizePoolService } from './prizePool.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { logger } from '../../utils/logger.js';

export const drawsService = {
  async listAll(filters) {
    return drawsRepository.findAll(filters);
  },

  async getById(id) {
    const draw = await drawsRepository.findById(id);
    if (!draw) throw ApiError.notFound('Draw not found');
    return draw;
  },

  async getLatestPublished() {
    return drawsRepository.findLatestPublished();
  },

  /**
   * Executes a draw (simulate or persist).
   * - Generates winning numbers
   * - Snapshots active subscribers' 5 latest scores
   * - Computes matches + prize pools
   * - Creates draw_entries and winners (if not simulate mode)
   */
  async runDraw({ drawMonth, drawType, simulateOnly }) {
    // Check if draw already exists for this month
    const existing = await drawsRepository.findByMonth(drawMonth);
    if (existing && existing.status === 'published') {
      throw ApiError.conflict(`Draw for ${drawMonth} is already published`);
    }

    // Fetch active subscribers with their scores
    const subscribers = await drawsRepository.getActiveSubscribersWithScores();
    if (subscribers.length === 0) {
      throw ApiError.badRequest('No active subscribers with scores');
    }

    // Generate winning numbers
    const drawNumbers = drawType === 'algorithmic'
      ? drawEngine.generateAlgorithmicNumbers(subscribers)
      : drawEngine.generateRandomNumbers();

    // Calculate prize pools
    const pools = await prizePoolService.calculatePools(drawMonth);

    // Compute matches for each subscriber
    const entries = [];
    const winners = { '5-match': [], '4-match': [], '3-match': [] };

    for (const sub of subscribers) {
      const { matches, matchType } = drawEngine.matchScores(sub.scores, drawNumbers);
      entries.push({
        user_id: sub.userId,
        user_scores: sub.scores,
        matches,
        match_type: matchType,
      });
      if (matchType) winners[matchType].push(sub.userId);
    }

    // Distribute prizes
    const prizePerWinner = {
      '5-match': prizePoolService.distributeAmong(pools.pool_5_match, winners['5-match'].length),
      '4-match': prizePoolService.distributeAmong(pools.pool_4_match, winners['4-match'].length),
      '3-match': prizePoolService.distributeAmong(pools.pool_3_match, winners['3-match'].length),
    };

    // Simulation summary
    const summary = {
      draw_month: drawMonth,
      draw_type: drawType,
      draw_numbers: drawNumbers,
      ...pools,
      total_subscribers: subscribers.length,
      winners_count: {
        '5-match': winners['5-match'].length,
        '4-match': winners['4-match'].length,
        '3-match': winners['3-match'].length,
      },
      prize_per_winner: prizePerWinner,
    };

    if (simulateOnly) {
      logger.info({ summary }, 'Draw simulation complete');
      return { simulation: true, summary };
    }

    // Persist draw in 'simulated' status (admin must publish)
    let draw;
    if (existing) {
      draw = await drawsRepository.update(existing.id, {
        draw_numbers: drawNumbers,
        draw_type: drawType,
        status: 'simulated',
        total_pool: pools.total_pool,
        pool_5_match: pools.pool_5_match,
        pool_4_match: pools.pool_4_match,
        pool_3_match: pools.pool_3_match,
        rollover_amount: pools.rollover_amount,
        executed_at: new Date().toISOString(),
      });
    } else {
      draw = await drawsRepository.create({
        draw_month: drawMonth,
        draw_numbers: drawNumbers,
        draw_type: drawType,
        status: 'simulated',
        total_pool: pools.total_pool,
        pool_5_match: pools.pool_5_match,
        pool_4_match: pools.pool_4_match,
        pool_3_match: pools.pool_3_match,
        rollover_amount: pools.rollover_amount,
        executed_at: new Date().toISOString(),
      });
    }

    // Insert draw entries
    const entriesWithDrawId = entries.map(e => ({ ...e, draw_id: draw.id }));
    await drawsRepository.insertDrawEntries(entriesWithDrawId);

    // Create winners records
    const winnerRecords = [];
    for (const matchType of ['5-match', '4-match', '3-match']) {
      for (const userId of winners[matchType]) {
        winnerRecords.push({
          draw_id: draw.id,
          user_id: userId,
          match_type: matchType,
          prize_amount: prizePerWinner[matchType],
          verification_status: 'pending',
          payment_status: 'pending',
        });
      }
    }
    await drawsRepository.insertWinners(winnerRecords);

    return { simulation: false, draw, summary };
  },

  /**
   * Admin publishes a simulated draw (makes it visible to users + sends emails).
   */
  async publishDraw(drawId) {
    const draw = await drawsRepository.findById(drawId);
    if (!draw) throw ApiError.notFound('Draw not found');
    if (draw.status !== 'simulated') {
      throw ApiError.badRequest('Only simulated draws can be published');
    }

    const published = await drawsRepository.update(drawId, {
      status: 'published',
      published_at: new Date().toISOString(),
    });

    // Send emails (async, don't block)
    this._notifyParticipantsAsync(drawId).catch(err => {
      logger.error({ err }, 'Failed to notify draw participants');
    });

    return published;
  },

  async _notifyParticipantsAsync(drawId) {
    const { sendDrawResultsEmail, sendWinnerAlertEmail } = await import('../../emails/sendEmail.js');
    const entries = await drawsRepository.getDrawEntriesByDraw(drawId);
    const draw = await drawsRepository.findById(drawId);

    for (const entry of entries) {
      if (!entry.users?.email) continue;
      if (entry.match_type) {
        // Winner email
        sendWinnerAlertEmail(
          entry.users.email,
          entry.users.full_name,
          entry.match_type,
          draw.draw_month
        ).catch(err => logger.error({ err }, 'Email failed'));
      } else {
        // Regular results email
        sendDrawResultsEmail(
          entry.users.email,
          entry.users.full_name,
          draw.draw_month,
          draw.draw_numbers
        ).catch(err => logger.error({ err }, 'Email failed'));
      }
    }
  },

  async deleteDraw(id) {
    const draw = await drawsRepository.findById(id);
    if (!draw) throw ApiError.notFound('Draw not found');
    if (draw.status === 'published') {
      throw ApiError.badRequest('Cannot delete a published draw');
    }
    await drawsRepository.delete(id);
    return { message: 'Draw deleted' };
  },
};