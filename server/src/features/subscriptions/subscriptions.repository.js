import { supabase } from '../../lib/supabase.js';

export const subscriptionsRepository = {
  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async findByStripeSubId(stripeSubscriptionId) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async upsert(payload) {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(payload, { onConflict: 'stripe_subscription_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateByStripeSubId(stripeSubscriptionId, updates) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateStripeCustomerId(userId, stripeCustomerId) {
    const { error } = await supabase
      .from('users')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', userId);
    if (error) throw error;
  },

  async getUserInfo(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, stripe_customer_id, selected_charity_id, charity_percentage')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },

  async recordCharityContribution({ userId, charityId, subscriptionId, amount, percentage }) {
    const { error } = await supabase
      .from('charity_contributions')
      .insert({
        user_id: userId,
        charity_id: charityId,
        subscription_id: subscriptionId,
        amount,
        percentage,
        type: 'subscription',
      });
    if (error) throw error;
  },
};