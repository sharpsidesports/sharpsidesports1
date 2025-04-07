-- Add stripe_customer_id column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles(stripe_customer_id);

-- Update RLS policies to include the new column
ALTER POLICY "Users can view own profile"
  ON profiles
  USING (auth.uid() = id);

ALTER POLICY "Users can update own profile"
  ON profiles
  USING (auth.uid() = id); 