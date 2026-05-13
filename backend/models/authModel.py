import bson
from pydantic import BaseModel,Field, EmailStr,field_validator
from datetime import datetime, timezone
from typing import List, Optional, Union
from enum import Enum

class RolesEnum(str,Enum):
    user="USER"
    admin="ADMIN"
    
   
class InterestsEnum(str, Enum):
    jardineria = "JARDINERIA"
    juegos = "JUEGOS"
    musica = "MUSICA"
    deporte = "DEPORTE"
    artesania = "ARTESANIA"
    cocina = "COCINA"
    arte = "ARTE"
    teatro = "TEATRO"
    infantil = "INFANTIL"
    ciencias = "CIENCIAS"
    tecnologia = "TECNOLOGIA"
    fiesta = "FIESTA"
    otros = "OTROS"
  
    
class ProfileImage(BaseModel):
    image_uri:str
    public_id:str

class User(BaseModel):
    
    name: str = Field(...)
    email: EmailStr = Field(...)
    password: Optional[str] = Field(...,min_length=6)
    auth_method: Optional[str] = None
    role: Optional[RolesEnum]  = Field(default = RolesEnum.user)
    created_at:datetime = Field(default_factory=datetime.now)
    update_at:datetime = Field(default_factory=datetime.now)
    
    """  Opcional   
        created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)}) 
    """

    @field_validator('name')
    def validate_name(cls,value):
        if len(value)<3:
            raise ValueError("El nombre debe ser mayor de 3 caracteres")
        return value
    

class Address(BaseModel):
    province:str
    city:str
   

class UserProfile(BaseModel):
    
    user_id:str = Field(...)
    name: str = Field(...)
    avatar: Optional[ProfileImage] = None
    description:Optional[str] = ""
    interests: List[InterestsEnum] = Field(default=[], max_items=4)
    address: Optional[Address] = None
    created_events: List[str] = Field(default=[])
    joined_events: List[str] = Field(default = [])
    
    created_at:datetime = Field(default_factory=datetime.now)
    update_at:datetime = Field(default_factory=datetime.now)
    
    @field_validator('name')
    def validate_name(cls,value):
        if len(value)<3:
            raise ValueError("El nombre debe ser mayor de 3 caracteres")
        return value
    
    @field_validator('interests')
    @classmethod
    def check_max_interests(cls, value):
        if len(value)>4:
            raise ValueError("No puedes seleccionar más de 4 intereses")
        return value


class RegisterUser(User):
    pass

class UpdateDetails(BaseModel):
    name:str = Field(...)
    description: Optional[str] = ""
    interests: List[InterestsEnum] = Field(default=[], max_items=4)
    address: Optional[Address] = None
    
    @field_validator('interests')
    @classmethod
    def check_max_interests(cls, value):
        if len(value)>4:
            raise ValueError("No puedes seleccionar más de 4 intereses")
        return value

class LoginUser(BaseModel):
    email: EmailStr = Field(...)
    
    password: str = Field(...,min_length=6)
    pass