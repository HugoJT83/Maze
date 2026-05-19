

import json
from typing import Annotated, List

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile

from controllers import eventController
from controllers.eventController import createEventController
from middleware.VerifyToken import verifyToken
from models.eventModel import Event
import bcrypt
import jwt
import bson

router = APIRouter(prefix="/api/v1/events", tags=['event'])

@router.post("/create-event")
async def createEvent(
    background_tasks: BackgroundTasks,  
    data: str = Form(...),
    userId = Depends(verifyToken),
    images: List[Annotated[UploadFile, File()]] = File(...)):
    
    try:
        data_dict = json.loads(data)
        event_model = Event(**data_dict)
    
        return await eventController.createEventController(event_model,images,userId, background_tasks)

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="event_data is not a JSON")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
@router.get("/my-events")
async def getUserEvents(userId: str = Depends(verifyToken)):
    return await eventController.getEventsByUserController(userId)
    