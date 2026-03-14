import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def check_db():
    uri = "mongodb+srv://Praguni:6sKiJdQgR8ijGuUb@cluster0.zhswkru.mongodb.net/milo_db?retryWrites=true&w=majority&appName=Cluster0"
    client = AsyncIOMotorClient(uri)
    db = client["milo_db"]
    
    users = await db.users.count_documents({})
    matches = await db.matches.count_documents({})
    print(f"Users: {users}, Matches: {matches}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_db())
