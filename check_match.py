import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_match():
    uri = "mongodb+srv://Praguni:6sKiJdQgR8ijGuUb@cluster0.zhswkru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = AsyncIOMotorClient(uri)
    db = client['milo_db']
    
    doc = await db.matches.find_one()
    print(doc)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_match())
