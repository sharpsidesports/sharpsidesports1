import csv
import json
import logging
import os
from typing import List, Dict, Any
import sys
import datetime
import time

# You may need to install: requests, python-dotenv, supabase
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from bs4 import BeautifulSoup
import re
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)

# Ensure data directory exists
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

# Load environment variables
# load_dotenv()
# SUPABASE_URL = 'https://skpzfhljjsysmzyrtnho.supabase.co'  # SSG
# SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcHpmaGxqanN5c216eXJ0bmhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY2MzE0OSwiZXhwIjoyMDUwMjM5MTQ5fQ.DGneRgX4BA-Otfm4LSXw3NGwPSFIuIT6UJvYWBNj45w' #THEIRS
SUPABASE_URL = 'https://fsyvigmmevdsfaluzqjz.supabase.co'  # DEV
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXZpZ21tZXZkc2ZhbHV6cWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzMyMTI2MSwiZXhwIjoyMDUyODk3MjYxfQ.oLNgCXjYk3bxu_l5otSSIxRXFlKideW7x5wsKLuNzIM'


# --- Course Difficulty Data ---
# Configuration: categories to include
CATEGORIES = ['driving', 'scoring', 'approach']

# Final output object (will be populated by fetch_and_process_course_difficulty)
COURSE_DIFFICULTY_DATA = {}


def fetch_reload_data(url: str) -> dict:
    """
    Fetches the page at `url`, parses out the `reload_data` JSON, and returns it as a Python dict.
    """
    resp = requests.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')

    # Find the <script> containing 'var reload_data'
    for script in soup.find_all('script'):
        if script.string and 'var reload_data' in script.string:
            match = re.search(r"var reload_data = JSON\.parse\('(.+?)'\);", script.string, re.DOTALL)
            if match:
                escaped = match.group(1)
                return json.loads(escaped.encode('utf-8').decode('unicode_escape'))
    raise ValueError("reload_data not found")


def compute_metric_percentiles(df: pd.DataFrame, metrics: list) -> None:
    """
    Given a DataFrame and a list of metric columns,
    compute percentile for each metric (0-100) and add `<metric>_percentile` columns in-place.
    """
    num = len(df)
    for col in metrics:
        rank_col = f"{col}_rank"
        perc_col = f"{col}_percentile"
        # Ensure rank_col exists, if not, skip or handle error
        if rank_col not in df.columns:
            logging.warning(f"Rank column {rank_col} not found in DataFrame. Skipping percentile calculation for {col}.")
            df[perc_col] = None # Or some other default value like 0 or np.nan
            continue
        df[perc_col] = df[rank_col].apply(lambda r: round((r / num) * 100) if pd.notnull(r) and num > 0 else None)


def compute_category_scores(df: pd.DataFrame, reload_data: dict) -> None:
    """
    Computes composite percentiles and difficulty labels per category:
    1. Precompute all metric percentiles across categories.
    2. For each category, average its metrics' percentiles → `<cat>_percentile`.
    3. Label `<cat>_difficulty`: percentile <=20 → 'hard', >=80 → 'easy', else 'medium'.
    """
    # Gather all metrics across configured categories
    all_metrics = []
    for cat in CATEGORIES:
        # Ensure 'table_cats', cat, and 'cols' exist in reload_data
        if 'table_cats' in reload_data and cat in reload_data['table_cats'] and 'cols' in reload_data['table_cats'][cat]:
            all_metrics.extend(reload_data['table_cats'][cat]['cols'])
        else:
            logging.warning(f"Category '{cat}' or its 'cols' not found in reload_data['table_cats']. Skipping.")
            continue # Skip this category if data is missing

    if not all_metrics:
        logging.warning("No metrics found to compute percentiles. Skipping category score computation.")
        return

    # Compute percentiles once for all metrics
    compute_metric_percentiles(df, all_metrics)

    # Compute composite and difficulty per category
    for cat in CATEGORIES:
        # Check again if category data is available before processing
        if not ('table_cats' in reload_data and cat in reload_data['table_cats'] and 'cols' in reload_data['table_cats'][cat]):
            continue # Already logged warning, just skip

        metric_cols = reload_data['table_cats'][cat]['cols']
        perc_cols = [f"{m}_percentile" for m in metric_cols]
        
        # Filter out percentile columns that might not have been created if their rank_col was missing
        valid_perc_cols = [p_col for p_col in perc_cols if p_col in df.columns and df[p_col].notna().any()]

        if not valid_perc_cols:
            logging.warning(f"No valid percentile columns found for category '{cat}'. Skipping composite score.")
            df[f"{cat}_percentile"] = None
            df[f"{cat}_difficulty"] = None
            continue
            
        df[f"{cat}_percentile"] = df[valid_perc_cols].mean(axis=1).round().astype('Int64') # Use Int64 to allow NAs
        df[f"{cat}_difficulty"] = df[f"{cat}_percentile"].apply(
            lambda p: 'hard' if pd.notnull(p) and p <= 20 else ('easy' if pd.notnull(p) and p >= 80 else ('medium' if pd.notnull(p) else None)))

