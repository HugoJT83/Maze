import pytest
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import BackgroundTasks
from models.eventModel import EventCreate
from services.eventService import createEventService
from config.db import user_collection, profile_collection, events_collection

# Marca todos los tests como asíncronos
pytestmark = pytest.mark.asyncio

def get_valid_event_data():
    return {
        "title": "Concierto de Rock",
        "description": "Una descripción larga para un espectacular concierto.",
        "phone": "600123456",
        "start_hour": "20:00",
        "finish_hour": "23:00",
        "location": {
            "direction": "Estadio Olímpico 4",
            "city": "Sevilla",
            "province": "Sevilla",
            "postal_code": "41015"
        },
        "max_capacity": 100,
        "starting_event_date": datetime.now() + timedelta(days=5),
        "finish_event_date": datetime.now() + timedelta(days=5),
        "terms": {
            "termsAccepted": True,
            "acceptedAt": datetime.now(),
            "termsVersion": "1.0"
        },
        "interests": ["MUSICA"]
    }

async def setup_test_user():
    # Insert a dummy creator user and profile
    user_id_obj = ObjectId()
    user_id_str = str(user_id_obj)
    
    user_doc = {
        "_id": user_id_obj,
        "name": "Juan Perez",
        "email": "juan@example.com",
        "role": "USER"
    }
    await user_collection.insert_one(user_doc)
    
    profile_doc = {
        "user_id": user_id_str,
        "name": "Juan Perez",
        "created_events": [],
        "joined_events": []
    }
    await profile_collection.insert_one(profile_doc)
    
    return user_id_str

async def test_create_event_service_success():
    """Verifica que el servicio inserte el evento y devuelva el ID único generado."""
    user_id = await setup_test_user()
    
    event_data = EventCreate(**get_valid_event_data())
    background_tasks = BackgroundTasks()
    
    # Mocking Cloudinary upload to bypass image upload
    import services.eventService as event_service
    # Nos aseguramos de mockear cloudinary.uploader.upload para no hacer peticiones HTTP
    import cloudinary.uploader
    original_upload = cloudinary.uploader.upload
    
    try:
        cloudinary.uploader.upload = lambda content, **kwargs: {
            "secure_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            "public_id": "sample_public_id"
        }
        
        # Mock class for files
        class MockFile:
            def __init__(self, filename):
                self.filename = filename
            async def read(self):
                return b"fake-image-bytes"
                
        mock_images = [MockFile("test.jpg")]
        
        res = await createEventService(event_data, mock_images, user_id, background_tasks)
        
        # Assertions
        assert res["msg"] == "Event creation success"
        event_id = res["id"]
        assert ObjectId.is_valid(event_id)
        
        # Verify stored in DB
        db_event = await events_collection.find_one({"_id": ObjectId(event_id)})
        assert db_event is not None
        assert db_event["title"] == "Concierto de Rock"
        assert db_event["creator_id"] == user_id
        assert db_event["status"] == "pending"  # Initial state awaiting admin approval
        assert len(db_event["images"]) == 1
        assert db_event["images"][0]["image_uri"] == "https://res.cloudinary.com/demo/image/upload/sample.jpg"
        
    finally:
        cloudinary.uploader.upload = original_upload

async def test_create_event_link_to_user_profile():
    """Verifica que el ID del nuevo evento se añada correctamente al array created_events del creador."""
    user_id = await setup_test_user()
    
    event_data = EventCreate(**get_valid_event_data())
    background_tasks = BackgroundTasks()
    
    # Mocking Cloudinary upload
    import cloudinary.uploader
    original_upload = cloudinary.uploader.upload
    
    try:
        cloudinary.uploader.upload = lambda content, **kwargs: {
            "secure_url": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            "public_id": "sample_public_id"
        }
        
        class MockFile:
            async def read(self):
                return b"fake-image"
                
        res = await createEventService(event_data, [MockFile()], user_id, background_tasks)
        event_id = res["id"]
        
        # Verify that the creator's profile in profile_collection contains the new event ID in created_events
        profile = await profile_collection.find_one({"user_id": user_id})
        assert profile is not None
        assert event_id in profile["created_events"]
        
    finally:
        cloudinary.uploader.upload = original_upload
