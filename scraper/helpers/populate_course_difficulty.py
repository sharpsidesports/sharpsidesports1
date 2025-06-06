# RUN THIS TO POPULATE THE COURSE DIFFICULTY TABLE IF IT DOESNT EXIST YET


# CREATE TABLE course_difficulty (
#     course_name TEXT PRIMARY KEY,
#     driving_rank INTEGER,
#     scoring_rank INTEGER,
#     approach_rank INTEGER,
#     driving_difficulty TEXT, -- "easy", "medium", "hard"
#     approach_difficulty TEXT, -- "easy", "medium", "hard"
#     scoring_difficulty TEXT,  -- "easy", "medium", "hard"
#     created_at TIMESTAMPTZ DEFAULT NOW()
# );

import json
import os
import time
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = 'https://fsyvigmmevdsfaluzqjz.supabase.co'  # DEV
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzeXZpZ21tZXZkc2ZhbHV6cWp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzMyMTI2MSwiZXhwIjoyMDUyODk3MjYxfQ.oLNgCXjYk3bxu_l5otSSIxRXFlKideW7x5wsKLuNzIM'
SUPABASE_URL = 'https://skpzfhljjsysmzyrtnho.supabase.co'  # SG LIVE DB
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrcHpmaGxqanN5c216eXJ0bmhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDY2MzE0OSwiZXhwIjoyMDUwMjM5MTQ5fQ.DGneRgX4BA-Otfm4LSXw3NGwPSFIuIT6UJvYWBNj45w' #THEIRS

