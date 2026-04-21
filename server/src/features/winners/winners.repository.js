import { supabase } from '../../lib/supabase.js';

export const winnersRepository = {
  async findById(id) {
    const { data, error } = await supabase
      .from('winners')
      .select('*, users(id, email, full_name), draws(draw_month)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findByUser(userId) {
    const { data, error } = await supabase
      .from('winners')
      .select('*, draws(draw_month, draw_numbers)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findAll({ status } = {}) {
    let query = supabase
      .from('winners')
      .select('*, users(id, email, full_name), draws(draw_month)')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('verification_status', status);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('winners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};