def fetch_and_process_course_difficulty() -> Dict[str, Any]:
    """
    Fetches, processes, and returns course difficulty data.
    Also updates the global COURSE_DIFFICULTY_DATA and saves to a JSON file.
    """
    global COURSE_DIFFICULTY_DATA
    output_file = os.path.join(DATA_DIR, "course_difficulty_data.json")
    COURSE_DIFFICULTY_DATA = {}  # Reset global variable
    
    logging.info("Fetching and processing course difficulty data...")
    url = "https://datagolf.com/course-table"
    
    try:
        # Fetch and parse data
        reload_data = fetch_reload_data(url)
        courses = reload_data.get('data', [])
        
        if not courses:
            logging.warning("No course data found in reload_data.")
            return {}
            
        # Process data
        df = pd.DataFrame(courses)
        if 'event_name' in df.columns:
            df = df.rename(columns={'event_name': 'course_name'})
        
        if 'course_name' not in df.columns:
            logging.error("'course_name' column is missing after potential rename. Cannot proceed.")
            return {}

        # Compute scores and build object
        compute_category_scores(df, reload_data)
        COURSE_DIFFICULTY_DATA = build_course_object(df)
        
        # Save result if we have data
        if COURSE_DIFFICULTY_DATA:
            save_to_json(COURSE_DIFFICULTY_DATA, output_file)
            course_count = len(COURSE_DIFFICULTY_DATA)
            logging.info(f"Processed and saved course difficulty data for {course_count} courses")
        
        return COURSE_DIFFICULTY_DATA
        
    except Exception as e:
        error_type = type(e).__name__
        logging.error(f"Error processing course difficulty data ({error_type}): {e}")
        return {}


def build_course_object(df: pd.DataFrame) -> dict:
    """
    Construct COURSE_DIFFICULTY_DATA dict, using composite percentiles & difficulty per category.
    Returns a mapping: course_name → { driving: pct, scoring: pct, approach: pct, difficulty: {...} }
    """
    output = {}
    if 'course_name' not in df.columns:
        logging.error("'course_name' column not found in DataFrame. Cannot build course object.")
        return output
        
    for _, row in df.iterrows():
        course = row['course_name']
        metrics = {}
        difficulty = {}
        valid_category_data = True
        for cat in CATEGORIES:
            cat_percentile_col = f"{cat}_percentile"
            cat_difficulty_col = f"{cat}_difficulty"
            if cat_percentile_col in row and pd.notnull(row[cat_percentile_col]):
                metrics[cat] = int(row[cat_percentile_col])
            else:
                metrics[cat] = None # Or some other indicator of missing data
                valid_category_data = False # Mark if any category data is missing
            
            if cat_difficulty_col in row and pd.notnull(row[cat_difficulty_col]):
                difficulty[cat] = row[cat_difficulty_col]
            else:
                difficulty[cat] = None
                valid_category_data = False

        # Only add course to output if all category data is present, or handle partial data as needed
        # For now, let's include it even with partial data, using None for missing parts.
        output[course] = {**metrics, 'difficulty': difficulty}
    return output

# Configure logging
logging.basicConfig(level=logging.INFO)

# --- 1. DataGolf: Fetch Player Info ---
def fetch_datagolf_player_info() -> List[Dict[str, Any]]:
    url = "https://feeds.datagolf.com/preds/get-dg-rankings"
    params = {"file_format": "json", "key": "cf5b806066038ad69a752686db8f"}
    response = requests.get(url, params=params)
    response.raise_for_status()
    return [
        {"name": p["player_name"], "dg_id": p["dg_id"]}
        for p in response.json()["rankings"] if p["primary_tour"] == "PGA"
    ]

