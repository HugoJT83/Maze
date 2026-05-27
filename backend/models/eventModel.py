
from typing import Annotated, Any, Optional
from bson import ObjectId
from pydantic import BeforeValidator, model_validator
from datetime import datetime
import re
from typing import List

from pydantic import BaseModel, Field, field_validator

from models.authModel import InterestsEnum

class Location(BaseModel):
    direction: str = Field(...)
    city: str = Field(...)
    province: str = Field(...)
    coordinates: List[float] = Field(default=[], description="[longitude, latitude]")

    @field_validator('direction','city','province')
    @classmethod
    def check_not_empty_whitespace(cls,value):
        if not value.strip():
            raise ValueError("El campo no puede estar vacío o solo contener espacios en blanco.")
        return value
    
    
class EventImage(BaseModel):
    image_uri:str
    public_id:str

class LegalTerms(BaseModel):
    termsAccepted: bool
    acceptedAt: datetime = Field(default_factory=datetime.now)
    termsVersion: str = "1.0"

    
class EventBase(BaseModel):
    title: str = Field(...)
    description: str = Field(...)
    phone: str = Field(...)
    creation_date: datetime = Field(default_factory=datetime.now)
    start_hour: str = Field(...)
    finish_hour: str = Field(...)
    location: Location = Field(...)
    interests: List[InterestsEnum] = Field(default=[], max_items=3)
    updated_at: datetime = Field(default_factory=datetime.now)
    status: str = Field(default="pending")
    max_capacity: int = Field(...)
    max_tickets_per_person: Optional[int] = None
    ticket_price: Optional[float] = None
    
    
class EventCreate(EventBase):
    starting_event_date:datetime = Field(...)
    finish_event_date:datetime = Field(...)
    terms:LegalTerms
    
    @field_validator('starting_event_date')
    @classmethod
    def check_future_starting_date(cls, value):
        if value < datetime.now():
            raise ValueError("la fecha de inicio del evento no puede ser anterior a la fecha actual.")
        return value
    
    @field_validator('finish_event_date')
    @classmethod
    def check_future_finish_date(cls, value):
        if value < datetime.now():
            raise ValueError("la fecha final del evento no puede ser anterior a la fecha actual.")
        return value
    
    @model_validator(mode="before")
    @classmethod
    def validate_terms(cls, data: Any) -> Any:
        if isinstance(data,dict):
            terms_obj = data.get("terms")

            if isinstance(terms_obj,dict):
                is_accepted = terms_obj.get("termsAccepted")
            else:
                is_accepted = terms_obj
                
            if is_accepted is not True:
                raise ValueError("Es obligatorio aceptar terminos y condiciones");

            data["terms"] = {
                "termsAccepted": True,
                "acceptedAt": datetime.now(),
                "termsVersion":"1.0"
            }
            
        return data

    @model_validator(mode="after")
    def check_monetization(self):
        if self.ticket_price is not None:
            if self.ticket_price <= 0:
                raise ValueError("El precio del evento debe ser mayor que 0.")
            if self.max_tickets_per_person is None or self.max_tickets_per_person < 1:
                raise ValueError("Debe especificar un máximo válido de entradas por persona.")
        return self

PyObjectId = Annotated[str, BeforeValidator(str)]

class EventResponse(EventBase):
    id: PyObjectId = Field(alias="_id")
    starting_event_date: datetime
    finish_event_date: datetime
    images: List[EventImage] = Field(default=[])
    creator_id: str = Field(default="")
    accepted_users: Optional[int] = 0
    pending_users: Optional[int] = 0
    purchased_tickets: Optional[int] = 0
    