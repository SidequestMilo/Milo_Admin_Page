from dotenv import load_dotenv
import os
load_dotenv()

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_ids():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client['milo_db']
    
    users_ids = await db.users.distinct("telegram_user_id")
    userdata_ids = await db.user_data.distinct("telegram_user_id")
    match_ids_1 = await db.matches.distinct("telegram_user_id")
    
    all_unique = set(users_ids) | set(userdata_ids) | set(match_ids_1)
    
    print(f"Unique telegram_user_id in 'users': {len(users_ids)}")
    print(f"Unique telegram_user_id in 'user_data': {len(userdata_ids)}")
    print(f"Unique telegram_user_id in 'matches': {len(match_ids_1)}")
    print(f"Total Combined Unique Users: {len(all_unique)}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_ids())
