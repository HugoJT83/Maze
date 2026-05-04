from typing import Annotated, List

import bson
from fastapi import File, HTTPException, UploadFile

from models.eventModel import Event, EventImage
from config.db import events_collection,user_collection,profile_collection
import cloudinary
import cloudinary.uploader

async def createEventService(data: Event, images: List[Annotated[UploadFile,File()]], userId: str):
    check_exist = await user_collection.find_one({"_id":bson.ObjectId(userId)},{
        "password":0
    })
    if not check_exist:
        raise HTTPException(status_code=404,detail="Creator User Not Found")
    
    event_id_obj = bson.ObjectId()
    event_id_str = str(event_id_obj)
    
    images_data = []

    try:
        
        for index,image_file in enumerate(images):
            
            content = await image_file.read()
            upload_result = cloudinary.uploader.upload(
                content,
                folder=f'events/{event_id_str}',
                resource_type="image"
            )
            
            image_obj = {
                "image_uri": upload_result['secure_url'],
                "public_id": upload_result['public_id']
            }
            
            images_data.append(image_obj)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary Images Upload Error: {str(e)}")
    
    event_data = data.dict()
    
    event_data["_id"]= event_id_obj
    event_data["creator_id"]= userId
    event_data['images']= images_data
    
    print(event_data);
    doc = await events_collection.insert_one(event_data)
    
    await profile_collection.find_one_and_update(
        {"user_id": userId},
        {
            "$push":{
                "created_events":event_id_str
            }
        }
    )
    
    try:
        return {
            "msg":"Event creation success",
            "id":event_id_str
        }
        
    except Exception as e:
        raise HTTPException(status_code=500,detail="Event Creation error:"+f"{e}")
    
    
    
    
    