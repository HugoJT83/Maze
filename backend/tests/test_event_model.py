import pytest
from pydantic import ValidationError
from datetime import datetime, timedelta
from models.eventModel import EventCreate

pytestmark = pytest.mark.asyncio

def get_valid_event_data(postal_code="28001"):
    return {
        "title": "Tarde de Ajedrez",
        "description": "Una descripción muy larga para jugar al ajedrez.",
        "phone": "600123456",
        "start_hour": "17:00",
        "finish_hour": "20:00",
        "location": {
            "direction": "Plaza Mayor 10",
            "city": "Madrid",
            "province": "Madrid",
            "postal_code": postal_code
        },
        "max_capacity": 20,
        "starting_event_date": datetime.now() + timedelta(days=2),
        "finish_event_date": datetime.now() + timedelta(days=2),
        "terms": {
            "termsAccepted": True,
            "acceptedAt": datetime.now(),
            "termsVersion": "1.0"
        },
        "interests": ["JUEGOS"]
    }

async def test_event_creation_with_valid_data():
    """Verifica que un evento se instancie correctamente con los campos obligatorios."""
    data = get_valid_event_data()
    event = EventCreate(**data)
    
    assert event.title == "Tarde de Ajedrez"
    assert event.phone == "600123456"
    assert event.location.city == "Madrid"
    assert event.location.postal_code == "28001"
    assert event.max_capacity == 20
    assert event.interests == ["JUEGOS"]
    assert event.terms.termsAccepted is True

async def test_location_postal_code_format():
    """Comprueba que el código postal de Location sea exactamente de 5 dígitos numéricos."""
    # Valid postal codes
    valid_pcs = ["28001", "08001", "41001", "50001", None]
    for pc in valid_pcs:
        data = get_valid_event_data(postal_code=pc)
        event = EventCreate(**data)
        assert event.location.postal_code == pc

    # Invalid postal codes
    invalid_pcs = ["1234", "123456", "28a01", "     ", ""]
    for pc in invalid_pcs:
        data = get_valid_event_data(postal_code=pc)
        with pytest.raises(ValidationError) as exc_info:
            EventCreate(**data)
        # Verify the error is related to postal_code
        assert "postal_code" in str(exc_info.value)
        assert "El código postal debe ser exactamente de 5 dígitos numéricos." in str(exc_info.value)