# --- 2. PGA Tour: Fetch Player Directory ---
def fetch_pga_tour_players() -> List[Dict[str, Any]]:
    url = "https://orchestrator.pgatour.com/graphql"
    headers = {
        "accept": "*/*",
        "content-type": "application/json",
        "x-api-key": "da2-gsrx5bibzbb4njvhl7t37wqyl4",
        "x-pgat-platform": "web"
    }
    body = {
        "operationName": "PlayerDirectory",
        "variables": {"tourCode": "R"},
        "query": """
        query PlayerDirectory($tourCode: TourCode!, $active: Boolean) {
          playerDirectory(tourCode: $tourCode, active: $active) {
            players {
              id
              isActive
              firstName
              lastName
              headshot
            }
          }
        }
        """
    }
    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()
    players = response.json()["data"]["playerDirectory"]["players"]
    return [
        {
            "id": p["id"],
            "firstName": p["firstName"],
            "lastName": p["lastName"],
            "headshot": p["headshot"],
            "isActive": p["isActive"]
        }
        for p in players if p["isActive"]
    ]

def fetch_available_years_pga(player_id: str) -> List[int]:
    url = "https://orchestrator.pgatour.com/graphql"
    headers = {
        "accept": "*/*",
        "content-type": "application/json",
        "x-api-key": "da2-gsrx5bibzbb4njvhl7t37wqyl4",
        "x-pgat-platform": "web"
    }
    query = """
    query PlayerProfileStatsYears($playerId: ID!) {
      playerProfileStatsYears(playerId: $playerId) {
        year
      }
    }
    """
    body = {
        "operationName": "PlayerProfileStatsYears",
        "variables": {"playerId": player_id},
        "query": query
    }
    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()
    data = response.json()
    return [entry['year'] for entry in data.get('data', {}).get('playerProfileStatsYears', [])]

def fetch_player_profile_stats_full_pga(player_id: str, year: int) -> List[Dict[str, Any]]:
    url = "https://orchestrator.pgatour.com/graphql"
    headers = {
        "accept": "*/*",
        "content-type": "application/json",
        "x-api-key": "da2-gsrx5bibzbb4njvhl7t37wqyl4",
        "x-pgat-platform": "web"
    }
    query = """
    query ProfileStatsFullV2($playerId: ID!, $year: Int) {
      playerProfileStatsFullV2(playerId: $playerId, year: $year) {
        playerProfileStatsFull {
          stats {
            statId
            rank
            value
            title
            category
            aboveOrBelow
            fieldAverage
            supportingStat { description value }
            supportingValue { description value }
          }
        }
      }
    }
    """
    body = {
        "operationName": "ProfileStatsFullV2",
        "variables": {"playerId": player_id, "year": year},
        "query": query
    }
    response = requests.post(url, headers=headers, json=body)
    response.raise_for_status()
    data = response.json()
    stats = []
    for profile in data.get('data', {}).get('playerProfileStatsFullV2', {}).get('playerProfileStatsFull', []):
        for stat in profile.get('stats', []):
            stat['year'] = year
            stats.append(stat)
    return stats


# --- 3. Fetch Player Stats (PGA Tour) ---
def fetch_all_player_stats_pga(pga_players: List[Dict[str, Any]], test_mode: bool = False) -> List[Dict[str, Any]]:
    all_stats = []
    players_to_process = pga_players[:15] if test_mode else pga_players
    for player in players_to_process:
        player_id = player['id']
        player_name = f"{player['firstName']}_{player['lastName']}"
        try:
            # years = fetch_available_years_pga(player_id)
            years = [2025]
            for year in years:
                stats = fetch_player_profile_stats_full_pga(player_id, year)
                for stat in stats:
                    stat['player_id'] = player_id
                    stat['player_first_name'] = player['firstName']
                    stat['player_last_name'] = player['lastName']
                    stat['player_full_name'] = f"{player['lastName'].title()}, {player['firstName'].title()}"
                    all_stats.append(stat)
            logging.info(f"Fetched stats for {player_name}")
        except Exception as e:
            logging.warning(f"Failed for {player_name}: {e}")
    return all_stats



