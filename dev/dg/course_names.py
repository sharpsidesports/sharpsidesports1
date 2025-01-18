import json

def get_unique_course_names(file_path):
    # Load the JSON data from the file
    with open(file_path, 'r') as f:
        player_data = json.load(f)
    
    # Set to store unique course names
    unique_course_names = set()
    
    # Iterate over each player in the data
    for player, courses in player_data.items():
        # Iterate over each course for the player
        for course_name in courses.keys():
            unique_course_names.add(course_name)
    
    # Sort the course names alphabetically
    sorted_course_names = sorted(unique_course_names)
    
    # Print unique course names
    print("Unique Course Names:")
    for course_name in sorted_course_names:
        print(course_name)

# Specify the path to your JSON file
# file_path = 'src/data/player_rounds_FULL.json'
file_path = 'dev/player_rounds_data.json'

# Call the function to get unique course names
get_unique_course_names(file_path)