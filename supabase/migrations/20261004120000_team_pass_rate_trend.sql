-- Team-week neutral-script pass rate over expected (PROE), derived from the
-- play-by-play stream already ingested for the zone TD model (see
-- src/lib/nflverse/pbp.ts) — no new fetch, just a second aggregation over
-- the same rows. Stored as sum + play count (not a pre-averaged rate) so
-- recent-vs-season comparisons weight correctly by actual play volume.
-- Feeds the Reception Model's "Pass Rate Rebound/Cooling" badges — additive
-- display signal only, not a Sharp Score input.

CREATE TABLE IF NOT EXISTS public.nflverse_team_week_pass_rate_stats (
    id BIGSERIAL PRIMARY KEY,
    team TEXT NOT NULL,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    neutral_plays INTEGER NOT NULL DEFAULT 0,
    pass_oe_sum NUMERIC NOT NULL DEFAULT 0,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team, season, week)
);

CREATE INDEX IF NOT EXISTS idx_nflverse_team_pass_rate_season_week ON public.nflverse_team_week_pass_rate_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_team_pass_rate_team ON public.nflverse_team_week_pass_rate_stats(team);

ALTER TABLE public.nflverse_team_week_pass_rate_stats ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_team_week_pass_rate_stats;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Enable read access for all users" ON public.nflverse_team_week_pass_rate_stats FOR SELECT USING (true);
