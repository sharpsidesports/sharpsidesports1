import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';

type Tables = Database['public']['Tables'];
type PlayerRound = Tables['player_rounds']['Row'];
type ScoringStats = Tables['scoring_stats']['Row'];

export class SupabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: string,
    public readonly hint?: string
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

async function handleSupabaseError(error: any): Promise<never> {
  console.error('Supabase Error:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  });
  
  throw new SupabaseError(
    error.message || 'An unknown error occurred',
    error.code,
    error.details,
    error.hint
  );
}

export async function getPlayerRoundsByDgIds(
  dgIds: string[], 
  courses: string[],
  options: { 
    startDate?: string;
    endDate?: string;
    limit?: number;
  } = {}
): Promise<PlayerRound[]> {
  try {
    let query = supabase
      .from('player_rounds')
      .select('*')
      .in('dg_id', dgIds)
      .in('course', courses)
      .order('round_date', { ascending: false });

    if (options.startDate) {
      query = query.gte('round_date', options.startDate);
    }
    
    if (options.endDate) {
      query = query.lte('round_date', options.endDate);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    
    if (error) {
      return handleSupabaseError(error);
    }

    if (!data || data.length === 0) {
      console.warn('No rounds found for players:', dgIds, 'on courses:', courses);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch player rounds:', error);
    throw new SupabaseError(
      'Failed to fetch player rounds',
      undefined,
      error instanceof Error ? error.message : undefined
    );
  }
}

export async function getScoringStatsByDgIds(
  dgIds: string[],
  options: {
    years?: number[];
    statIds?: string[];
    categories?: string[];
  } = {}
): Promise<ScoringStats[]> {
  try {
    let query = supabase
      .from('scoring_stats')
      .select('*')
      .in('dg_id', dgIds)
      .order('year', { ascending: false });

    if (options.years?.length) {
      query = query.in('year', options.years);
    }

    if (options.statIds?.length) {
      query = query.in('stat_id', options.statIds);
    }

    if (options.categories?.length) {
      query = query.in('category', options.categories);
    }
    query = query.limit(10000);

    const { data, error } = await query;
    
    if (error) {
      return handleSupabaseError(error);
    }

    if (!data || data.length === 0) {
      console.warn('No scoring stats found for players:', dgIds);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch scoring stats:', error);
    throw new SupabaseError(
      'Failed to fetch scoring stats',
      undefined,
      error instanceof Error ? error.message : undefined
    );
  }
}
