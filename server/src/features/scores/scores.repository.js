import { supabase } from '../../lib/supabase.js';

export const scoresRepository = {
  async findAllByUser(userId) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('play_date', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findById(id, userId) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findByDate(userId, playDate) {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .eq('play_date', playDate)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create({ userId, score, playDate }) {
    const { data, error } = await supabase
      .from('scores')
      .insert({ user_id: userId, score, play_date: playDate })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, userId, { score }) {
    const { data, error } = await supabase
      .from('scores')
      .update({ score })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id, userId) {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    if (error) throw error;
  },

  async deleteOldest(userId) {
    // Find the oldest score
    const { data: oldest, error: findErr } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', userId)
      .order('play_date', { ascending: true })
      .limit(1)
      .single();
    
    if (findErr) throw findErr;

    const { error: delErr } = await supabase
      .from('scores')
      .delete()
      .eq('id', oldest.id);
    if (delErr) throw delErr;
  },
};