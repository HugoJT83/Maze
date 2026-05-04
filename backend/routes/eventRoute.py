

import json
from typing import Annotated, List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from controllers.eventController import createEventController
from middleware.VerifyToken import verifyToken
from models.eventModel import Event
import bcrypt
import jwt
import bson

router = APIRouter(prefix="/api/v1/events", tags=['event'])

@router.post("/create-event")
async def createEvent(data: str = Form(...), images: List[Annotated[UploadFile, File()]] = File(...), userId = Depends(verifyToken)):
    
    try:
        data_dict = json.loads(data)
        
        event_model = Event(**data_dict)
    
        return await createEventController(event_model,images,userId)

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="event_data is not a JSON")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
    