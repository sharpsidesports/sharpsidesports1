import requests
import json 

def get_player_info():
    # Call the API endpoint
    url = "https://feeds.datagolf.com/preds/get-dg-rankings"
    params = {
        "file_format": "json",
        "key": "cf5b806066038ad69a752686db8f"
    }
    response = requests.get(url, params=params)
    
    # Extract required information
    player_info = [
        {
            "name": player["player_name"],
            "dg_id": player["dg_id"]
        }
        for player in response.json()["rankings"] if player['primary_tour'] == "PGA"
    ]
    
    return player_info

if __name__ == "__main__":
    players = get_player_info()
    print(json.dumps(players, indent=2))