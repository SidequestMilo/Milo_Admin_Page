import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def find_29():
    uri = "mongodb+srv://Praguni:6sKiJdQgR8ijGuUb@cluster0.zhswkru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    client = AsyncIOMotorClient(uri)
    
    dbs = await client.list_database_names()
    for db_name in dbs:
        db = client[db_name]
        collections = await db.list_collection_names()
        for coll in collections:
            count = await db[coll].count_documents({})
            if count == 29:
                print(f"FOUND 29 documents in {db_name}.{coll}")
            elif 25 <= count <= 35:
                 print(f"Found {count} documents in {db_name}.{coll}")
                 
    client.close()

if __name__ == "__main__":
    asyncio.run(find_29())
