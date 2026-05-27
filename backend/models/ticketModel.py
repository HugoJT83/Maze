from typing import Annotated, Any, Optional
from bson import ObjectId
from pydantic import BaseModel, Field, BeforeValidator
from datetime import datetime
from enum import Enum

class TicketStatus(str, Enum):
    pending = "pending"   # Petición enviada (para eventos gratis)
    accepted = "accepted" # Petición aceptada (eventos gratis)
    rejected = "rejected" # Petición denegada (eventos gratis)
    paid = "paid"         # Comprada exitosamente (eventos de pago)

class TicketType(str, Enum):
    free = "free"
    paid = "paid"

PyObjectId = Annotated[str, BeforeValidator(str)]

class TicketBase(BaseModel):
    event_id: str = Field(...)
    user_id: str = Field(...)
    status: TicketStatus = Field(default=TicketStatus.pending)
    ticket_type: TicketType = Field(...)
    ticket_validator: Optional[str] = None
    stripe_session_id: Optional[str] = None
    payment_intent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class TicketCreate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: PyObjectId = Field(alias="_id")

# Ticket Response con datos del usuario para el creador del evento
class TicketUserResponse(TicketResponse):
    user_name: str
    user_email: str
