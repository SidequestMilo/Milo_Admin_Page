from dotenv import load_dotenv
import os
load_dotenv()

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_new_db():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    
    try:
        db = client['milo_db']
        cursor = db.users.find().limit(5)
        async for doc in cursor:
            print(f"User: {doc.get('telegram_user_id')}")
            print(f"  Profile: {doc.get('profile')}")
            print(f"  Keys: {list(doc.keys())}")
    except Exception as e:
        print(f"Error connecting to new database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(check_new_db())
