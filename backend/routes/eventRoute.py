

import json
from typing import Annotated, List

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile

from controllers import eventController
from controllers.eventController import createEventController
from middleware.VerifyToken import verifyToken
import bcrypt
import jwt
import bson

from models.eventModel import EventCreate

router = APIRouter(prefix="/api/v1/events", tags=['event'])

@router.post("/create-event")
async def createEvent(
    background_tasks: BackgroundTasks,  
    data: str = Form(...),
    userId = Depends(verifyToken),
    images: List[Annotated[UploadFile, File()]] = File(...)):
    
    try:
        data_dict = json.loads(data)
        event_model = EventCreate(**data_dict)
    
        return await eventController.createEventController(event_model,images,userId, background_tasks)

    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="event_data is not a JSON")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    
@router.get("/my-events")
async def getUserEvents(userId: str = Depends(verifyToken)):
    return await eventController.getEventsByUserController(userId)

@router.get("/pending")
async def getPendingEvents(page: int = 1, limit: int = 5, userId: str = Depends(verifyToken)):
    return await eventController.getPendingEventsController(userId, page, limit)

@router.get("/search")
async def searchEvents(lat: float = None, lng: float = None, radius: float = None, start_date: str = None, end_date: str = None, interests: str = None, city: str = None, province: str = None, page: int = 1, limit: int = 10):
    return await eventController.searchEventsController(lat, lng, radius, start_date, end_date, interests, city, province, page, limit)

@router.get("/{id}")
async def getEventById(id: str, userId: str = Depends(verifyToken)):
    return await eventController.getEventByIdController(id)

@router.delete("/delete-event/{id}")
async def deleteEvent(id:str, userId: str = Depends(verifyToken)):
    return await eventController.deleteEventController(id, userId)
    


@router.get("/manage/{id}")
async def getEventManagementDetail(id: str, userId: str = Depends(verifyToken)):
    return await eventController.getEventManagementDetailController(id, userId)

@router.put("/approve/{id}")
async def approveEvent(id: str, background_tasks: BackgroundTasks, userId: str = Depends(verifyToken)):
    return await eventController.approveEventController(id, userId, background_tasks)

@router.put("/deny/{id}")
async def denyEvent(id: str, data: dict, background_tasks: BackgroundTasks, userId: str = Depends(verifyToken)):
    justification = data.get("justification", "")
    return await eventController.denyEventController(id, justification, userId, background_tasks)
    