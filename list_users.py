import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_users():
    uri = "mongodb+srv://Praguni:6sKiJdQgR8ijGuUb@cluster0.zhswkru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = AsyncIOMotorClient(uri)
    db = client['milo_db']
    
    cursor = db.users.find()
    print(f"Listing all records in 'milo_db.users':")
    async for d in cursor:
        print(f"- ID: {d.get('_id')}, TG_ID: {d.get('telegram_user_id')}, Username: {d.get('username')}, Name: {d.get('profile', {}).get('name')}")
        
    client.close()

if __name__ == "__main__":
    asyncio.run(list_users())
