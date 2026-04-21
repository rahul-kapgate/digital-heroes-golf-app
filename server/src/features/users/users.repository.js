import { supabase } from '../../lib/supabase.js';

export const usersRepository = {
  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, selected_charity_id, charity_percentage, created_at')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(id, updates) {
    const dbUpdates = {};
    if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
    if (updates.selectedCharityId !== undefined) dbUpdates.selected_charity_id = updates.selectedCharityId;
    if (updates.charityPercentage !== undefined) dbUpdates.charity_percentage = updates.charityPercentage;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .select('id, email, full_name, selected_charity_id, charity_percentage')
      .single();

    if (error) throw error;
    return data;
  },

  async getPasswordHash(id) {
    const { data, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data.password_hash;
  },

  async updatePasswordHash(id, passwordHash) {
    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash })
      .eq('id', id);
    if (error) throw error;
  },

  async getDashboardData(userId) {
    // Get active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get selected charity
    const { data: user } = await supabase
      .from('users')
      .select('selected_charity_id, charity_percentage, charities(*)')
      .eq('id', userId)
      .single();

    // Get scores
    const { data: scores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('play_date', { ascending: false })
      .limit(5);

    // Get winnings
    const { data: winnings } = await supabase
      .from('winners')
      .select('*, draws(draw_month)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Get draw participations count
    const { count: drawsEntered } = await supabase
      .from('draw_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const totalWon = (winnings || []).reduce((sum, w) => 
      w.payment_status === 'paid' ? sum + Number(w.prize_amount) : sum, 0
    );

    return {
      subscription: subscription || null,
      charity: user?.charities || null,
      charity_percentage: user?.charity_percentage,
      scores: scores || [],
      winnings: winnings || [],
      stats: {
        draws_entered: drawsEntered || 0,
        total_won: totalWon,
      },
    };
  },
};