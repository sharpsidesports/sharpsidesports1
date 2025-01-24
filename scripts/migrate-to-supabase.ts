import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

interface CourseData {
  rounds: Array<{
    date: string;
    sg_total: number;
    sg_ott: number;
    sg_app: number;
    sg_arg: number;
    sg_putt: number;
    gir: number;
    driving_acc: number;
    driving_dist: number;
  }>;
}

interface PlayerRounds {
  [course: string]: CourseData;
}

interface PlayerData {
  [playerName: string]: PlayerRounds;
}

interface ScoringStat {
  dg_id: string | null;
  player_full_name: string;
  stat_id: string;
  title: string | null;
  value: number | null;
  rank: number | null;
  category: string | null;
  field_average: number | null;
  year: number | null;
  above_or_below: string | null;
  supporting_stat_description: string | null;
  supporting_stat_value: number | null;
  supporting_value_description: string | null;
  supporting_value_value: number | null;
}

interface Round {
  dg_id: string | null;
  course: string;
  sg_total: number | null;
  sg_ott: number | null;
  sg_app: number | null;
  sg_arg: number | null;
  sg_putt: number | null;
  gir: number | null;
  driving_acc: number | null;
  driving_dist: number | null;
  round_date: string;
}

async function insertBatch(table: string, data: any[]) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to insert into ${table}. Status: ${response.status}. Error:`, error);
      throw new Error(`Failed to insert into ${table}: ${error}`);
    }
  } catch (error) {
    console.error(`Error in insertBatch for ${table}:`, error);
    throw error;
  }
}

async function migrateData() {
  console.log('Starting migration...');
  
  // 0. Delete existing records
  console.log('Deleting existing records...');
  await supabase.from('scoring_stats').delete().neq('player_full_name', 'DUMMY');
  await supabase.from('player_rounds').delete().neq('course', 'DUMMY');
  
  try {
    // 1. Read and parse CSV data
    console.log('Reading scoring stats CSV...');
    const scoringStatsPath = path.resolve(__dirname, '../src/data/scoring_stats.csv');
    const scoringStatsRaw = fs.readFileSync(scoringStatsPath, 'utf-8');
    const scoringStats = parse(scoringStatsRaw, { columns: true });

    // 2. Read and parse JSON data
    console.log('Reading player rounds JSON...');
    const playerRoundsPath = path.resolve(__dirname, '../src/data/player_rounds_data.json');
    const playerRoundsRaw = fs.readFileSync(playerRoundsPath, 'utf-8');
    const playerRounds = JSON.parse(playerRoundsRaw) as PlayerData;
    console.log(`Read ${Object.keys(playerRounds).length} player rounds.`);
    
    // 3. Format scoring stats for insertion
    console.log('Processing scoring stats...');
    const formattedStats: ScoringStat[] = scoringStats.map((stat: any) => ({
      dg_id: stat.dg_id || null,  // Convert empty string to null
      player_full_name: stat.player_full_name,
      stat_id: stat.statId,
      title: stat.title || null,
      value: stat.value ? parseFloat(stat.value) : null,
      rank: stat.rank ? parseInt(stat.rank) : null,
      category: stat.category || null,
      field_average: stat.fieldAverage ? parseFloat(stat.fieldAverage) : null,
      year: stat.year ? parseInt(stat.year) : null,
      above_or_below: stat.aboveOrBelow || null,
      supporting_stat_description: stat.supportingStat_description || null,
      supporting_stat_value: stat.supportingStat_value ? parseFloat(stat.supportingStat_value) : null,
      supporting_value_description: stat.supportingValue_description || null,
      supporting_value_value: stat.supportingValue_value ? parseFloat(stat.supportingValue_value) : null
    }));
    console.log(`Read ${formattedStats.length} scoring stats.`);
    
    // 4. Format rounds data
    console.log('Processing rounds data...');
    const formattedRounds: Round[] = [];
    for (const [playerName, courseData] of Object.entries(playerRounds)) {
      const playerStat = scoringStats.find((s: any) => s.player_full_name.toLowerCase() === playerName.toLowerCase());
      const dgId = playerStat?.dg_id;
      
      for (const [course, data] of Object.entries(courseData)) {
        data.rounds.forEach((round) => {
          formattedRounds.push({
            dg_id: dgId || null,
            course,
            sg_total: round.sg_total ?? null,
            sg_ott: round.sg_ott ?? null,
            sg_app: round.sg_app ?? null,
            sg_arg: round.sg_arg ?? null,
            sg_putt: round.sg_putt ?? null,
            gir: round.gir ?? null,
            driving_acc: round.driving_acc ?? null,
            driving_dist: round.driving_dist ?? null,
            round_date: round.date
          });
        });
      }
    }
    
    // 5. Batch insert data
    const BATCH_SIZE = 50; // Reduced batch size for better error handling
    
    console.log('Inserting scoring stats...');
    for (let i = 0; i < formattedStats.length; i += BATCH_SIZE) {
      console.log(`Inserting batch ${i} to ${i + BATCH_SIZE}...`);
      const batch = formattedStats.slice(i, i + BATCH_SIZE);
      try {
        await insertBatch('scoring_stats', batch);
        console.log(`Inserted ${i + batch.length}/${formattedStats.length} scoring stats`);
      } catch (error) {
        console.error(`Failed to insert batch ${i} to ${i + batch.length} of scoring stats:`, error);
        throw error;
      }
    }
    
    console.log('Inserting player rounds...');
    for (let i = 0; i < formattedRounds.length; i += BATCH_SIZE) {
      const batch = formattedRounds.slice(i, i + BATCH_SIZE);
      try {
        await insertBatch('player_rounds', batch);
        console.log(`Inserted ${i + batch.length}/${formattedRounds.length} rounds`);
      } catch (error) {
        console.error(`Failed to insert batch ${i} to ${i + batch.length} of player rounds:`, error);
        throw error;
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

migrateData().catch(console.error);
