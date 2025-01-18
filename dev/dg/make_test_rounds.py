import json

def load_and_filter_player_data(file_path, output_file_path):
    # Load the JSON data from the file
    with open(file_path, 'r') as f:
        player_data = json.load(f)
    
    # Define the players and course to filter
    target_players = {"Scheffler, Scottie", "Schauffele, Xander"}
    target_course = "Augusta National Golf Club"
    
    # Filter the data
    filtered_data = {
        player: {
            course: data
            for course, data in courses.items()
            if course == target_course
        }
        for player, courses in player_data.items()
        if player in target_players
    }
    
    # Save the filtered data to a new JSON file
    with open(output_file_path, 'w') as f:
        json.dump(filtered_data, f, indent=2)

# Example usage
load_and_filter_player_data('dev/player_rounds_data.json', 'dev/filtered_player_rounds_data.json')