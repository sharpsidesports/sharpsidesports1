/*
  # Update Profiles Schema and Policies

  1. Changes
    - Add subscription_tier and subscription_status columns
    - Add updated_at column
    - Add trigger for updating updated_at timestamp
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier') 
  THEN
    ALTER TABLE profiles 
    ADD COLUMN subscription_tier text NOT NULL DEFAULT 'free';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'subscription_status') 
  THEN
    ALTER TABLE profiles 
    ADD COLUMN subscription_status text NOT NULL DEFAULT 'active';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at') 
  THEN
    ALTER TABLE profiles 
    ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;   
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamp
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();