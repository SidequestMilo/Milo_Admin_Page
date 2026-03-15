from dotenv import load_dotenv
import os
load_dotenv()

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_matches_raw():
    uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(uri)
    db = client['milo_db']
    
    # Check status distribution
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    cursor = db.matches.aggregate(pipeline)
    print("Match status distribution:")
    async for doc in cursor:
        print(f"  {doc['_id']}: {doc['count']}")
        
    # Check a few samples
    print("\nSample matches:")
    cursor = db.matches.find().limit(3)
    async for doc in cursor:
        print(f"  {doc}")
        
    # Check connections
    conn_count = await db.connections.count_documents({})
    print(f"\nTotal connections: {conn_count}")
    if conn_count > 0:
        sample_conn = await db.connections.find_one()
        print(f"  Sample connection: {sample_conn}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(check_matches_raw())
