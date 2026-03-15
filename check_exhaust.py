from dotenv import load_dotenv
import os
load_dotenv()

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_all():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    
    dbs = await client.list_database_names()
    print(f"Databases: {dbs}")
    
    for db_name in dbs:
        if db_name in ['admin', 'local', 'config']: continue
        db = client[db_name]
        collections = await db.list_collection_names()
        print(f"\nDatabase: {db_name}")
        for coll in collections:
            count = await db[coll].count_documents({})
            print(f"  - {coll}: {count}")
            
    client.close()

if __name__ == "__main__":
    asyncio.run(check_all())
