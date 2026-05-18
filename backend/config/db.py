import certifi

from config.env import ENVConfig

from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(ENVConfig.MONGO_CLOUD_CONNECTION, tlsCAFile=certifi.where())
db = client[ENVConfig.MONGO_DB]


#User Collection

user_collection = db['users']
profile_collection = db['profiles']
events_collection = db['events']
