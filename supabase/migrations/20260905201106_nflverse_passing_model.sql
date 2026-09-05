-- Passing Model (Attempts Over Expected / Yards Over Expected): widens
-- nflverse_team_week_stats with passing/rushing columns needed for pace and
-- yards-allowed derivation, and adds QB stats, Vegas game lines, and the
-- computed passing projections table. Same project as the reception model
-- (public sports/market data, no PII) — RLS follows the same open-read
-- pattern, writes restricted to the service role.

ALTER TABLE public.nflverse_team_week_stats
    ADD COLUMN IF NOT EXISTS completions NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS passing_yards NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS passing_tds NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS passing_interceptions NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sacks_suffered NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS passing_air_yards NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS carries NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rushing_yards NUMERIC NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.nflverse_qb_week_stats (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    position TEXT NOT NULL,
    team TEXT NOT NULL,
    opponent_team TEXT,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    season_type TEXT NOT NULL DEFAULT 'REG',
    game_id TEXT,
    completions NUMERIC NOT NULL DEFAULT 0,
    attempts NUMERIC NOT NULL DEFAULT 0,
    passing_yards NUMERIC NOT NULL DEFAULT 0,
    passing_tds NUMERIC NOT NULL DEFAULT 0,
    passing_interceptions NUMERIC NOT NULL DEFAULT 0,
    sacks_suffered NUMERIC NOT NULL DEFAULT 0,
    sack_yards_lost NUMERIC NOT NULL DEFAULT 0,
    passing_air_yards NUMERIC NOT NULL DEFAULT 0,
    passing_yards_after_catch NUMERIC NOT NULL DEFAULT 0,
    passing_first_downs NUMERIC NOT NULL DEFAULT 0,
    passing_epa NUMERIC,
    passing_cpoe NUMERIC,
    pacr NUMERIC,
    carries NUMERIC NOT NULL DEFAULT 0,
    rushing_yards NUMERIC NOT NULL DEFAULT 0,
    rushing_tds NUMERIC NOT NULL DEFAULT 0,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

-- One row per team per game (not per game) so it joins the same way
-- nflverse_team_week_stats does. spread is this team's own spread
-- (negative = favorite); total is the game's over/under (same value on
-- both teams' rows for a given game).
CREATE TABLE IF NOT EXISTS public.nflverse_game_lines (
    id BIGSERIAL PRIMARY KEY,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    team TEXT NOT NULL,
    opponent_team TEXT NOT NULL,
    is_home BOOLEAN,
    spread NUMERIC,
    total NUMERIC,
    implied_team_total NUMERIC,
    bookmaker TEXT NOT NULL DEFAULT 'consensus',
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (season, week, team, bookmaker)
);

CREATE TABLE IF NOT EXISTS public.passing_projections (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    team TEXT NOT NULL,
    opponent_team TEXT,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,

    espn_projected_attempts NUMERIC,
    espn_projected_passing_yards NUMERIC,

    projected_team_pass_attempts NUMERIC,
    expected_total_plays NUMERIC,
    expected_pass_rate NUMERIC,
    expected_attempts NUMERIC,
    attempts_over_expected NUMERIC,

    expected_yards_per_attempt NUMERIC,
    expected_passing_yards NUMERIC,
    projected_passing_yards NUMERIC,
    yards_over_expected NUMERIC,

    vegas_spread NUMERIC,
    vegas_total NUMERIC,
    vegas_implied_team_total NUMERIC,

    data_season INTEGER,
    data_week INTEGER,
    data_last_updated TIMESTAMP WITH TIME ZONE,

    confidence TEXT,
    fallbacks_used JSONB NOT NULL DEFAULT '[]'::jsonb,
    warnings JSONB NOT NULL DEFAULT '[]'::jsonb,

    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

CREATE INDEX IF NOT EXISTS idx_nflverse_qb_week_season_week ON public.nflverse_qb_week_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_qb_week_gsis ON public.nflverse_qb_week_stats(gsis_id);
CREATE INDEX IF NOT EXISTS idx_nflverse_game_lines_season_week ON public.nflverse_game_lines(season, week);
CREATE INDEX IF NOT EXISTS idx_passing_projections_season_week ON public.passing_projections(season, week);

ALTER TABLE public.nflverse_qb_week_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nflverse_game_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passing_projections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_qb_week_stats;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_game_lines;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.passing_projections;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Enable read access for all users" ON public.nflverse_qb_week_stats FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.nflverse_game_lines FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.passing_projections FOR SELECT USING (true);
