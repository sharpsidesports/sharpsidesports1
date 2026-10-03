-- Snap counts (role/playing-time signal) and NGS receiving (separation/
-- cushion/YAC-above-expectation — a catch-quality signal) for the Reception
-- Model's "Overlooked" badge and new matchup-quality detail stats.
-- Both are additive display-layer inputs — neither feeds Sharp Score or the
-- core reception-projection formula.

-- Snap counts are keyed by pfr_player_id, not gsis_id — nflverse's players.csv
-- (our crosswalk source) carries a pfr_id column, so this is a direct ID join.
ALTER TABLE public.player_crosswalk
    ADD COLUMN IF NOT EXISTS pfr_id TEXT;

CREATE TABLE IF NOT EXISTS public.nflverse_player_snap_week_stats (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT NOT NULL,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    team TEXT NOT NULL,
    offense_snaps NUMERIC NOT NULL DEFAULT 0,
    offense_pct NUMERIC, -- nullable: nflverse leaves this blank for some rows rather than a fabricated 0
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

CREATE INDEX IF NOT EXISTS idx_nflverse_player_snap_week_season_week ON public.nflverse_player_snap_week_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_player_snap_week_gsis ON public.nflverse_player_snap_week_stats(gsis_id);

ALTER TABLE public.nflverse_player_snap_week_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_player_snap_week_stats;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Enable read access for all users" ON public.nflverse_player_snap_week_stats FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.nflverse_player_ngs_receiving_week_stats (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT NOT NULL,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    avg_cushion NUMERIC,
    avg_separation NUMERIC,
    avg_intended_air_yards NUMERIC,
    catch_percentage NUMERIC,
    avg_yac NUMERIC,
    avg_expected_yac NUMERIC,
    avg_yac_above_expectation NUMERIC,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

CREATE INDEX IF NOT EXISTS idx_nflverse_player_ngs_receiving_week_season_week ON public.nflverse_player_ngs_receiving_week_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_player_ngs_receiving_week_gsis ON public.nflverse_player_ngs_receiving_week_stats(gsis_id);

ALTER TABLE public.nflverse_player_ngs_receiving_week_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_player_ngs_receiving_week_stats;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Enable read access for all users" ON public.nflverse_player_ngs_receiving_week_stats FOR SELECT USING (true);
