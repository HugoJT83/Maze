import os
import sys
import pytest
import pytest_asyncio
import asyncio

# Asegurar que el directorio 'backend' esté en el path de Python
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Configurar variables de entorno de prueba antes de importar cualquier módulo del backend
os.environ["MONGO_DB"] = "maze_test"

import config.db as db_module

@pytest_asyncio.fixture(autouse=True)
async def rebind_motor_client():
    """Revincula el cliente de Motor y sus colecciones al event loop activo de cada prueba."""
    import certifi
    from config.env import ENVConfig
    from motor.motor_asyncio import AsyncIOMotorClient
    
    loop = asyncio.get_running_loop()
    
    # Vinculamos de manera explícita el cliente de Motor al loop activo del test actual
    db_module.client = AsyncIOMotorClient(
        ENVConfig.MONGO_CLOUD_CONNECTION, 
        tlsCAFile=certifi.where(),
        io_loop=loop
    )
    db_module.db = db_module.client[ENVConfig.MONGO_DB]
    db_module.user_collection = db_module.db['users']
    db_module.profile_collection = db_module.db['profiles']
    db_module.events_collection = db_module.db['events']
    db_module.tickets_collection = db_module.db['tickets']

@pytest_asyncio.fixture(autouse=True)
async def clean_database(rebind_motor_client):
    """Garantiza el aislamiento total vaciando las colecciones de forma asíncrona dentro del loop de cada test."""
    await db_module.user_collection.delete_many({})
    await db_module.profile_collection.delete_many({})
    await db_module.events_collection.delete_many({})
    await db_module.tickets_collection.delete_many({})
    yield
    await db_module.user_collection.delete_many({})
    await db_module.profile_collection.delete_many({})
    await db_module.events_collection.delete_many({})
    await db_module.tickets_collection.delete_many({})
