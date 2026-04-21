import { supabase } from '../../lib/supabase.js';

export const authRepository = {
  async findUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createUser({ email, passwordHash, fullName, selectedCharityId, charityPercentage }) {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        selected_charity_id: selectedCharityId,
        charity_percentage: charityPercentage,
        role: 'user',
      })
      .select('id, email, full_name, role, selected_charity_id, charity_percentage, created_at')
      .single();

    if (error) throw error;
    return data;
  },

  async verifyCharityExists(charityId) {
    const { data, error } = await supabase
      .from('charities')
      .select('id')
      .eq('id', charityId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },
};