# --- 4. Fetch Player Rounds (DataGolf) ---
def fetch_all_player_rounds_dg() -> Dict[str, Any]:
    url = "https://feeds.datagolf.com/historical-raw-data/event-list"
    params = {"file_format": "json", "key": "cf5b806066038ad69a752686db8f"}
    response = requests.get(url, params=params)
    response.raise_for_status()
    events = response.json()
    pga_events = [e for e in events if e['tour'] == 'pga' and e['traditional_stats'] == 'yes' and e['sg_categories'] == 'yes' and e['calendar_year'] == 2025]
    player_rounds_by_course = {}
    for event in pga_events:
        event_id = event['event_id']
        year = event['calendar_year']
        event_name = event['event_name']
        rounds_url = "https://feeds.datagolf.com/historical-raw-data/rounds"
        rounds_params = {
            "tour": "pga",
            "event_id": event_id,
            "year": year,
            "file_format": "json",
            "key": "cf5b806066038ad69a752686db8f"
        }
        rounds_response = requests.get(rounds_url, params=rounds_params)
        if rounds_response.status_code != 200:
            continue
        rounds_data = rounds_response.json()
        for score in rounds_data.get('scores', []):
            player_name = score['player_name']
            if player_name not in player_rounds_by_course:
                player_rounds_by_course[player_name] = {}
            for round_key, round_info in score.items():
                if round_key.startswith('round_') and round_info:
                    course_name = round_info['course_name']
                    if course_name not in player_rounds_by_course[player_name]:
                        player_rounds_by_course[player_name][course_name] = {'rounds': []}
                    player_rounds_by_course[player_name][course_name]['rounds'].append({
                        'eventName': event_name,
                        'eventId': event_id,
                        'courseName': course_name,
                        'playerName': player_name,
                        'dgId': score.get('dg_id', 'N/A'),
                        'round': int(round_key.split('_')[1]),
                        'date': rounds_data.get('event_completed', 'N/A'),
                        'teeTime': round_info.get('teetime', 'N/A'),
                        'course_num': round_info.get('course_num', 'N/A'),
                        'course_par': round_info.get('course_par', 'N/A'),
                        'start_hole': round_info.get('start_hole', 'N/A'),
                        'score': round_info.get('score', 'N/A'),
                        'sg_app': round_info.get('sg_app', 'N/A'),
                        'sg_arg': round_info.get('sg_arg', 'N/A'),
                        'sg_ott': round_info.get('sg_ott', 'N/A'),
                        'sg_putt': round_info.get('sg_putt', 'N/A'),
                        'sg_t2g': round_info.get('sg_t2g', 'N/A'),
                        'sg_total': round_info.get('sg_total', 'N/A'),
                        'driving_acc': round_info.get('driving_acc', 'N/A'),
                        'driving_dist': round_info.get('driving_dist', 'N/A'),
                        'gir': round_info.get('gir', 'N/A'),
                        'prox_fw': round_info.get('prox_fw', 'N/A'),
                        'prox_rgh': round_info.get('prox_rgh', 'N/A'),
                        'scrambling': round_info.get('scrambling', 'N/A')
                    })
    return player_rounds_by_course

