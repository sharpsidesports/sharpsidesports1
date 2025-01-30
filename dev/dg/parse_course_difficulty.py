import pandas as pd
import json
import html
import sys
from typing import Dict
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(message)s')

courses = [
    { 'id': r'ACCORDIA GOLF Narashino Country Club' },
    { 'id': r'Albany GC' },
    { 'id': r'Arnold Palmer\'s Bay Hill Club & Lodge' },
    { 'id': r'Aronimink GC' },
    { 'id': r'Augusta National Golf Club' },
    { 'id': r'Bay Hill Club & Lodge' },
    { 'id': r'Bellerive CC' },
    { 'id': r'Bethpage Black' },
    { 'id': r'Black Desert Resort' },
    { 'id': r'Castle Pines Golf Club' },
    { 'id': r'Caves Valley Golf Club' },
    { 'id': r'Club de Golf Chapultepec' },
    { 'id': r'Colonial Country Club' },
    { 'id': r'Congaree Golf Club' },
    { 'id': r'Country Club of Jackson' },
    { 'id': r'Detroit Golf Club' },
    { 'id': r'East Lake Golf Club' },
    { 'id': r'Firestone CC (South)' },
    { 'id': r'Golf Club of Houston' },
    { 'id': r'Glen Abbey GC' },
    { 'id': r'Glen Oaks Club' },
    { 'id': r'Hamilton Golf & Country Club' },
    { 'id': r'Harbour Town Golf Links' },
    { 'id': r'Innisbrook Resort (Copperhead)' },
    { 'id': r'La Quinta Country Club' },
    { 'id': r'Le Golf National' },
    { 'id': r'Liberty National Golf Club' },
    { 'id': r'Medinah Country Club (No. 3)' },
    { 'id': r'Memorial Park Golf Course' },
    { 'id': r'Muirfield Village Golf Club' },
    { 'id': r'Nicklaus Tournament Course' },
    { 'id': r'Oak Hill Country Club' },
    { 'id': r'Oakdale Golf & Country Club' },
    { 'id': r'Ocean Course at Kiawah Island' },
    { 'id': r'Olympia Fields Country Club (North Course)' },
    { 'id': r'PGA National Resort (The Champion)' },
    { 'id': r'Pebble Beach Golf Links' },
    { 'id': r'Pete Dye Stadium Course' },
    { 'id': r'Pinehurst Resort & Country Club (Course No. 2)' },
    { 'id': r'Plantation Course at Kapalua' },
    { 'id': r'Quail Hollow Club' },
    { 'id': r'Ridgewood CC' },
    { 'id': r'Riviera Country Club' },
    { 'id': r'Royal Liverpool' },
    { 'id': r'Royal Troon' },
    { 'id': r'Sea Island Golf Club (Plantation Course)' },
    { 'id': r'Sea Island Golf Club (Seaside Course)' },
    { 'id': r'Sedgefield Country Club' },
    { 'id': r'Shadow Creek Golf Course' },
    { 'id': r'Sherwood Country Club' },
    { 'id': r'Silverado Resort and Spa (North Course)' },
    { 'id': r'Southern Hills Country Club' },
    { 'id': r'St. Andrews Links (Old Course)' },
    { 'id': r'St. George\'s G&CC' },
    { 'id': r'TPC Boston' },
    { 'id': r'TPC Craig Ranch' },
    { 'id': r'TPC Deere Run' },
    { 'id': r'TPC Harding Park' },
    { 'id': r'TPC Potomac at Avenel Farm' },
    { 'id': r'TPC River Highlands' },
    { 'id': r'TPC San Antonio (Oaks Course)' },
    { 'id': r'TPC Sawgrass (THE PLAYERS Stadium Course)' },
    { 'id': r'TPC Scottsdale (Stadium Course)' },
    { 'id': r'TPC Southwind' },
    { 'id': r'TPC Summerlin' },
    { 'id': r'TPC Twin Cities' },
    { 'id': r'The Concession Golf Club' },
    { 'id': r'The Old White TPC' },
    { 'id': r'The Renaissance Club' },
    { 'id': r'Torrey Pines Golf Course (North Course)' },
    { 'id': r'Torrey Pines Golf Course (South Course)' },
    { 'id': r'Trinity Forest Golf Club' },
    { 'id': r'Vidanta Vallarta' },
    { 'id': r'Waialae Country Club' },
    { 'id': r'Wilmington Country Club' },
    { 'id': r'Winged Foot GC' }
]

def get_course_mapping() -> Dict[str, str]:
    """Create mapping using first 8 chars of course name"""
    course_mapping = {}
    for course in courses:
        # Use first 8 chars as key for matching
        key = course['id'][:8].lower()
        course_mapping[key] = course  # Store the entire course object
    return course_mapping

def normalize_course_name(name: str, course_mapping: Dict[str, str]) -> tuple[str, bool]:
    """Find matching course name based on first 8 characters"""
    # Get first 8 chars of the input name and convert to lowercase for matching
    name_start = name[:8].lower()
    matched_course = course_mapping.get(name_start)
    if matched_course:
        return matched_course['id'], True  # Use the exact name from courses list
    return name, False

def get_difficulty(value):
    """Determine difficulty based on value"""
    if value < 10:
        return "hard"
    elif value > 80:
        return "easy"
    else:
        return "medium"

class CourseNameEncoder(json.JSONEncoder):
    def encode(self, obj):
        if isinstance(obj, str):
            return json.dumps(obj, ensure_ascii=False)
        return super().encode(obj)

    def default(self, obj):
        return super().default(obj)

def parse_course_data(csv_path):
    # Get course name mapping
    course_mapping = get_course_mapping()
    
    # Read the CSV file
    df = pd.read_csv(csv_path)
    
    # Track matches and misses
    matches = []
    misses = []
    
    # Create a dictionary with the required columns
    course_data = {}
    for _, row in df.iterrows():
        original_name = row['course']
        # Get the normalized course name and whether it was matched
        course_name, was_matched = normalize_course_name(original_name, course_mapping)
        
        if was_matched:
            matches.append((original_name, course_name))
            logging.info(f"✓ Matched: '{original_name}' -> '{course_name}'")
            
            # Convert stats to percentile ranks (0-100 scale)
            ott_sg_percentile = (df['ott_sg'] <= row['ott_sg']).mean() * 100
            app_sg_percentile = (df['app_sg'] <= row['app_sg']).mean() * 100
            score_percentile = (df['adj_score_to_par'] <= row['adj_score_to_par']).mean() * 100
            
            course_data[course_name] = {
                'driving': row['ott_sg'],
                'scoring': row['adj_score_to_par'],
                'approach': row['app_sg'],
                'difficulty': {
                    'driving': get_difficulty(ott_sg_percentile),
                    'approach': get_difficulty(app_sg_percentile),
                    'scoring': get_difficulty(score_percentile)
                }
            }
        else:
            misses.append(original_name)
            logging.info(f"✗ Unmatched: '{original_name}'")
    
    # Print summary
    logging.info(f"\nSummary: {len(matches)} matches, {len(misses)} misses")
    if misses:
        logging.info("\nUnmatched courses:")
        for miss in misses:
            logging.info(f"- {miss}")
    
    return course_data

if __name__ == "__main__":
    csv_path = "dev/dg/data/dg_course_table.csv"  # Adjust path as needed
    course_data = parse_course_data(csv_path)
    
    # Save the JSON output
    save_file = "dev/dg/data/dg_course_difficulty_parsed.json"
    with open(save_file, 'w') as f:
        json.dump(course_data, f, indent=2, cls=CourseNameEncoder)
    logging.info(f"\nSaved course data to {save_file}")