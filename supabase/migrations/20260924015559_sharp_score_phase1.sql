-- Sharp Score Phase 1: Implied Team Total, Matchup (opp TDs/game allowed),
-- season Targets/Game & Catch %, Reception Debt, and a composite Sharp
-- Score for the reception model. Adds rushing_tds to the team-week table
-- (needed for Matchup; passing_tds already covers the through-the-air side)
-- and new output columns to reception_projections.

ALTER TABLE public.nflverse_team_week_stats
    ADD COLUMN IF NOT EXISTS rushing_tds NUMERIC NOT NULL DEFAULT 0;

ALTER TABLE public.reception_projections
    ADD COLUMN IF NOT EXISTS implied_team_total NUMERIC,
    ADD COLUMN IF NOT EXISTS opp_td_rate_allowed NUMERIC,
    ADD COLUMN IF NOT EXISTS opp_catch_pct_allowed NUMERIC,
    ADD COLUMN IF NOT EXISTS targets_per_game NUMERIC,
    ADD COLUMN IF NOT EXISTS catch_pct_season NUMERIC,
    ADD COLUMN IF NOT EXISTS reception_debt NUMERIC,
    ADD COLUMN IF NOT EXISTS sharp_score INTEGER;
