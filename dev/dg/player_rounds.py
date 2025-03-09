import requests
import json
from pydantic import BaseModel, RootModel
from typing import List, Dict, Optional

# Define Pydantic models
class RoundInfo(BaseModel):
    eventName: str
    eventId: int
    courseName: str
    playerName: str
    dgId: Optional[int]
    round: int
    date: Optional[str]
    teeTime: Optional[str]
    course_num: Optional[int]
    course_par: Optional[int]
    start_hole: Optional[int]
    score: Optional[int]
    sg_app: Optional[float]
    sg_arg: Optional[float]
    sg_ott: Optional[float]
    sg_putt: Optional[float]
    sg_t2g: Optional[float]
    sg_total: Optional[float]
    driving_acc: Optional[float]
    driving_dist: Optional[float]
    gir: Optional[float]
    prox_fw: Optional[float]
    prox_rgh: Optional[float]
    scrambling: Optional[float]

class CourseData(BaseModel):
    rounds: List[RoundInfo]

class PlayerRoundsByCourse(RootModel):
    root: Dict[str, Dict[str, CourseData]]

def get_pga_tour_events():
    # Define the API endpoint and parameters
    url = "https://feeds.datagolf.com/historical-raw-data/event-list"
    params = {
        "file_format": "json",
        "key": "cf5b806066038ad69a752686db8f"
    }
    
    # Define a blacklist of courses
    course_blacklist = {
        "Colonial CC",
        "Conway Farms GC",
        "Eagle Point Golf Club",
        "Innisbrook Resort (Copperhead Course)",
        "Keene Trace Golf Club",
        "Keene Trace Golf Club (Champion Trace)",
        "Keene Trace Golf Club (Champions Course)",
        "Muirfield Village GC",
        "Olympia Fields CC (North)",
        "PGA National (Champion)",
        "RTJ Trail (Grand National)",
        "Riviera CC",
        "Sedgefield CC",
        "Silverado Resort & Spa (North)",
        "Silverado Resort (North Course)",
        "Silverado Resort and Spa North",
        "TPC Four Seasons Resort",
        "TPC San Antonio - AT&T Oaks",
        "TPC Sawgrass",
        "TPC Scottsdale",
        "The Dunes Golf and Beach Club",
        "The Los Angeles Country Club (North Course)",
        "The Summit Club",
        "Valhalla GC",
        "Valhalla Golf Club",
        "Waialae CC"
    }
    
    # Make the request to the API
    response = requests.get(url, params=params)
    
    # Check if the request was successful
    if response.status_code == 200:
        events = response.json()
        
        # Filter for PGA Tour events
        pga_events = [event for event in events if event['tour'] == 'pga' and event['traditional_stats'] == 'yes' and event['sg_categories'] == 'yes']
        
        # Get the first 20 PGA Tour events
        first_20_pga_events = pga_events[:]
        
        # Initialize a data object to store player rounds by course
        player_rounds_by_course = {}
        
        # Iterate over each event
        for event in first_20_pga_events:
            event_id = event['event_id']
            year = event['calendar_year']
            event_name = event['event_name']  # Capture event name
            
            # Fetch historical rounds for the event
            rounds_url = "https://feeds.datagolf.com/historical-raw-data/rounds"
            rounds_params = {
                "tour": "pga",
                "event_id": event_id,
                "year": year,
                "file_format": "json",
                "key": "cf5b806066038ad69a752686db8f"
            }
            rounds_response = requests.get(rounds_url, params=rounds_params)
            
            if rounds_response.status_code == 200:
                rounds_data = rounds_response.json()
                
                # Organize data by player and course
                for score in rounds_data.get('scores', []):
                    player_name = score['player_name']
                    if player_name not in player_rounds_by_course:
                        player_rounds_by_course[player_name] = {}
                    
                    # Iterate over all keys in the score dictionary
                    for round_key, round_info in score.items():
                        if round_key.startswith('round_') and round_info:
                            course_name = round_info['course_name']
                            
                            # Skip processing if the course is in the blacklist
                            if course_name in course_blacklist:
                                continue

                            if course_name not in player_rounds_by_course[player_name]:
                                player_rounds_by_course[player_name][course_name] = {'rounds': []}
                            
                            # Append the round information in the desired format
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
            
            else:
                print(f"Failed to retrieve rounds for event {event_id}: {rounds_response.status_code}")
        
        # Validate and return the organized data using Pydantic
        return PlayerRoundsByCourse.parse_obj(player_rounds_by_course)

    else:
        print("Failed to retrieve data:", response.status_code)

if __name__ == "__main__":
    player_data = get_pga_tour_events()
    print(json.dumps(player_data.dict(), indent=2))
    # Write the player data to a JSON file
    with open('dev/player_rounds_data.json', 'w') as f:
        json.dump(player_data.dict(), f, indent=2)


# {
#   "Tiger Woods": {
#     "Augusta National": {
#       "rounds": [
#         {
#           "eventName": "Masters Tournament",
#           "eventId": 1234,
#           "courseName": "Augusta National",
#           "playerName": "Tiger Woods",
#           "dgId": 5678,
#           "round": 1,
#           "date": "2023-04-06",
#           "teeTime": "09:00",
#           "course_num": 1,
#           "course_par": 72,
#           "start_hole": 1,
#           "score": 70,
#           "sg_app": 1.5,
#           "sg_arg": 0.8,
#           "sg_ott": 1.2,
#           "sg_putt": 0.5,
#           "sg_t2g": 3.5,
#           "sg_total": 4.0,
#           "driving_acc": 75.0,
#           "driving_dist": 300.0,
#           "gir": 80.0,
#           "prox_fw": 25.0,
#           "prox_rgh": 30.0,
#           "scrambling": 60.0
#         }
#         // Additional rounds can be added here
#       ]
#     }
#     // Additional courses can be added here
#   }
#   // Additional players can be added here
# }