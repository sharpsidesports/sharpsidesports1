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
      player_rounds: {
        Row: {
          id: string
          dg_id: string
          course: string
          sg_total: number
          sg_ott: number
          sg_app: number
          sg_arg: number
          sg_putt: number
          gir: number
          driving_acc: number
          driving_dist: number
          round_date: string
          created_at: string
        }
        Insert: {
          id?: string
          dg_id: string
          course: string
          sg_total: number
          sg_ott: number
          sg_app: number
          sg_arg: number
          sg_putt: number
          gir: number
          driving_acc: number
          driving_dist: number
          round_date: string
          created_at?: string
        }
        Update: {
          id?: string
          dg_id?: string
          course?: string
          sg_total?: number
          sg_ott?: number
          sg_app?: number
          sg_arg?: number
          sg_putt?: number
          gir?: number
          driving_acc?: number
          driving_dist?: number
          round_date?: string
          created_at?: string
        }
      }
      scoring_stats: {
        Row: {
          id: string
          dg_id: string
          stat_id: string
          title: string
          value: number
          rank: number
          category: string
          field_average: number | null
          year: number
          above_or_below: string | null
          supporting_stat_description: string | null
          supporting_stat_value: number | null
          supporting_value_description: string | null
          supporting_value_value: number | null
          created_at: string
          player_full_name: string
        }
        Insert: {
          id?: string
          dg_id: string
          stat_id: string
          title: string
          value: number
          rank: number
          category: string
          field_average?: number | null
          year: number
          above_or_below?: string | null
          supporting_stat_description?: string | null
          supporting_stat_value?: number | null
          supporting_value_description?: string | null
          supporting_value_value?: number | null
          created_at?: string
          player_full_name: string
        }
        Update: {
          id?: string
          dg_id?: string
          stat_id?: string
          title?: string
          value?: number
          rank?: number
          category?: string
          field_average?: number | null
          year?: number
          above_or_below?: string | null
          supporting_stat_description?: string | null
          supporting_stat_value?: number | null
          supporting_value_description?: string | null
          supporting_value_value?: number | null
          created_at?: string
          player_full_name?: string
        }
      }
      course_difficulty: {
        Row: {
          course_name: string
          driving_rank: number
          scoring_rank: number
          approach_rank: number
          driving_difficulty: string
          approach_difficulty: string
          scoring_difficulty: string
          created_at: string
        }
        Insert: {
          course_name: string
          driving_rank: number
          scoring_rank: number
          approach_rank: number
          driving_difficulty: string
          approach_difficulty: string
          scoring_difficulty: string
          created_at?: string
        }
        Update: {
          course_name?: string
          driving_rank?: number
          scoring_rank?: number
          approach_rank?: number
          driving_difficulty?: string
          approach_difficulty?: string
          scoring_difficulty?: string
          created_at?: string
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
