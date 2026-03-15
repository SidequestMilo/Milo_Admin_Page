from dotenv import load_dotenv
import os
load_dotenv()

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_match():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client['milo_db']
    
    doc = await db.matches.find_one()
    print(doc)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_match())
