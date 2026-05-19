
from typing import Any
from pydantic import model_validator
from datetime import datetime
import re
from typing import List

from pydantic import BaseModel, Field, field_validator

from models.authModel import InterestsEnum

class Location(BaseModel):
    direction: str = Field(...)
    city: str = Field(...)
    province: str = Field(...)

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


class Event(BaseModel):
    
    title: str = Field(...)
    description: str = Field(...)
    phone: str = Field(...)
    creation_date: datetime = Field(default_factory=datetime.now)
    starting_event_date:datetime = Field(...)
    finish_event_date:datetime = Field(...)
    start_hour: str = Field(...)
    finish_hour: str = Field(...)
    location: Location = Field(...)
    interests: List[InterestsEnum] = Field(default=[], max_items=3)
    updated_at: datetime = Field(default_factory=datetime.now)
    terms:LegalTerms
    status: str = Field(default="pending")
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, value):
        clean_phone = re.sub(r'[\s\-]', '', value) #limpia espacios o guiones
        
        if not re.match(r'^(\+?34)?(6\d{2}|7[1-9]\d{1})\d{6}$',clean_phone):
            raise ValueError("El número de teléfono debe ser válido")
        return value
    
    
    @field_validator('title')
    @classmethod
    def validate_title(cls, value):
        if len(value)<3:
            raise ValueError("El título debe ser mayor de 3 caracteres")
        return value
    
    @field_validator('description')
    @classmethod
    def validate_description(cls, value):
        if len(value)<10:
            raise ValueError("La descripción debe ser mayor de 10 caracteres")
        return value
    
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
    
    @field_validator('interests')
    @classmethod
    def validate_interests_length(cls,value):
        if len(value) > 3:
            raise ValueError("Un evento solo puede contener como máximo 3 intereses")
        return value

    @model_validator(mode="before")
    @classmethod
    def validate_terms(cls, data: Any) -> Any:
        if isinstance(data,dict):
            terms_obj = data.get("terms")

            if terms_obj["termsAccepted"] is not True:
                raise ValueError("Es obligatorio aceptar terminos y condiciones");

            data["terms"] = {
                "termsAccepted": True,
                "acceptedAt": datetime.now(),
                "termsVersion":"1.0"
            }
            
        return data
    
