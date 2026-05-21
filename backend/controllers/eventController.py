

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
        