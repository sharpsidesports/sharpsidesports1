-- Zone-based Expected TD model: current-season play-by-play aggregated into
-- per-player-per-week-per-zone touch counts, plus rushing stats widened onto
-- the existing player-week table (needed for "Scored" = actual season TDs).
-- Expected TDs / TD Debt are computed on the fly from these two tables at
-- request time (season-to-date cumulative, not a locked-in weekly
-- projection) — no separate persistence table needed.

CREATE TABLE IF NOT EXISTS public.nflverse_player_zone_week_stats (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT NOT NULL,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    zone TEXT NOT NULL, -- GOAL_LINE | RED_ZONE | FRINGE | OPEN_FIELD
    carries NUMERIC NOT NULL DEFAULT 0,
    targets NUMERIC NOT NULL DEFAULT 0,
    rush_tds NUMERIC NOT NULL DEFAULT 0,
    rec_tds NUMERIC NOT NULL DEFAULT 0,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week, zone)
);

ALTER TABLE public.nflverse_player_week_stats
    ADD COLUMN IF NOT EXISTS rushing_yards NUMERIC NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rushing_tds NUMERIC NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_nflverse_player_zone_week_season_week ON public.nflverse_player_zone_week_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_player_zone_week_gsis ON public.nflverse_player_zone_week_stats(gsis_id);

ALTER TABLE public.nflverse_player_zone_week_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_player_zone_week_stats;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Enable read access for all users" ON public.nflverse_player_zone_week_stats FOR SELECT USING (true);
