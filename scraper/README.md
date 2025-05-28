# Golf Stats Scraper

This script fetches golf statistics from DataGolf and PGA Tour, processes them, and uploads them to a Supabase database.

## Requirements

- Python 3.x
- Required packages:
  - python-dotenv
  - requests
  - supabase
  - bs4 (BeautifulSoup)
  - pandas

## Setup

1. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment:
   - On Linux/Mac:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

3. Install the required packages:
   ```bash
   pip install python-dotenv requests supabase bs4 pandas
   ```

4. Create a `data` directory (if it doesn't exist):
   ```bash
   mkdir -p data
   ```

## Running the Script

There are two modes for running the script:

### Test Mode

This mode processes a limited subset of players (only the first 15) to test the functionality:

```bash
python all.py --test
```

### Full Mode

This mode processes all available players and their statistics:

```bash
python all.py
```

## What the Script Does

1. Backs up existing data from Supabase
2. Fetches player information from DataGolf and PGA Tour
3. Fetches player statistics and round data
4. Fetches and processes course difficulty data
5. Uploads all processed data to Supabase

## Data Files

The script generates these files in the `data` directory:
- `scoring_stats.csv`: Player scoring statistics
- `player_rounds_data.json`: Player round data organized by course
- `course_difficulty_data.json`: Course difficulty ratings

## Database Configuration

The script uses different Supabase databases depending on the mode:
- Test mode: Uses a development database
- Full mode: Uses the production database

You don't need to modify any configuration as the API keys are hardcoded in the script. 