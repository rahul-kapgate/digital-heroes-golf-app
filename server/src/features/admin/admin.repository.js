import { supabase } from '../../lib/supabase.js';

export const adminRepository = {
  async listUsers({ search, role } = {}) {
    let query = supabase
      .from('users')
      .select('id, email, full_name, role, selected_charity_id, charity_percentage, created_at, charities(name)')
      .order('created_at', { ascending: false });

    if (search) query = query.ilike('email', `%${search}%`);
    if (role) query = query.eq('role', role);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getUserById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, selected_charity_id, charity_percentage, created_at')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select('id, email, full_name, role')
      .single();
    if (error) throw error;
    return data;
  },

  async getAnalytics() {
    const [users, activeSubs, draws, winners, contributions] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('draws').select('id', { count: 'exact', head: true }),
      supabase.from('winners').select('prize_amount'),
      supabase.from('charity_contributions').select('amount'),
    ]);

    const totalPrizesAwarded = (winners.data || []).reduce(
      (sum, w) => sum + Number(w.prize_amount), 0
    );
    const totalCharityContributions = (contributions.data || []).reduce(
      (sum, c) => sum + Number(c.amount), 0
    );

    return {
      total_users: users.count || 0,
      active_subscriptions: activeSubs.count || 0,
      total_draws: draws.count || 0,
      total_prizes_awarded: Math.round(totalPrizesAwarded * 100) / 100,
      total_charity_contributions: Math.round(totalCharityContributions * 100) / 100,
    };
  },

  async adminUpdateScore(scoreId, score) {
    const { data, error } = await supabase
      .from('scores')
      .update({ score })
      .eq('id', scoreId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async adminDeleteScore(scoreId) {
    const { error } = await supabase.from('scores').delete().eq('id', scoreId);
    if (error) throw error;
  },
};