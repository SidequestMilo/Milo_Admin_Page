import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def check_all():
    uri = "mongodb+srv://Praguni:6sKiJdQgR8ijGuUb@cluster0.zhswkru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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
