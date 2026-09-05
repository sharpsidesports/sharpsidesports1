// Database types for the reception-model's own Supabase project (separate
// from the main app's project — see src/lib/receptionModel/supabaseAdmin.ts).
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      nflverse_player_week_stats: {
        Row: {
          id: number
          gsis_id: string
          player_name: string
          position: string
          team: string
          opponent_team: string | null
          season: number
          week: number
          season_type: string
          game_id: string | null
          targets: number
          receptions: number
          receiving_yards: number
          receiving_tds: number
          receiving_air_yards: number
          target_share: number | null
          air_yards_share: number | null
          racr: number | null
          fetched_at: string
        }
        Insert: {
          id?: number
          gsis_id: string
          player_name: string
          position: string
          team: string
          opponent_team?: string | null
          season: number
          week: number
          season_type?: string
          game_id?: string | null
          targets?: number
          receptions?: number
          receiving_yards?: number
          receiving_tds?: number
          receiving_air_yards?: number
          target_share?: number | null
          air_yards_share?: number | null
          racr?: number | null
          fetched_at?: string
        }
        Update: {
          id?: number
          gsis_id?: string
          player_name?: string
          position?: string
          team?: string
          opponent_team?: string | null
          season?: number
          week?: number
          season_type?: string
          game_id?: string | null
          targets?: number
          receptions?: number
          receiving_yards?: number
          receiving_tds?: number
          receiving_air_yards?: number
          target_share?: number | null
          air_yards_share?: number | null
          racr?: number | null
          fetched_at?: string
        }
      }
      nflverse_team_week_stats: {
        Row: {
          id: number
          team: string
          opponent_team: string | null
          season: number
          week: number
          season_type: string
          game_id: string | null
          pass_attempts: number
          completions: number
          passing_yards: number
          passing_tds: number
          passing_interceptions: number
          sacks_suffered: number
          passing_air_yards: number
          carries: number
          rushing_yards: number
          fetched_at: string
        }
        Insert: {
          id?: number
          team: string
          opponent_team?: string | null
          season: number
          week: number
          season_type?: string
          game_id?: string | null
          pass_attempts?: number
          completions?: number
          passing_yards?: number
          passing_tds?: number
          passing_interceptions?: number
          sacks_suffered?: number
          passing_air_yards?: number
          carries?: number
          rushing_yards?: number
          fetched_at?: string
        }
        Update: {
          id?: number
          team?: string
          opponent_team?: string | null
          season?: number
          week?: number
          season_type?: string
          game_id?: string | null
          pass_attempts?: number
          completions?: number
          passing_yards?: number
          passing_tds?: number
          passing_interceptions?: number
          sacks_suffered?: number
          passing_air_yards?: number
          carries?: number
          rushing_yards?: number
          fetched_at?: string
        }
      }
      nflverse_qb_week_stats: {
        Row: {
          id: number
          gsis_id: string
          player_name: string
          position: string
          team: string
          opponent_team: string | null
          season: number
          week: number
          season_type: string
          game_id: string | null
          completions: number
          attempts: number
          passing_yards: number
          passing_tds: number
          passing_interceptions: number
          sacks_suffered: number
          sack_yards_lost: number
          passing_air_yards: number
          passing_yards_after_catch: number
          passing_first_downs: number
          passing_epa: number | null
          passing_cpoe: number | null
          pacr: number | null
          carries: number
          rushing_yards: number
          rushing_tds: number
          fetched_at: string
        }
        Insert: {
          id?: number
          gsis_id: string
          player_name: string
          position: string
          team: string
          opponent_team?: string | null
          season: number
          week: number
          season_type?: string
          game_id?: string | null
          completions?: number
          attempts?: number
          passing_yards?: number
          passing_tds?: number
          passing_interceptions?: number
          sacks_suffered?: number
          sack_yards_lost?: number
          passing_air_yards?: number
          passing_yards_after_catch?: number
          passing_first_downs?: number
          passing_epa?: number | null
          passing_cpoe?: number | null
          pacr?: number | null
          carries?: number
          rushing_yards?: number
          rushing_tds?: number
          fetched_at?: string
        }
        Update: {
          id?: number
          gsis_id?: string
          player_name?: string
          position?: string
          team?: string
          opponent_team?: string | null
          season?: number
          week?: number
          season_type?: string
          game_id?: string | null
          completions?: number
          attempts?: number
          passing_yards?: number
          passing_tds?: number
          passing_interceptions?: number
          sacks_suffered?: number
          sack_yards_lost?: number
          passing_air_yards?: number
          passing_yards_after_catch?: number
          passing_first_downs?: number
          passing_epa?: number | null
          passing_cpoe?: number | null
          pacr?: number | null
          carries?: number
          rushing_yards?: number
          rushing_tds?: number
          fetched_at?: string
        }
      }
      nflverse_game_lines: {
        Row: {
          id: number
          season: number
          week: number
          team: string
          opponent_team: string
          is_home: boolean | null
          spread: number | null
          total: number | null
          implied_team_total: number | null
          bookmaker: string
          fetched_at: string
        }
        Insert: {
          id?: number
          season: number
          week: number
          team: string
          opponent_team: string
          is_home?: boolean | null
          spread?: number | null
          total?: number | null
          implied_team_total?: number | null
          bookmaker?: string
          fetched_at?: string
        }
        Update: {
          id?: number
          season?: number
          week?: number
          team?: string
          opponent_team?: string
          is_home?: boolean | null
          spread?: number | null
          total?: number | null
          implied_team_total?: number | null
          bookmaker?: string
          fetched_at?: string
        }
      }
      passing_projections: {
        Row: {
          id: number
          gsis_id: string
          player_name: string
          team: string
          opponent_team: string | null
          season: number
          week: number
          espn_projected_attempts: number | null
          espn_projected_passing_yards: number | null
          projected_team_pass_attempts: number | null
          expected_total_plays: number | null
          expected_pass_rate: number | null
          expected_attempts: number | null
          attempts_over_expected: number | null
          expected_yards_per_attempt: number | null
          expected_passing_yards: number | null
          projected_passing_yards: number | null
          yards_over_expected: number | null
          vegas_spread: number | null
          vegas_total: number | null
          vegas_implied_team_total: number | null
          data_season: number | null
          data_week: number | null
          data_last_updated: string | null
          confidence: string | null
          fallbacks_used: Json
          warnings: Json
          generated_at: string
        }
        Insert: {
          id?: number
          gsis_id: string
          player_name: string
          team: string
          opponent_team?: string | null
          season: number
          week: number
          espn_projected_attempts?: number | null
          espn_projected_passing_yards?: number | null
          projected_team_pass_attempts?: number | null
          expected_total_plays?: number | null
          expected_pass_rate?: number | null
          expected_attempts?: number | null
          attempts_over_expected?: number | null
          expected_yards_per_attempt?: number | null
          expected_passing_yards?: number | null
          projected_passing_yards?: number | null
          yards_over_expected?: number | null
          vegas_spread?: number | null
          vegas_total?: number | null
          vegas_implied_team_total?: number | null
          data_season?: number | null
          data_week?: number | null
          data_last_updated?: string | null
          confidence?: string | null
          fallbacks_used?: Json
          warnings?: Json
          generated_at?: string
        }
        Update: {
          id?: number
          gsis_id?: string
          player_name?: string
          team?: string
          opponent_team?: string | null
          season?: number
          week?: number
          espn_projected_attempts?: number | null
          espn_projected_passing_yards?: number | null
          projected_team_pass_attempts?: number | null
          expected_total_plays?: number | null
          expected_pass_rate?: number | null
          expected_attempts?: number | null
          attempts_over_expected?: number | null
          expected_yards_per_attempt?: number | null
          expected_passing_yards?: number | null
          projected_passing_yards?: number | null
          yards_over_expected?: number | null
          vegas_spread?: number | null
          vegas_total?: number | null
          vegas_implied_team_total?: number | null
          data_season?: number | null
          data_week?: number | null
          data_last_updated?: string | null
          confidence?: string | null
          fallbacks_used?: Json
          warnings?: Json
          generated_at?: string
        }
      }
      nflverse_injuries: {
        Row: {
          id: number
          gsis_id: string | null
          player_name: string
          team: string
          season: number
          week: number
          report_status: string | null
          practice_status: string | null
          fetched_at: string
        }
        Insert: {
          id?: number
          gsis_id?: string | null
          player_name: string
          team: string
          season: number
          week: number
          report_status?: string | null
          practice_status?: string | null
          fetched_at?: string
        }
        Update: {
          id?: number
          gsis_id?: string | null
          player_name?: string
          team?: string
          season?: number
          week?: number
          report_status?: string | null
          practice_status?: string | null
          fetched_at?: string
        }
      }
      player_crosswalk: {
        Row: {
          gsis_id: string
          espn_id: string | null
          display_name: string
          position: string | null
          status: string | null
          latest_team: string | null
          fetched_at: string
        }
        Insert: {
          gsis_id: string
          espn_id?: string | null
          display_name: string
          position?: string | null
          status?: string | null
          latest_team?: string | null
          fetched_at?: string
        }
        Update: {
          gsis_id?: string
          espn_id?: string | null
          display_name?: string
          position?: string | null
          status?: string | null
          latest_team?: string | null
          fetched_at?: string
        }
      }
      reception_projections: {
        Row: {
          id: number
          gsis_id: string
          player_name: string
          team: string
          season: number
          week: number
          espn_projected_receptions: number | null
          expected_target_share: number | null
          projected_team_pass_attempts: number | null
          projected_targets: number | null
          expected_catch_rate: number | null
          nflverse_projected_receptions: number | null
          final_projected_receptions_raw: number | null
          projected_receptions: number | null
          reception_edge_score: number | null
          projection_difference: number | null
          data_season: number | null
          data_week: number | null
          data_last_updated: string | null
          confidence: string | null
          fallbacks_used: Json
          warnings: Json
          generated_at: string
        }
        Insert: {
          id?: number
          gsis_id: string
          player_name: string
          team: string
          season: number
          week: number
          espn_projected_receptions?: number | null
          expected_target_share?: number | null
          projected_team_pass_attempts?: number | null
          projected_targets?: number | null
          expected_catch_rate?: number | null
          nflverse_projected_receptions?: number | null
          final_projected_receptions_raw?: number | null
          projected_receptions?: number | null
          reception_edge_score?: number | null
          projection_difference?: number | null
          data_season?: number | null
          data_week?: number | null
          data_last_updated?: string | null
          confidence?: string | null
          fallbacks_used?: Json
          warnings?: Json
          generated_at?: string
        }
        Update: {
          id?: number
          gsis_id?: string
          player_name?: string
          team?: string
          season?: number
          week?: number
          espn_projected_receptions?: number | null
          expected_target_share?: number | null
          projected_team_pass_attempts?: number | null
          projected_targets?: number | null
          expected_catch_rate?: number | null
          nflverse_projected_receptions?: number | null
          final_projected_receptions_raw?: number | null
          projected_receptions?: number | null
          reception_edge_score?: number | null
          projection_difference?: number | null
          data_season?: number | null
          data_week?: number | null
          data_last_updated?: string | null
          confidence?: string | null
          fallbacks_used?: Json
          warnings?: Json
          generated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
