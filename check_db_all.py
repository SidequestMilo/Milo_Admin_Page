from dotenv import load_dotenv
load_dotenv()

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_db():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    
    dbs = await client.list_database_names()
    print(f"Databases: {dbs}")
    
    for db_name in dbs:
        db = client[db_name]
        collections = await db.list_collection_names()
        print(f"DB '{db_name}' collections: {collections}")
        if 'users' in collections:
            count = await db.users.count_documents({})
            print(f"  -> collections 'users' count: {count}")
        if 'user_data' in collections:
             count = await db.user_data.count_documents({})
             print(f"  -> collections 'user_data' count: {count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
