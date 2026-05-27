import pytest
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi import HTTPException

from services.ticketService import request_free_ticket
from config.db import tickets_collection, events_collection, user_collection, profile_collection

pytestmark = pytest.mark.asyncio

async def setup_test_environment():
    # 1. Create a dummy creator user
    creator_id = ObjectId()
    await user_collection.insert_one({
        "_id": creator_id,
        "name": "Creador Evento",
        "email": "creador@example.com",
        "role": "USER"
    })
    
    # 2. Create a dummy event
    event_id = ObjectId()
    event_doc = {
        "_id": event_id,
        "title": "Taller Gratuito",
        "description": "Una descripción muy larga para un gran taller.",
        "phone": "600123456",
        "creator_id": str(creator_id),
        "ticket_price": 0.0,  # Free event
        "status": "accepted"
    }
    await events_collection.insert_one(event_doc)
    
    # 3. Create an attendee user
    attendee_id = ObjectId()
    await user_collection.insert_one({
        "_id": attendee_id,
        "name": "Asistente Evento",
        "email": "asistente@example.com",
        "role": "USER"
    })
    
    # 4. Create attendee profile
    await profile_collection.insert_one({
        "user_id": str(attendee_id),
        "name": "Asistente Evento",
        "created_events": [],
        "joined_events": []
    })
    
    return str(event_id), str(attendee_id)

async def test_join_event_adds_reference():
    """Verifica que al unirse a un evento gratis, se guarde la referencia en tickets_collection en estado pending."""
    event_id, attendee_id = await setup_test_environment()
    
    res = await request_free_ticket(event_id, attendee_id)
    
    assert res["message"] == "Solicitud enviada correctamente"
    ticket_id = res["ticket_id"]
    assert ObjectId.is_valid(ticket_id)
    
    # Verify ticket in database
    ticket = await tickets_collection.find_one({"_id": ObjectId(ticket_id)})
    assert ticket is not None
    assert ticket["event_id"] == event_id
    assert ticket["user_id"] == attendee_id
    assert ticket["status"] == "pending"
    assert ticket["ticket_type"] == "free"

async def test_join_event_prevent_duplicates():
    """Comprueba que el usuario no pueda unirse al mismo evento dos veces."""
    event_id, attendee_id = await setup_test_environment()
    
    # First join: should succeed
    res = await request_free_ticket(event_id, attendee_id)
    assert res["message"] == "Solicitud enviada correctamente"
    
    # Second join: should raise 400 Bad Request HTTPException
    with pytest.raises(HTTPException) as exc_info:
        await request_free_ticket(event_id, attendee_id)
        
    assert exc_info.value.status_code == 400
    assert "Ya tienes una solicitud para este evento" in exc_info.value.detail
