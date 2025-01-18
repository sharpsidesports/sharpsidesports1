import json
import csv
import os

def collect_fields_from_json_files(directory):
    # Define the known fields from the JSON structure in a logical order
    all_fields = [
        # Player identification
        'player_first_name',
        'player_last_name',
        'player_full_name',
        'player_id',
        # Core stat information
        'title',
        'value',
        'rank',
        'year',
        # Categories and comparisons
        'category',
        'aboveOrBelow',
        'fieldAverage',
        # Stat ID
        'statId',
        # Supporting information
        'supportingStat_description',
        'supportingStat_value',
        'supportingValue_description',
        'supportingValue_value'
    ]
    player_data = []

    # Iterate over all JSON files in the directory
    for filename in os.listdir(directory):
        if filename.endswith('.json'):
            # Extract player info from filename (format: player_stats_FirstName_LastName_ID.json)
            name_parts = filename.replace('player_stats_', '').replace('.json', '').split('_')
            player_id = name_parts[-1]
            player_first_name = name_parts[0]
            player_last_name = '_'.join(name_parts[1:-1])  # Handle multi-part last names

            file_path = os.path.join(directory, filename)
            with open(file_path, 'r') as json_file:
                data = json.load(json_file)
                for stat in data:
                    # Flatten the nested structures
                    flat_stat = {
                        # Player identification
                        'player_first_name': player_first_name,
                        'player_last_name': player_last_name,
                        'player_full_name': f"{player_last_name.title()}, {player_first_name.title()}",
                        'player_id': player_id,
                        # Core stat information
                        'title': stat.get('title'),
                        'value': stat.get('value'),
                        'rank': stat.get('rank'),
                        'year': stat.get('year'),
                        # Categories and comparisons
                        'category': ','.join(stat.get('category', [])),
                        'aboveOrBelow': stat.get('aboveOrBelow'),
                        'fieldAverage': stat.get('fieldAverage'),
                        # Stat ID
                        'statId': stat.get('statId'),
                        # Supporting information
                        'supportingStat_description': stat.get('supportingStat', {}).get('description') if stat.get('supportingStat') else None,
                        'supportingStat_value': stat.get('supportingStat', {}).get('value') if stat.get('supportingStat') else None,
                        'supportingValue_description': stat.get('supportingValue', {}).get('description') if stat.get('supportingValue') else None,
                        'supportingValue_value': stat.get('supportingValue', {}).get('value') if stat.get('supportingValue') else None
                    }
                    player_data.append(flat_stat)

    return all_fields, player_data

def write_to_csv(all_fields, player_data, csv_file_path):
    with open(csv_file_path, 'w', newline='') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=all_fields)
        writer.writeheader()
        for stat in player_data:
            writer.writerow(stat)

    print(f"Data successfully written to {csv_file_path}")

def process_json_files_to_csv(json_directory, csv_file_path):
    all_fields, player_data = collect_fields_from_json_files(json_directory)
    
    # Define the stat IDs we want to keep
    relevant_stat_ids = {
        # Birdies/Bogeys related
        '02414',  # Bogey Avoidance
        '106',    # Total Eagles
        '107',    # Total Birdies
        '115',    # Birdie or Better Conversion Percentage
        '155',    # Eagles (Holes per)
        '156',    # Birdie Average
        '352',    # Birdie or Better Percentage
        '02672',  # Consecutive Birdies Streak
        '02673',  # Consecutive Birdies/Eagles streak
        '452',    # Consecutive Holes Below Par
        
        # Par-specific stats and SG
        '142',    # Par 3 Scoring Average
        '143',    # Par 4 Scoring Average
        '144',    # Par 5 Scoring Average
        '112',    # Par 3 Birdie or Better Leaders
        '113',    # Par 4 Birdie or Better Leaders
        '114',    # Par 5 Birdie or Better Leaders

    }
    
    # Filter and process the player data
    filtered_data = []
    for stat in player_data:
        if stat['statId'] in relevant_stat_ids:
            # Clean up all numeric fields by stripping quotes and percentage signs
            numeric_fields = ['value', 'rank', 'fieldAverage', 'supportingStat_value', 
                            'supportingValue_value', 'supportingStat_description', 
                            'supportingValue_description']
            
            for field in numeric_fields:
                if isinstance(stat[field], str):
                    # print(field + " " + stat[field])
                    stat[field] = stat[field].replace('"', '').replace('%', '').replace(',', '').strip()
                    # print(stat[field])
            
            # Add 'Percentage' to title if original value contains '%'
            if isinstance(stat['value'], str) and '%' in stat['value']:
                stat['title'] = stat['title'] + ' Percentage'
            filtered_data.append(stat)
    
    # Write filtered data to CSV
    write_to_csv(all_fields, filtered_data, csv_file_path)
    
    # Print the stats we're including
    print("\nStats included in the CSV:")
    print("-------------------------")
    stat_dict = {}
    for stat in filtered_data:
        stat_id = stat['statId']
        title = stat['title']
        if stat_id not in stat_dict:
            stat_dict[stat_id] = set()
        stat_dict[stat_id].add(title)

    for stat_id in sorted(stat_dict.keys()):
        titles = stat_dict[stat_id]
        if len(titles) == 1:
            print(f"- ID: {stat_id:<6} Title: {next(iter(titles))}")
        else:
            print(f"- ID: {stat_id:<6} Titles found:")
            for title in sorted(titles):
                print(f"    - {title}")
    
    print(f"\nTotal number of unique stat types: {len(stat_dict)}")

# Example usage
if __name__ == "__main__":
    json_directory = 'dev/pga/data/player_stats'
    csv_file_path = 'dev/pga/data/scoring_stats.csv'  # Changed filename to reflect content
    process_json_files_to_csv(json_directory, csv_file_path)