import { winnersRepository } from './winners.repository.js';
import { ApiError } from '../../utils/ApiError.js';

export const winnersService = {
  async getMyWinnings(userId) {
    return winnersRepository.findByUser(userId);
  },

  async getById(id, userId, isAdmin = false) {
    const winner = await winnersRepository.findById(id);
    if (!winner) throw ApiError.notFound('Winner record not found');
    if (!isAdmin && winner.user_id !== userId) {
      throw ApiError.forbidden('Access denied');
    }
    return winner;
  },

  async uploadProof(id, userId, file) {
    const winner = await winnersRepository.findById(id);
    if (!winner) throw ApiError.notFound('Winner record not found');
    if (winner.user_id !== userId) throw ApiError.forbidden('Access denied');
    if (winner.verification_status === 'approved') {
      throw ApiError.badRequest('This winner has already been approved');
    }

    const proofUrl = `/uploads/proofs/${file.filename}`;
    return winnersRepository.update(id, {
      proof_url: proofUrl,
      proof_uploaded_at: new Date().toISOString(),
      verification_status: 'proof_uploaded',
    });
  },

  async listAll(filters) {
    return winnersRepository.findAll(filters);
  },

  async verify(id, { action, adminNotes }) {
    const winner = await winnersRepository.findById(id);
    if (!winner) throw ApiError.notFound('Winner not found');

    const verification_status = action === 'approve' ? 'approved' : 'rejected';

    return winnersRepository.update(id, {
      verification_status,
      verified_at: new Date().toISOString(),
      admin_notes: adminNotes || null,
    });
  },

  async markPaid(id) {
    const winner = await winnersRepository.findById(id);
    if (!winner) throw ApiError.notFound('Winner not found');
    if (winner.verification_status !== 'approved') {
      throw ApiError.badRequest('Winner must be approved before marking paid');
    }
    return winnersRepository.update(id, {
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
    });
  },
};