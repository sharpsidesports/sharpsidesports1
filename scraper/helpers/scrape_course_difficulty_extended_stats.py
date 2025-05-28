#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import re
import json
import pandas as pd

def fetch_reload_data(url: str) -> dict:
    """
    Fetches the page at `url`, parses out the `reload_data` JSON, and returns it as a Python dict.
    """
    resp = requests.get(url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')

    # Locate the <script> containing 'var reload_data'
    script_text = None
    for script in soup.find_all('script'):
        if script.string and 'var reload_data' in script.string:
            script_text = script.string
            break
    if not script_text:
        raise ValueError("Could not find reload_data script on the page")

    # Extract the JSON string (it's single-quoted and escaped)
    match = re.search(r"var reload_data = JSON\.parse\('(.+?)'\);", script_text, re.DOTALL)
    if not match:
        raise ValueError("Could not extract reload_data JSON string")

    # Unescape and load
    json_escaped = match.group(1)
    json_str = json_escaped.encode('utf-8').decode('unicode_escape')
    return json.loads(json_str)


def extract_section(df: pd.DataFrame, reload_data: dict, category: str) -> pd.DataFrame:
    """
    Given the full DataFrame `df` and `reload_data`,
    returns a subset DataFrame containing the course name,
    the metrics for `category`, and newly-computed difficulty labels.
    """
    cols = reload_data['table_cats'][category]['cols']
    diff_cols = [col + '_difficulty' for col in cols]
    section_cols = ['course_name'] + cols + diff_cols
    return df[section_cols]


def compute_difficulty_labels(df: pd.DataFrame, reload_data: dict) -> None:
    """
    Adds `<metric>_difficulty` columns to `df` for each stat metric,
    using rank thresholds: top 5 = 'hard', bottom 5 = 'easy', else 'medium'.
    """
    num_courses = len(df)
    for cat in ['driving', 'scoring', 'approach']:
        cols = reload_data['table_cats'][cat]['cols']
        for col in cols:
            rank_col = f"{col}_rank"
            diff_col = f"{col}_difficulty"
            df[diff_col] = df[rank_col].apply(
                lambda r: 'hard' if r <= 5 else ('easy' if r > num_courses - 5 else 'medium')
            )


def main():
    url = "https://datagolf.com/course-table"
    reload_data = fetch_reload_data(url)

    # Load the course-level data
    courses = reload_data.get('data', [])
    df = pd.DataFrame(courses)

    # Normalize course column name
    if 'event_name' in df.columns:
        df = df.rename(columns={'event_name': 'course_name'})

    # Compute difficulty labels in-place
    compute_difficulty_labels(df, reload_data)

    # Extract and display each section
    driving_df  = extract_section(df, reload_data, 'driving')
    scoring_df  = extract_section(df, reload_data, 'scoring')
    approach_df = extract_section(df, reload_data, 'approach')

    print("\n=== Driving Stats with Difficulty ===")
    print(driving_df.head().to_string(index=False))

    print("\n=== Scoring Info with Difficulty ===")
    print(scoring_df.head().to_string(index=False))

    print("\n=== Approach Stats with Difficulty ===")
    print(approach_df.head().to_string(index=False))

if __name__ == '__main__':
    main()
