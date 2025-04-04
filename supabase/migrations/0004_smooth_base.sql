/*
  # Upgrade User Subscription

  1. Changes
    - Updates subscription tier to 'pro' for specified user
    - Updates subscription status to ensure it's active

  2. Security
    - Uses RLS policies already in place
    - Only affects specified user
*/

UPDATE profiles
SET 
  subscription_tier = 'pro',
  subscription_status = 'active',
  updated_at = now()
WHERE email = auth.email();