import { supabase } from '../../lib/supabase.js';

export const drawsRepository = {
  async findAll({ status } = {}) {
    let query = supabase.from('draws').select('*').order('draw_month', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findByMonth(drawMonth) {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('draw_month', drawMonth)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findLatestPublished() {
    const { data, error } = await supabase
      .from('draws')
      .select('*')
      .eq('status', 'published')
      .order('draw_month', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('draws')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('draws')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase.from('draws').delete().eq('id', id);
    if (error) throw error;
  },

  // Get all active subscribers with their 5 latest scores
  async getActiveSubscribersWithScores() {
    const { data: activeSubs, error: subErr } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('status', 'active')
      .gte('current_period_end', new Date().toISOString());

    if (subErr) throw subErr;

    const subscribers = [];
    for (const sub of activeSubs) {
      const { data: scores } = await supabase
        .from('scores')
        .select('score, play_date')
        .eq('user_id', sub.user_id)
        .order('play_date', { ascending: false })
        .limit(5);

      if (scores && scores.length > 0) {
        subscribers.push({
          userId: sub.user_id,
          scores: scores.map(s => s.score),
        });
      }
    }

    return subscribers;
  },

  // Get total subscription revenue for a month
  async getMonthRevenue(drawMonth) {
    const [year, month] = drawMonth.split('-');
    const start = `${year}-${month}-01`;
    const endDate = new Date(year, Number(month), 0);
    const end = endDate.toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('subscriptions')
      .select('amount, charity_contributions!left(amount)')
      .eq('status', 'active')
      .gte('created_at', start)
      .lte('created_at', end);

    if (error) throw error;

    // Revenue minus charity portion
    let totalPool = 0;
    for (const sub of data) {
      const charityTotal = (sub.charity_contributions || []).reduce(
        (sum, c) => sum + Number(c.amount), 0
      );
      totalPool += Number(sub.amount) - charityTotal;
    }
    return totalPool;
  },

  async insertDrawEntries(entries) {
    if (!entries.length) return [];
    const { data, error } = await supabase
      .from('draw_entries')
      .insert(entries)
      .select();
    if (error) throw error;
    return data;
  },

  async insertWinners(winners) {
    if (!winners.length) return [];
    const { data, error } = await supabase
      .from('winners')
      .insert(winners)
      .select();
    if (error) throw error;
    return data;
  },

  async getDrawEntriesByDraw(drawId) {
    const { data, error } = await supabase
      .from('draw_entries')
      .select('*, users(id, email, full_name)')
      .eq('draw_id', drawId);
    if (error) throw error;
    return data;
  },
};