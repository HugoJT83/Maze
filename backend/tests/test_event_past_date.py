import pytest
from bson import ObjectId
from datetime import datetime, timedelta
from config.db import events_collection, user_collection, profile_collection
from services.eventService import check_and_update_pending_events, getEventsByUserService

pytestmark = pytest.mark.asyncio

async def test_check_and_update_pending_events():
    # Clean database collections
    await events_collection.delete_many({})
    await user_collection.delete_many({})
    
    # 1. Create a pending event in the future
    future_event_id = ObjectId()
    future_event = {
        "_id": future_event_id,
        "title": "Future Event",
        "description": "Event in the future",
        "phone": "600123456",
        "start_hour": "20:00",
        "finish_hour": "23:00",
        "location": {
            "direction": "Street 1",
            "city": "Sevilla",
            "province": "Sevilla"
        },
        "max_capacity": 100,
        "starting_event_date": datetime.now() + timedelta(days=2),
        "finish_event_date": datetime.now() + timedelta(days=2),
        "status": "pending",
        "creator_id": "creator123"
    }
    await events_collection.insert_one(future_event)

    # 2. Create a pending event in the past
    past_event_id = ObjectId()
    past_event = {
        "_id": past_event_id,
        "title": "Past Event",
        "description": "Event in the past",
        "phone": "600123456",
        "start_hour": "10:00",
        "finish_hour": "12:00",
        "location": {
            "direction": "Street 2",
            "city": "Sevilla",
            "province": "Sevilla"
        },
        "max_capacity": 100,
        # Set date to yesterday
        "starting_event_date": datetime.now() - timedelta(days=1),
        "finish_event_date": datetime.now() - timedelta(days=1),
        "status": "pending",
        "creator_id": "creator123"
    }
    await events_collection.insert_one(past_event)

    # Run check and update
    await check_and_update_pending_events()

    # Assertions
    future_db = await events_collection.find_one({"_id": future_event_id})
    assert future_db is not None
    assert future_db["status"] == "pending"

    past_db = await events_collection.find_one({"_id": past_event_id})
    assert past_db is not None
    assert past_db["status"] == "expired"

async def test_get_events_by_user_service_privacy():
    # Clean database collections
    await events_collection.delete_many({})
    await user_collection.delete_many({})
    await profile_collection.delete_many({})

    creator_id = str(ObjectId())
    
    # Setup creator user
    await user_collection.insert_one({
        "_id": ObjectId(creator_id),
        "name": "Creator User",
        "email": "creator@example.com",
        "role": "USER"
    })
    
    # 1. Accepted event
    await events_collection.insert_one({
        "_id": ObjectId(),
        "title": "Accepted Event",
        "description": "Desc",
        "phone": "600123456",
        "start_hour": "10:00",
        "finish_hour": "12:00",
        "location": {"direction": "Str", "city": "City", "province": "Prov"},
        "max_capacity": 100,
        "starting_event_date": datetime.now() + timedelta(days=1),
        "finish_event_date": datetime.now() + timedelta(days=1),
        "status": "accepted",
        "creator_id": creator_id
    })

    # 2. Pending event (in future)
    await events_collection.insert_one({
        "_id": ObjectId(),
        "title": "Pending Event",
        "description": "Desc",
        "phone": "600123456",
        "start_hour": "10:00",
        "finish_hour": "12:00",
        "location": {"direction": "Str", "city": "City", "province": "Prov"},
        "max_capacity": 100,
        "starting_event_date": datetime.now() + timedelta(days=1),
        "finish_event_date": datetime.now() + timedelta(days=1),
        "status": "pending",
        "creator_id": creator_id
    })

    # 3. Expired event (pending in past)
    await events_collection.insert_one({
        "_id": ObjectId(),
        "title": "Expired Event",
        "description": "Desc",
        "phone": "600123456",
        "start_hour": "10:00",
        "finish_hour": "12:00",
        "location": {"direction": "Str", "city": "City", "province": "Prov"},
        "max_capacity": 100,
        "starting_event_date": datetime.now() - timedelta(days=1),
        "finish_event_date": datetime.now() - timedelta(days=1),
        "status": "pending",
        "creator_id": creator_id
    })

    # Call service as private (creator itself)
    events_private = await getEventsByUserService(creator_id, public=False)
    # Private should see all 3 (since pending in past is updated to expired)
    assert len(events_private) == 3
    statuses_private = [e.status for e in events_private]
    assert "accepted" in statuses_private
    assert "pending" in statuses_private
    assert "expired" in statuses_private

    # Call service as public (another user)
    events_public = await getEventsByUserService(creator_id, public=True)
    # Public should only see accepted and expired (2 events total)
    assert len(events_public) == 2
    statuses_public = [e.status for e in events_public]
    assert "accepted" in statuses_public
    assert "expired" in statuses_public
    assert "pending" not in statuses_public