# Course difficulty data
COURSE_DIFFICULTY = {
  "Torrey Pines Golf Course (South Course)": {
    "driving": 47,
    "scoring": 8,
    "approach": 19,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "hard"
    }
  },
  "Pebble Beach Golf Links": {
    "driving": 8,
    "scoring": 15,
    "approach": 9,
    "difficulty": {
      "driving": "hard",
      "approach": "hard",
      "scoring": "medium"
    }
  },
  "Waialae Country Club": {
    "driving": 62,
    "scoring": 77,
    "approach": 81,
    "difficulty": {
      "driving": "medium",
      "approach": "easy",
      "scoring": "medium"
    }
  },
  "Arnold Palmer's Bay Hill Club & Lodge": {
    "driving": 17,
    "scoring": 21,
    "approach": 10,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "TPC Sawgrass (THE PLAYERS Stadium Course)": {
    "driving": 11,
    "scoring": 29,
    "approach": 12,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Harbour Town Golf Links": {
    "driving": 6,
    "scoring": 52,
    "approach": 21,
    "difficulty": {
      "driving": "hard",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Augusta National Golf Club": {
    "driving": 63,
    "scoring": 9,
    "approach": 2,
    "difficulty": {
      "driving": "medium",
      "approach": "hard",
      "scoring": "hard"
    }
  },
  "Colonial Country Club": {
    "driving": 10,
    "scoring": 32,
    "approach": 29,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Muirfield Village Golf Club": {
    "driving": 41,
    "scoring": 48,
    "approach": 27,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Glen Abbey GC": {
    "driving": 76,
    "scoring": 69,
    "approach": 11,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Firestone CC (South)": {
    "driving": 58,
    "scoring": 17,
    "approach": 32,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Albany GC": {
    "driving": 72,
    "scoring": 71,
    "approach": 50,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "TPC Potomac at Avenel Farm": {
    "driving": 14,
    "scoring": 26,
    "approach": 48,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Glen Oaks Club": {
    "driving": 70,
    "scoring": 14,
    "approach": 45,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Club de Golf Chapultepec": {
    "driving": 93,
    "scoring": 35,
    "approach": 54,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Quail Hollow Club": {
    "driving": 71,
    "scoring": 25,
    "approach": 24,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Trinity Forest Golf Club": {
    "driving": 92,
    "scoring": 85,
    "approach": 85,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "easy"
    }
  },
  "Le Golf National": {
    "driving": 12,
    "scoring": 62,
    "approach": 76,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Medinah Country Club (No. 3)": {
    "driving": 66,
    "scoring": 75,
    "approach": 74,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Castle Pines Golf Club": {
    "driving": 97,
    "scoring": 38,
    "approach": 39,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "TPC River Highlands": {
    "driving": 45,
    "scoring": 60,
    "approach": 66,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "TPC Scottsdale (Stadium Course)": {
    "driving": 65,
    "scoring": 56,
    "approach": 46,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "TPC Southwind": {
    "driving": 48,
    "scoring": 44,
    "approach": 35,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Oak Hill Country Club": {
    "driving": 3,
    "scoring": 4,
    "approach": 30,
    "difficulty": {
      "driving": "hard",
      "approach": "medium",
      "scoring": "hard"
    }
  },
  "Pinehurst Resort & Country Club (Course No. 2)": {
    "driving": 83,
    "scoring": 2,
    "approach": 17,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "hard"
    }
  },
  "Bellerive CC": {
    "driving": 52,
    "scoring": 36,
    "approach": 82,
    "difficulty": {
      "driving": "medium",
      "approach": "easy",
      "scoring": "medium"
    }
  },
  "TPC Summerlin": {
    "driving": 89,
    "scoring": 81,
    "approach": 62,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "easy"
    }
  },
  "Silverado Resort and Spa (North Course)": {
    "driving": 37,
    "scoring": 68,
    "approach": 42,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Southern Hills Country Club": {
    "driving": 75,
    "scoring": 6,
    "approach": 15,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "hard"
    }
  },
  "Plantation Course at Kapalua": {
    "driving": 96,
    "scoring": 94,
    "approach": 73,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "easy"
    }
  },
  "Innisbrook Resort (Copperhead)": {
    "driving": 5,
    "scoring": 30,
    "approach": 23,
    "difficulty": {
      "driving": "hard",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "St. Andrews Links (Old Course)": {
    "driving": 95,
    "scoring": 53,
    "approach": 3,
    "difficulty": {
      "driving": "easy",
      "approach": "hard",
      "scoring": "medium"
    }
  },
  "TPC Deere Run": {
    "driving": 88,
    "scoring": 86,
    "approach": 79,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "easy"
    }
  },
  "East Lake Golf Club": {
    "driving": 90,
    "scoring": 70,
    "approach": 22,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Bethpage Black": {
    "driving": 40,
    "scoring": 10,
    "approach": 20,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Ocean Course at Kiawah Island": {
    "driving": 29,
    "scoring": 7,
    "approach": 4,
    "difficulty": {
      "driving": "medium",
      "approach": "hard",
      "scoring": "hard"
    }
  },
  "TPC Boston": {
    "driving": 59,
    "scoring": 45,
    "approach": 38,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Pete Dye Stadium Course": {
    "driving": 28,
    "scoring": 80,
    "approach": 52,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "easy"
    }
  },
  "Royal Troon": {
    "driving": 1,
    "scoring": 3,
    "approach": 1,
    "difficulty": {
      "driving": "hard",
      "approach": "hard",
      "scoring": "hard"
    }
  },
  "Royal Liverpool": {
    "driving": 2,
    "scoring": 13,
    "approach": 14,
    "difficulty": {
      "driving": "hard",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Golf Club of Houston": {
    "driving": 7,
    "scoring": 59,
    "approach": 65,
    "difficulty": {
      "driving": "hard",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "PGA National Resort (The Champion)": {
    "driving": 24,
    "scoring": 66,
    "approach": 26,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Sedgefield Country Club": {
    "driving": 69,
    "scoring": 76,
    "approach": 97,
    "difficulty": {
      "driving": "medium",
      "approach": "easy",
      "scoring": "medium"
    }
  },
  "TPC San Antonio (Oaks Course)": {
    "driving": 26,
    "scoring": 37,
    "approach": 16,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "The Old White TPC": {
    "driving": 74,
    "scoring": 67,
    "approach": 87,
    "difficulty": {
      "driving": "medium",
      "approach": "easy",
      "scoring": "medium"
    }
  },
  "St. George's G&CC": {
    "driving": 68,
    "scoring": 40,
    "approach": 34,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Aronimink GC": {
    "driving": 81,
    "scoring": 74,
    "approach": 86,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "medium"
    }
  },
  "Sea Island Golf Club (Seaside Course)": {
    "driving": 43,
    "scoring": 73,
    "approach": 77,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Ridgewood CC": {
    "driving": 19,
    "scoring": 46,
    "approach": 78,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Hamilton Golf & Country Club": {
    "driving": 53,
    "scoring": 55,
    "approach": 58,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "ACCORDIA GOLF Narashino Country Club": {
    "driving": 32,
    "scoring": 78,
    "approach": 93,
    "difficulty": {
      "driving": "medium",
      "approach": "easy",
      "scoring": "medium"
    }
  },
  "Detroit Golf Club": {
    "driving": 87,
    "scoring": 87,
    "approach": 80,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "easy"
    }
  },
  "Shadow Creek Golf Course": {
    "driving": 54,
    "scoring": 51,
    "approach": 57,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Sherwood Country Club": {
    "driving": 16,
    "scoring": 91,
    "approach": 56,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "easy"
    }
  },
  "Caves Valley Golf Club": {
    "driving": 86,
    "scoring": 88,
    "approach": 95,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "easy"
    }
  },
  "TPC Twin Cities": {
    "driving": 56,
    "scoring": 72,
    "approach": 70,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Liberty National Golf Club": {
    "driving": 25,
    "scoring": 54,
    "approach": 63,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Winged Foot GC": {
    "driving": 4,
    "scoring": 1,
    "approach": 28,
    "difficulty": {
      "driving": "hard",
      "approach": "medium",
      "scoring": "hard"
    }
  },
  "TPC Craig Ranch": {
    "driving": 84,
    "scoring": 95,
    "approach": 96,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "easy"
    }
  },
  "TPC Harding Park": {
    "driving": 39,
    "scoring": 23,
    "approach": 40,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Olympia Fields Country Club (North Course)": {
    "driving": 18,
    "scoring": 16,
    "approach": 41,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Memorial Park Golf Course": {
    "driving": 57,
    "scoring": 31,
    "approach": 37,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "The Concession Golf Club": {
    "driving": 20,
    "scoring": 41,
    "approach": 44,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Wilmington Country Club": {
    "driving": 67,
    "scoring": 43,
    "approach": 43,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Congaree Golf Club": {
    "driving": 94,
    "scoring": 47,
    "approach": 36,
    "difficulty": {
      "driving": "easy",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Oakdale Golf & Country Club": {
    "driving": 15,
    "scoring": 63,
    "approach": 49,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Black Desert Resort": {
    "driving": 98,
    "scoring": 93,
    "approach": 88,
    "difficulty": {
      "driving": "easy",
      "approach": "easy",
      "scoring": "easy"
    }
  },
  "The Renaissance Club": {
    "driving": 30,
    "scoring": 42,
    "approach": 51,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "medium"
    }
  },
  "Vidanta Vallarta": {
    "driving": 73,
    "scoring": 79,
    "approach": 69,
    "difficulty": {
      "driving": "medium",
      "approach": "medium",
      "scoring": "easy"
    }
  }
}

def populate_course_difficulty():
    """
    Populates the course_difficulty table in Supabase with course data.
    
    The table has the following schema:
    - course_name: TEXT PRIMARY KEY
    - driving_rank: INTEGER
    - scoring_rank: INTEGER
    - approach_rank: INTEGER
    - driving_difficulty: TEXT ('easy', 'medium', 'hard')
    - approach_difficulty: TEXT ('easy', 'medium', 'hard')
    - scoring_difficulty: TEXT ('easy', 'medium', 'hard')
    - created_at: TIMESTAMPTZ DEFAULT NOW()
    """
    try:
        # Initialize Supabase client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Delete existing records from the course_difficulty table
        print("Deleting existing records from course_difficulty table...")
        supabase.table('course_difficulty').delete().neq('course_name', '').execute()
        
        # Format course data for insertion
        formatted_courses = []
        for course_name, data in COURSE_DIFFICULTY.items():
            formatted_courses.append({
                'course_name': course_name,
                'driving_rank': data['driving'],
                'scoring_rank': data['scoring'],
                'approach_rank': data['approach'],
                'driving_difficulty': data['difficulty']['driving'],
                'approach_difficulty': data['difficulty']['approach'],
                'scoring_difficulty': data['difficulty']['scoring']
            })
        
        # Insert course data in batches
        BATCH_SIZE = 50
        print(f"Inserting {len(formatted_courses)} courses into course_difficulty table...")
        
        for i in range(0, len(formatted_courses), BATCH_SIZE):
            batch = formatted_courses[i:i+BATCH_SIZE]
            supabase.table('course_difficulty').insert(batch).execute()
            print(f"Inserted batch {i//BATCH_SIZE + 1}: courses {i+1} to {min(i+len(batch), len(formatted_courses))}")
            time.sleep(0.1)  # Small delay to avoid rate limits
        
        print(f"Successfully populated course_difficulty table with {len(formatted_courses)} courses.")
        
    except Exception as e:
        print(f"Error populating course_difficulty table: {e}")
        raise

if __name__ == "__main__":
    print("Starting course difficulty data population...")
    populate_course_difficulty()
    print("Done!") 