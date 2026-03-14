import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_db():
    uri = "mongodb+srv://Praguni:6sKiJdQgR8ijGuUb@cluster0.zhswkru.mongodb.net/milo_db?retryWrites=true&w=majority&appName=Cluster0"
    client = AsyncIOMotorClient(uri)
    
    # Check milo_db
    db = client["milo_db"]
    users_count = await db.users.count_documents({})
    print(f"milo_db.users count: {users_count}")
    
    # Check telegram_gateway (just in case)
    db2 = client["telegram_gateway"]
    users_count2 = await db2.users.count_documents({})
    print(f"telegram_gateway.users count: {users_count2}")
    
    # List collections in milo_db
    collections = await db.list_collection_names()
    print(f"milo_db collections: {collections}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
