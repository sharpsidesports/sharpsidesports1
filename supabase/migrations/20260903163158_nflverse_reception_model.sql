-- WR Reception Projection Model: nflverse ingestion tables + stored
-- projections/backtest input. All data is public sports data (no PII),
-- so RLS follows the existing pattern of open read access with writes
-- restricted to the service role (used only by server-side ingestion code).

CREATE TABLE IF NOT EXISTS public.nflverse_player_week_stats (
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
    targets NUMERIC NOT NULL DEFAULT 0,
    receptions NUMERIC NOT NULL DEFAULT 0,
    receiving_yards NUMERIC NOT NULL DEFAULT 0,
    receiving_tds NUMERIC NOT NULL DEFAULT 0,
    receiving_air_yards NUMERIC NOT NULL DEFAULT 0,
    target_share NUMERIC,
    air_yards_share NUMERIC,
    racr NUMERIC,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

CREATE TABLE IF NOT EXISTS public.nflverse_team_week_stats (
    id BIGSERIAL PRIMARY KEY,
    team TEXT NOT NULL,
    opponent_team TEXT,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    season_type TEXT NOT NULL DEFAULT 'REG',
    game_id TEXT,
    pass_attempts NUMERIC NOT NULL DEFAULT 0,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team, season, week)
);

CREATE TABLE IF NOT EXISTS public.nflverse_injuries (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT,
    player_name TEXT NOT NULL,
    team TEXT NOT NULL,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,
    report_status TEXT,
    practice_status TEXT,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

CREATE TABLE IF NOT EXISTS public.player_crosswalk (
    gsis_id TEXT PRIMARY KEY,
    espn_id TEXT,
    display_name TEXT NOT NULL,
    position TEXT,
    status TEXT,
    latest_team TEXT,
    fetched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- One row per player per week: the full computed output described in the
-- reception model spec. This doubles as the backtest input — actual results
-- are joined in from nflverse_player_week_stats.receptions once known.
CREATE TABLE IF NOT EXISTS public.reception_projections (
    id BIGSERIAL PRIMARY KEY,
    gsis_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    team TEXT NOT NULL,
    season INTEGER NOT NULL,
    week INTEGER NOT NULL,

    espn_projected_receptions NUMERIC,

    expected_target_share NUMERIC,
    projected_team_pass_attempts NUMERIC,
    projected_targets NUMERIC,
    expected_catch_rate NUMERIC,

    nflverse_projected_receptions NUMERIC,

    final_projected_receptions_raw NUMERIC,
    projected_receptions NUMERIC,

    reception_edge_score INTEGER,

    projection_difference NUMERIC,

    data_season INTEGER,
    data_week INTEGER,
    data_last_updated TIMESTAMP WITH TIME ZONE,

    confidence TEXT,
    fallbacks_used JSONB NOT NULL DEFAULT '[]'::jsonb,
    warnings JSONB NOT NULL DEFAULT '[]'::jsonb,

    generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (gsis_id, season, week)
);

CREATE INDEX IF NOT EXISTS idx_nflverse_player_week_season_week ON public.nflverse_player_week_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_player_week_gsis ON public.nflverse_player_week_stats(gsis_id);
CREATE INDEX IF NOT EXISTS idx_nflverse_team_week_season_week ON public.nflverse_team_week_stats(season, week);
CREATE INDEX IF NOT EXISTS idx_nflverse_injuries_season_week ON public.nflverse_injuries(season, week);
CREATE INDEX IF NOT EXISTS idx_reception_projections_season_week ON public.reception_projections(season, week);

ALTER TABLE public.nflverse_player_week_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nflverse_team_week_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nflverse_injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_crosswalk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reception_projections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_player_week_stats;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_team_week_stats;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.nflverse_injuries;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.player_crosswalk;
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.reception_projections;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "Enable read access for all users" ON public.nflverse_player_week_stats FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.nflverse_team_week_stats FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.nflverse_injuries FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.player_crosswalk FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.reception_projections FOR SELECT USING (true);
