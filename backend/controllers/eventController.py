

from typing import Annotated, List

from fastapi import BackgroundTasks, File, HTTPException, UploadFile

from models.eventModel import Event
from services.eventService import createEventService


async def createEventController(event_data: Event, images:List[Annotated[UploadFile,File()]], userId, background_tasks: BackgroundTasks):
        res_obj = await createEventService(event_data,images, userId, background_tasks)
        return res_obj
    
