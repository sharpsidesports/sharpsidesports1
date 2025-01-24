-- Add gir column to player_rounds table
ALTER TABLE public.player_rounds ADD COLUMN IF NOT EXISTS gir DECIMAL;
