

from typing import Annotated, List

from fastapi import File, HTTPException, UploadFile

from models.eventModel import Event
from services.eventService import createEventService


async def createEventController(event_data: Event, images:List[Annotated[UploadFile,File()]], userId):
        res_obj = await createEventService(event_data,images, userId)
        return res_obj
    
