import { supabase } from '../../lib/supabase.js';

export const charityRepository = {
  async findAll({ search, featured } = {}) {
    let query = supabase
      .from('charities')
      .select('*')
      .eq('is_active', true);

    if (search) query = query.ilike('name', `%${search}%`);
    if (featured === 'true') query = query.eq('is_featured', true);

    const { data, error } = await query.order('is_featured', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('charities')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('charities')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    // Soft delete — set is_active to false
    const { error } = await supabase
      .from('charities')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
  },

  async getTotalContributions(charityId) {
    const { data, error } = await supabase
      .from('charity_contributions')
      .select('amount')
      .eq('charity_id', charityId);
    if (error) throw error;
    return data.reduce((sum, c) => sum + Number(c.amount), 0);
  },
};