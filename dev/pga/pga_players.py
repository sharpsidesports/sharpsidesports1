import requests
import json
import os

save_all_data = False  

url = "https://orchestrator.pgatour.com/graphql"
headers = {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-amz-user-agent": "aws-amplify/3.0.7",
    "x-api-key": "da2-gsrx5bibzbb4njvhl7t37wqyl4",
    "x-pgat-platform": "web"
}

# Tour Codes:
# R: PGA Tour (Regular Tour) - This is the main professional golf tour in the United States, featuring the top golfers from around the world.
# H: PGA Tour Champions - This tour is for professional golfers aged 50 and older, often referred to as the senior tour.
# C: Korn Ferry Tour - This is the developmental tour for the PGA Tour, where up-and-coming golfers compete to earn their PGA Tour cards.

body = {
    "operationName": "PlayerDirectory",
    "variables": {"tourCode": "R"},
    "query": """
    query PlayerDirectory($tourCode: TourCode!, $active: Boolean) {
      playerDirectory(tourCode: $tourCode, active: $active) {
        tourCode
        players {
          id
          isActive
          firstName
          lastName
          shortName
          displayName
          alphaSort
          country
          countryFlag
          headshot
          playerBio {
            id
            age
            education
            turnedPro
          }
        }
      }
    }
    """
}

response = requests.post(url, headers=headers, json=body)

if response.ok:
    data = response.json()
    if save_all_data:
        players_to_save = data["data"]["playerDirectory"]["players"]
    else:
        players_to_save = [
            {
                "id": player["id"],
                "firstName": player["firstName"],
                "lastName": player["lastName"],
                "headshot": player["headshot"],
                "isActive": player["isActive"]
            }
            for player in data["data"]["playerDirectory"]["players"]
            if player["isActive"]
        ]
    
    data_dir = 'pga/dev/data'
    # Create data directory if it doesn't exist
    os.makedirs(data_dir, exist_ok=True)
    # Save the data to a file
    with open(f'{data_dir}/pga_players.json', 'w') as file:
        json.dump(players_to_save, file, indent=4)
    print("Player data saved to pga_players.json")
else:
    print(f"Error: {response.status_code}, {response.text}")