# --- 5. Process/Transform Data ---
def process_player_stats_dg(raw_stats: List[Dict[str, Any]], player_info: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    # Map player full name to dg_id
    name_to_dgid = {p['name'].lower(): p['dg_id'] for p in player_info}
    relevant_stat_ids = {
        # Birdies/Bogeys related
        '02414',  # Bogey Avoidance
        # '106',    # Total Eagles
        '107',    # Total Birdies
        '115',    # Birdie or Better Conversion Percentage
        '155',    # Eagles (Holes per)
        '156',    # Birdie Average
        '352',    # Birdie or Better Percentage
        # '02672',  # Consecutive Birdies Streak
        # '02673',  # Consecutive Birdies/Eagles streak
        # '452',    # Consecutive Holes Below Par
        # Par-specific stats and SG
        '142',    # Par 3 Scoring Average
        '143',    # Par 4 Scoring Average
        '144',    # Par 5 Scoring Average
        '112',    # Par 3 Birdie or Better Leaders
        '113',    # Par 4 Birdie or Better Leaders
        '114',    # Par 5 Birdie or Better Leaders
    }
    processed = []
    for stat in raw_stats:
        if stat.get('statId') not in relevant_stat_ids:
            continue
        full_name = stat.get('player_full_name', '').lower()
        dg_id = name_to_dgid.get(full_name, None)
        # Extract player_first_name, player_last_name, player_id
        player_first_name = stat.get('player_first_name', None)
        player_last_name = stat.get('player_last_name', None)
        player_id = stat.get('player_id', None)
        processed.append({
            'player_first_name': player_first_name,
            'player_last_name': player_last_name,
            'player_full_name': stat.get('player_full_name'),
            'player_id': player_id,
            'dg_id': dg_id,
            'title': stat.get('title'),
            'value': stat.get('value'),
            'rank': stat.get('rank'),
            'year': stat.get('year'),
            'category': ','.join(stat.get('category', [])) if isinstance(stat.get('category'), list) else stat.get('category'),
            'aboveOrBelow': stat.get('aboveOrBelow'),
            'fieldAverage': stat.get('fieldAverage'),
            'statId': stat.get('statId'),
            'supportingStat_description': stat.get('supportingStat', {}).get('description') if stat.get('supportingStat') else None,
            'supportingStat_value': stat.get('supportingStat', {}).get('value') if stat.get('supportingStat') else None,
            'supportingValue_description': stat.get('supportingValue', {}).get('description') if stat.get('supportingValue') else None,
            'supportingValue_value': stat.get('supportingValue', {}).get('value') if stat.get('supportingValue') else None
        })
    return processed

def process_player_rounds(raw_rounds: Dict[str, Any], player_info: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Optionally map player names to dg_id, etc.
    # For now, just return as-is
    return raw_rounds


# --- 6. Save/Export Data ---
def save_to_csv(data: List[Dict[str, Any]], filename: str):
    # Ensure full path with DATA_DIR
    filepath = os.path.join(DATA_DIR, filename)
    
    # Define the known fields from the JSON structure in a logical order
    all_fields = [
        'dg_id',
        'player_first_name',
        'player_last_name',
        'player_full_name',
        'player_id',
        'title',
        'value',
        'rank',
        'year',
        'category',
        'aboveOrBelow',
        'fieldAverage',
        'statId',
        'supportingStat_description',
        'supportingStat_value',
        'supportingValue_description',
        'supportingValue_value'
    ]
    if not data:
        return
    # Clean and filter data to match the required fields and order
    cleaned_data = []
    for stat in data:
        # Clean up all numeric fields by stripping quotes and percentage signs
        numeric_fields = ['value', 'rank', 'fieldAverage', 'supportingStat_value', 'supportingValue_value']
        for field in numeric_fields:
            if field in stat and isinstance(stat[field], str):
                stat[field] = stat[field].replace('"', '').replace('%', '').replace(',', '').replace('-', '').strip()
        # Add 'Percentage' to title if original value contains '%'
        if 'value' in stat and isinstance(stat['value'], str) and '%' in stat['value']:
            if stat.get('title') and 'Percentage' not in stat['title']:
                stat['title'] = stat['title'] + ' Percentage'
        # Ensure all fields are present
        row = {field: stat.get(field, None) for field in all_fields}
        cleaned_data.append(row)
    with open(filepath, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=all_fields)
        writer.writeheader()
        writer.writerows(cleaned_data)

def save_to_json(data: Any, filename: str):
    # If filename is already a full path, respect it; otherwise, join with DATA_DIR
    if os.path.dirname(filename):
        filepath = filename
    else:
        filepath = os.path.join(DATA_DIR, filename)
    
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

# --- 7. Upload to Supabase ---
def upload_to_supabase(csv_path: str, player_rounds_path: str, course_difficulty_path: str):
    """Upload scoring_stats, player_rounds, and course_difficulty data to Supabase, deleting existing records first."""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    BATCH_SIZE = 250
    # 0. Delete existing records except DUMMY
    print('Deleting existing records in Supabase...')
    supabase.table('scoring_stats').delete().neq('player_full_name', 'DUMMY').execute()
    supabase.table('player_rounds').delete().neq('course', 'DUMMY').execute()
    supabase.table('course_difficulty').delete().neq('course_name', '').execute()

    # 1. Read and parse CSV data
    print('Reading scoring stats CSV...')
    with open(csv_path) as f:
        reader = csv.DictReader(f)
        scoring_stats = [row for row in reader]

    # 2. Read and parse player rounds JSON
    print('Reading player rounds JSON...')
    with open(player_rounds_path) as f:
        player_rounds = json.load(f)
        
    # 3. Read and parse course difficulty JSON
    print('Reading course difficulty JSON...')
    try:
        with open(course_difficulty_path) as f:
            course_difficulty = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f'Error reading course difficulty data: {e}')
        course_difficulty = {}

    # 4. Format scoring stats for insertion
    print('Processing scoring stats...')
    formatted_stats = []
    for stat in scoring_stats:
        formatted_stats.append({
            'dg_id': stat['dg_id'] or None,
            'player_full_name': stat['player_full_name'],
            'stat_id': stat['statId'],
            'title': stat['title'] or None,
            'value': float(stat['value']) if stat['value'] not in (None, '', 'N/A') else None,
            'rank': int(stat['rank']) if stat['rank'] not in (None, '', 'N/A') else None,
            'category': stat['category'] or None,
            'field_average': float(stat['fieldAverage']) if stat['fieldAverage'] not in (None, '', 'N/A') else None,
            'year': int(stat['year']) if stat['year'] not in (None, '', 'N/A') else None,
            'above_or_below': stat['aboveOrBelow'] or None,
            'supporting_stat_description': stat['supportingStat_description'] or None,
            'supporting_stat_value': float(stat['supportingStat_value']) if stat['supportingStat_value'] not in (None, '', 'N/A') else None,
            'supporting_value_description': stat['supportingValue_description'] or None,
            'supporting_value_value': float(stat['supportingValue_value']) if stat['supportingValue_value'] not in (None, '', 'N/A') else None
        })

    # 5. Format rounds data
    print('Processing rounds data...')
    formatted_rounds = []
    for player_name, course_data in player_rounds.items():
        # Try to find dg_id for this player
        player_stat = next((s for s in scoring_stats if s['player_full_name'].lower() == player_name.lower()), None)
        dg_id = player_stat['dg_id'] if player_stat else None
        for course, data in course_data.items():
            for round in data['rounds']:
                formatted_rounds.append({
                    'dg_id': dg_id or None,
                    'course': course,
                    'sg_total': float(round['sg_total']) if round['sg_total'] not in (None, '', 'N/A') else None,
                    'sg_ott': float(round['sg_ott']) if round['sg_ott'] not in (None, '', 'N/A') else None,
                    'sg_app': float(round['sg_app']) if round['sg_app'] not in (None, '', 'N/A') else None,
                    'sg_arg': float(round['sg_arg']) if round['sg_arg'] not in (None, '', 'N/A') else None,
                    'sg_putt': float(round['sg_putt']) if round['sg_putt'] not in (None, '', 'N/A') else None,
                    'gir': float(round['gir']) if round['gir'] not in (None, '', 'N/A') else None,
                    'driving_acc': float(round['driving_acc']) if round['driving_acc'] not in (None, '', 'N/A') else None,
                    'driving_dist': float(round['driving_dist']) if round['driving_dist'] not in (None, '', 'N/A') else None,
                    'round_date': round['date']
                })
                
    # 6. Format course difficulty data
    print('Processing course difficulty data...')
    formatted_courses = []
    for course_name, data in course_difficulty.items():
        formatted_courses.append({
            'course_name': course_name,
            'driving_rank': data['driving'],
            'scoring_rank': data['scoring'],
            'approach_rank': data['approach'],
            'driving_difficulty': data['difficulty']['driving'],
            'approach_difficulty': data['difficulty']['approach'],
            'scoring_difficulty': data['difficulty']['scoring']
        })

    # 7. Batch insert data
    print('Inserting scoring stats...')
    for i in range(0, len(formatted_stats), BATCH_SIZE):
        batch = formatted_stats[i:i+BATCH_SIZE]
        supabase.table('scoring_stats').insert(batch).execute()
        print(f'Inserted {i + len(batch)}/{len(formatted_stats)} scoring stats')
        time.sleep(0.1)

    print('Inserting player rounds...')
    for i in range(0, len(formatted_rounds), BATCH_SIZE):
        batch = formatted_rounds[i:i+BATCH_SIZE]
        supabase.table('player_rounds').insert(batch).execute()
        print(f'Inserted {i + len(batch)}/{len(formatted_rounds)} rounds')
        time.sleep(0.1)
        
    print('Inserting course difficulty data...')
    for i in range(0, len(formatted_courses), BATCH_SIZE):
        batch = formatted_courses[i:i+BATCH_SIZE]
        supabase.table('course_difficulty').insert(batch).execute()
        print(f'Inserted {i + len(batch)}/{len(formatted_courses)} courses')
        time.sleep(0.1)
        
    print('Upload to Supabase completed successfully!')

# --- 8. (Optional) Utility: Extract Unique Course Names ---
def extract_unique_course_names(rounds_json_path: str):
    with open(rounds_json_path) as f:
        data = json.load(f)
    unique_courses = set()
    for player_courses in data.values():
        unique_courses.update(player_courses.keys())
    print("Unique courses:", sorted(unique_courses))

def backup_supabase_tables():
    """Backup player_rounds, scoring_stats, and course_difficulty tables from Supabase to local JSON files with timestamp, batching by 10,000 records."""
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    # Ensure backups directory exists
    backup_dir = "backups"
    os.makedirs(backup_dir, exist_ok=True)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    BATCH_SIZE = 10000

    def fetch_all_rows(table_name):
        all_rows = []
        offset = 0
        while True:
            resp = supabase.table(table_name).select("*").range(offset, offset + BATCH_SIZE - 1).execute()
            batch = resp.data if hasattr(resp, 'data') else resp["data"]
            if not batch:
                break
            all_rows.extend(batch)
            if len(batch) < BATCH_SIZE:
                break
            offset += BATCH_SIZE
        return all_rows

    # Backup scoring_stats
    stats_data = fetch_all_rows("scoring_stats")
    stats_backup_path = os.path.join(backup_dir, f"scoring_stats_backup_{timestamp}.json")
    with open(stats_backup_path, "w") as f:
        json.dump(stats_data, f, indent=2)
    logging.info(f"Backed up {len(stats_data)} scoring_stats records to {stats_backup_path}")
    
    # Backup player_rounds
    rounds_data = fetch_all_rows("player_rounds")
    rounds_backup_path = os.path.join(backup_dir, f"player_rounds_backup_{timestamp}.json")
    with open(rounds_backup_path, "w") as f:
        json.dump(rounds_data, f, indent=2)
    logging.info(f"Backed up {len(rounds_data)} player_rounds records to {rounds_backup_path}")
    
    # Backup course_difficulty
    course_data = fetch_all_rows("course_difficulty")
    course_backup_path = os.path.join(backup_dir, f"course_difficulty_backup_{timestamp}.json")
    with open(course_backup_path, "w") as f:
        json.dump(course_data, f, indent=2)
    logging.info(f"Backed up {len(course_data)} course_difficulty records to {course_backup_path}")

# --- Main Orchestration ---
def main():
    # Backup Supabase tables before any changes
    backup_supabase_tables()
    
    # Delete previous data files if they exist
    data_files = ["scoring_stats.csv", "player_rounds_data.json", "course_difficulty_data.json"]
    for file in data_files:
        filepath = os.path.join(DATA_DIR, file)
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
                logging.info(f"Deleted previous data file: {filepath}")
            except OSError as e:
                logging.warning(f"Error deleting {filepath}: {e}")
    
    test_mode = "--test" in sys.argv
    logging.info("Running in test mode" if test_mode else "Running in full mode")
    
    logging.info("Fetching DataGolf player info...")
    player_info = fetch_datagolf_player_info()
    logging.info(f"Fetched {len(player_info)} DataGolf players.")

    logging.info("Fetching PGA Tour player directory...")
    pga_players = fetch_pga_tour_players()
    logging.info(f"Fetched {len(pga_players)} PGA Tour players.")

    logging.info("Fetching all player stats...")
    player_stats = fetch_all_player_stats_pga(pga_players, test_mode=test_mode)
    logging.info(f"Fetched stats for {len(player_stats)} players.")

    logging.info("Fetching all player rounds...")
    player_rounds = fetch_all_player_rounds_dg()
    logging.info(f"Fetched rounds for {len(player_rounds)} players.")

    logging.info("Processing player stats...")
    processed_stats = process_player_stats_dg(player_stats, player_info)
    save_to_csv(processed_stats, "scoring_stats.csv")

    logging.info("Processing player rounds...")
    processed_rounds = process_player_rounds(player_rounds, player_info)
    save_to_json(processed_rounds, "player_rounds_data.json")

    logging.info("Fetching and processing course difficulty data...")
    fetch_and_process_course_difficulty()  # File is saved inside this function

    logging.info("Uploading to Supabase...")
    upload_to_supabase(
        os.path.join(DATA_DIR, "scoring_stats.csv"),
        os.path.join(DATA_DIR, "player_rounds_data.json"),
        os.path.join(DATA_DIR, "course_difficulty_data.json")
    )

    # logging.info("Extracting unique course names...")
    # extract_unique_course_names(os.path.join(DATA_DIR, "player_rounds_data.json"))

if __name__ == "__main__":
    main()