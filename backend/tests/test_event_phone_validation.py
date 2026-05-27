import pytest
from pydantic import ValidationError
from datetime import datetime, timedelta
from models.eventModel import EventCreate

pytestmark = pytest.mark.asyncio

def get_valid_event_data(phone="600123456"):
    return {
        "title": "Fiesta de la Música",
        "description": "Una descripción larga de más de diez caracteres.",
        "phone": phone,
        "start_hour": "18:00",
        "finish_hour": "22:00",
        "location": {
            "direction": "Calle Principal 123",
            "city": "Madrid",
            "province": "Madrid",
            "postal_code": "28001"
        },
        "max_capacity": 50,
        "starting_event_date": datetime.now() + timedelta(days=1),
        "finish_event_date": datetime.now() + timedelta(days=1),
        "terms": {
            "termsAccepted": True,
            "acceptedAt": datetime.now(),
            "termsVersion": "1.0"
        },
        "interests": ["MUSICA"]
    }

async def test_event_phone_valid_formats():
    # Format: 9 digits, optional +34, starting with 6 or 7
    valid_phones = ["600123456", "710123456", "+34600123456", "34710123456"]
    for phone in valid_phones:
        data = get_valid_event_data(phone=phone)
        event = EventCreate(**data)
        assert event.phone == phone

async def test_event_phone_invalid_formats():
    # Invalid: non-Spanish prefix, incorrect length, invalid start digit, letters
    invalid_phones = ["123456789", "60012345", "6001234567", "60012345a", "abc", ""]
    for phone in invalid_phones:
        data = get_valid_event_data(phone=phone)
        with pytest.raises(ValidationError) as exc_info:
            EventCreate(**data)
        assert "el número de teléfono debe contener 9 dígitos únicamente y poseer un formato válido" in str(exc_info.value)
