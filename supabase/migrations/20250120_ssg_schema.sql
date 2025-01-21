-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS ssg;

-- Set the search path
SET search_path TO ssg, public;

-- Create scoring_stats table in ssg schema
CREATE TABLE IF NOT EXISTS ssg.scoring_stats (
    id BIGSERIAL PRIMARY KEY,
    dg_id TEXT NOT NULL,
    player_full_name TEXT NOT NULL,
    stat_id TEXT NOT NULL,
    title TEXT,
    value DECIMAL,
    rank INTEGER,
    category TEXT,
    field_average DECIMAL,
    year INTEGER,
    above_or_below TEXT,
    supporting_stat_description TEXT,
    supporting_stat_value DECIMAL,
    supporting_value_description TEXT,
    supporting_value_value DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create player_rounds table in ssg schema
CREATE TABLE IF NOT EXISTS ssg.player_rounds (
    id BIGSERIAL PRIMARY KEY,
    dg_id TEXT NOT NULL,
    course TEXT NOT NULL,
    round_date DATE NOT NULL,
    sg_total DECIMAL,
    sg_ott DECIMAL,
    sg_app DECIMAL,
    sg_arg DECIMAL,
    sg_putt DECIMAL,
    driving_acc DECIMAL,
    driving_dist DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scoring_stats_dg_id ON ssg.scoring_stats(dg_id);
CREATE INDEX IF NOT EXISTS idx_scoring_stats_year ON ssg.scoring_stats(year);
CREATE INDEX IF NOT EXISTS idx_player_rounds_dg_id ON ssg.player_rounds(dg_id);
CREATE INDEX IF NOT EXISTS idx_player_rounds_date ON ssg.player_rounds(round_date);
CREATE INDEX IF NOT EXISTS idx_player_rounds_course ON ssg.player_rounds(course);

-- Add row level security policies
ALTER TABLE ssg.scoring_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ssg.player_rounds ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON ssg.scoring_stats
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON ssg.player_rounds
    FOR SELECT USING (true);
