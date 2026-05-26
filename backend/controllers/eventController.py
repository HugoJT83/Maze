

from typing import Annotated, List

from fastapi import BackgroundTasks, File, HTTPException, UploadFile

from models.eventModel import EventBase, EventCreate, EventResponse
from services import eventService
from services.eventService import createEventService


async def createEventController(event_data: EventCreate, images:List[Annotated[UploadFile,File()]], userId, background_tasks: BackgroundTasks):
        res_obj = await eventService.createEventService(event_data,images, userId, background_tasks)
        return res_obj
    
async def getEventsByUserController(user_id: str):
        res_obj = await eventService.getEventsByUserService(user_id)
        if res_obj and len(res_obj) > 0:
                return res_obj
        
        return []

async def getEventByIdController(event_id: str):
        res_obj = await eventService.getEventByIdService(event_id)
        return res_obj 

async def deleteEventController(id: str, userId: str, background_tasks: BackgroundTasks):
        res_obj = await eventService.deleteEventService(id, userId, background_tasks)
        return res_obj 

async def getPendingEventsController(adminUserId: str, page: int = 1, limit: int = 5):
        res_obj = await eventService.getPendingEventsService(adminUserId, page, limit)
        return res_obj

async def getEventManagementDetailController(event_id: str, adminUserId: str):
        res_obj = await eventService.getEventManagementDetailService(event_id, adminUserId)
        return res_obj

async def approveEventController(event_id: str, adminUserId: str,  background_tasks: BackgroundTasks):
        res_obj = await eventService.approveEventService(event_id, adminUserId, background_tasks)
        return res_obj

async def denyEventController(event_id: str, justification: str, adminUserId: str, background_tasks: BackgroundTasks):
        res_obj = await eventService.denyEventService(event_id, justification, adminUserId, background_tasks)
        return res_obj

async def searchEventsController(lat: float = None, lng: float = None, radius: float = None, start_date: str = None, end_date: str = None, interests: str = None, city: str = None, province: str = None, page: int = 1, limit: int = 10):
        res_obj = await eventService.searchEventsService(lat, lng, radius, start_date, end_date, interests, city, province, page, limit)
        return res_obj