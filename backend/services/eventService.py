from typing import Annotated, List

import bson
from fastapi import BackgroundTasks, File, HTTPException, UploadFile

from models.eventModel import EventCreate, EventResponse, EventImage
from config.db import events_collection,user_collection,profile_collection
import cloudinary
import cloudinary.uploader
import config.CloudinaryConfig

import httpx
from services.mailService import createEventNotificationService, sendEventDenialNotificationService, sendEventApprovalNotificationService, sendEventCanceledNotificationService

async def get_coordinates(city: str, province: str) -> list:
    try:
        query = f"{city}, {province}"
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"q": query, "format": "json", "limit": 1},
                headers={"User-Agent": "FarmStackEventApp/1.0"}
            )
            data = response.json()
            if data and len(data) > 0:
                return [float(data[0]["lon"]), float(data[0]["lat"])]
    except Exception as e:
        print(f"Error fetching coordinates: {e}")
    return []

async def createEventService(data: EventCreate, images: List[Annotated[UploadFile,File()]], userId: str, background_tasks: BackgroundTasks):
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
    
    # Obtener coordenadas
    city = event_data.get("location", {}).get("city", "")
    province = event_data.get("location", {}).get("province", "")
    coords = await get_coordinates(city, province)
    if coords:
        event_data["location"]["coordinates"] = coords
    
    event_data["_id"]= event_id_obj
    event_data["creator_id"]= userId
    event_data['images']= images_data
    
    print(event_data);
    doc = await events_collection.insert_one(event_data)
    
    background_tasks.add_task(
        createEventNotificationService,
        event_data = event_data,
        user_data = check_exist
        
    )
    
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
    
    
async def getEventsByUserService (creator_id: str):
    check_user_exist = await user_collection.find_one({"_id":bson.ObjectId(creator_id)})
    if not check_user_exist:
        raise HTTPException(status_code=404, detail="user not found")
    
    events = events_collection.find({"creator_id":creator_id})
    events_docs = await events.to_list(length=None)
    
    from config.db import tickets_collection
    for doc in events_docs:
        event_id_str = str(doc["_id"])
        doc["accepted_users"] = await tickets_collection.count_documents({"event_id": event_id_str, "status": "accepted"})
        doc["pending_users"] = await tickets_collection.count_documents({"event_id": event_id_str, "status": "pending"})
        doc["purchased_tickets"] = await tickets_collection.count_documents({"event_id": event_id_str, "status": "paid"})
        
    return [EventResponse(**doc) for doc in events_docs]

async def getEventByIdService(event_id: str):
    if not bson.ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Identificador de evento no válido")
    
    event = await events_collection.find_one({"_id": bson.ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="El evento solicitado no existe")
        
    creator = await user_collection.find_one({"_id": bson.ObjectId(event.get("creator_id"))})
    creator_profile = await profile_collection.find_one({"user_id":event.get("creator_id")})
    
    event_data = dict(event)
    
    event_data["creator_data"] = {
        "creator_id": event.get("creator_id"),
        "name": creator.get("name") if creator else "Desconocido",
        "email": creator.get("email") if creator else "Sin email",
        "avatar": creator_profile.get("avatar", {}).get("image_uri") if creator_profile and creator_profile.get("avatar") else None
    }
    
    return EventResponse(**event_data)
    
async def deleteEventService(id: str, userId, background_tasks: BackgroundTasks):
    if not bson.ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Identificador del evento no válido")
    
    event = await events_collection.find_one({"_id":bson.ObjectId(id)})
    if not event:
        raise HTTPException(status_code=404, detail="El Evento no existe")
    
    if str(event.get("creator_id")) != str(userId):
        raise HTTPException(status_code=403, detail="No tiene permisos para borrar este evento")
        
    # Notify ticket holders before deleting event/tickets
    from config.db import tickets_collection
    cursor = tickets_collection.find({"event_id": id})
    tickets = await cursor.to_list(length=None)
    for t in tickets:
        user = await user_collection.find_one({"_id": bson.ObjectId(t["user_id"])})
        if user and user.get("email"):
            background_tasks.add_task(
                sendEventCanceledNotificationService,
                email=user["email"],
                username=user.get("name", "Usuario"),
                event_title=event.get("title", "Evento")
            )
            
    # Delete tickets
    await tickets_collection.delete_many({"event_id": id})

    # Borrar fotos del servidor de Cloudinary
    images = event.get("images", [])
    for img in images:
        public_id = img.get("public_id")
        if public_id:
            try:
                cloudinary.uploader.destroy(public_id)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al eliminar la imagen del evento en Cloudinary: {str(e)}")
    
    try:
        result = await events_collection.delete_one({"_id": bson.ObjectId(id)})
        return {
            "msg":"Borrado con exito de evento",
            "status":"success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500,detail="Event Deletion error:"+f"{e}")
    

async def getPendingEventsService(adminUserId: str, page: int = 1, limit: int = 5):
    # Verificar si el usuario es administrador
    admin_user = await user_collection.find_one({"_id": bson.ObjectId(adminUserId)})
    if not admin_user or admin_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="No tiene permisos de administrador")
        
    skip = (page - 1) * limit
    cursor = events_collection.find({"status": "pending"}).skip(skip).limit(limit)
    events_docs = await cursor.to_list(length=None)
    
    total_events = await events_collection.count_documents({"status": "pending"})
    total_pages = (total_events + limit - 1) // limit
    
    events_list = []
    for doc in events_docs:
        doc["id"] = str(doc["_id"])
        events_list.append(EventResponse(**doc))
        
    return {
        "events": events_list,
        "total_events": total_events,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }

async def getEventManagementDetailService(event_id: str, adminUserId: str):
    # Verificar si el usuario es administrador
    admin_user = await user_collection.find_one({"_id": bson.ObjectId(adminUserId)})
    if not admin_user or admin_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="No tiene permisos de administrador")
        
    if not bson.ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Identificador de evento no válido")
        
    event = await events_collection.find_one({"_id": bson.ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="El evento solicitado no existe")
        
    creator = await user_collection.find_one({"_id": bson.ObjectId(event.get("creator_id"))})
    creator_profile = await profile_collection.find_one({"user_id": event.get("creator_id")})
    
    event_data = dict(event)
    event_data["id"] = str(event_data["_id"])
    del event_data["_id"]
    
    event_data["creator_data"] = {
        "name": creator.get("name") if creator else "Desconocido",
        "email": creator.get("email") if creator else "Sin email",
        "avatar": creator_profile.get("avatar", {}).get("image_uri") if creator_profile and creator_profile.get("avatar") else None
    }
    return event_data

async def approveEventService(event_id: str, adminUserId: str, background_tasks: BackgroundTasks):
    # Verificar si el usuario es administrador
    admin_user = await user_collection.find_one({"_id": bson.ObjectId(adminUserId)})
    if not admin_user or admin_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="No tiene permisos de administrador")
        
    if not bson.ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Identificador de evento no válido")
        
    event = await events_collection.find_one({"_id": bson.ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="El Evento no existe")
        
    creator = await user_collection.find_one({"_id": bson.ObjectId(event.get("creator_id"))})
    if not creator:
        raise HTTPException(status_code=404, detail="No se encontró el usuario creador del evento")
       
    result = await events_collection.update_one(
        {"_id": bson.ObjectId(event_id)},
        {"$set": {"status": "accepted"}}
    )
    
    if result.modified_count == 0:
        check_exist = await events_collection.find_one({"_id": bson.ObjectId(event_id)})
        if not check_exist:
            raise HTTPException(status_code=404, detail="El Evento no existe")
    
    background_tasks.add_task(
        sendEventApprovalNotificationService,
        email=creator["email"],
        username=creator.get("name", "Usuario"),
        event_title=event.get("title", "Sin título"),
    )
    
    return {
        "msg": "Evento aprobado con éxito",
        "status": "success"
    }

async def denyEventService(event_id: str, justification: str, adminUserId: str, background_tasks: BackgroundTasks):
    # Verificar si el usuario es administrador
    admin_user = await user_collection.find_one({"_id": bson.ObjectId(adminUserId)})
    if not admin_user or admin_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="No tiene permisos de administrador")
        
    if not justification or not justification.strip():
        raise HTTPException(status_code=400, detail="El texto de justificación es obligatorio para denegar un evento")
        
    if not bson.ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Identificador de evento no válido")
        
    event = await events_collection.find_one({"_id": bson.ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="El Evento no existe")
        
    creator = await user_collection.find_one({"_id": bson.ObjectId(event.get("creator_id"))})
    if not creator:
        raise HTTPException(status_code=404, detail="No se encontró el usuario creador del evento")
        
    background_tasks.add_task(
        sendEventDenialNotificationService,
        email=creator["email"],
        username=creator.get("name", "Usuario"),
        event_title=event.get("title", "Sin título"),
        justification=justification
    )
    
    # Eliminar imágenes de Cloudinary
    images = event.get("images", [])
    for img in images:
        public_id = img.get("public_id")
        if public_id:
            try:
                cloudinary.uploader.destroy(public_id)
            except Exception as e:
                pass
                
    # Eliminar evento de MongoDB
    await events_collection.delete_one({"_id": bson.ObjectId(event_id)})
    
    # Quitar evento de los eventos creados en el perfil
    await profile_collection.find_one_and_update(
        {"user_id": event.get("creator_id")},
        {"$pull": {"created_events": event_id}}
    )
    
    return {
        "msg": "Evento denegado con éxito y creador notificado",
        "status": "success"
    }
    

async def searchEventsService(lat: float = None, lng: float = None, radius_km: float = None, start_date: str = None, end_date: str = None, interests: str = None, city: str = None, province: str = None, page: int = 1, limit: int = 10):
    await events_collection.create_index([("location.coordinates", "2dsphere")])
    
    query = {"status": "accepted"}
    
    if lat is not None and lng is not None and radius_km is not None:
        query["location.coordinates"] = {
            "$geoWithin": {
                "$centerSphere": [
                    [lng, lat],
                    radius_km / 6378.1
                ]
            }
        }
        
    if city:
        query["location.city"] = {"$regex": city, "$options": "i"}
        
    if province:
        query["location.province"] = {"$regex": province, "$options": "i"}
    
    if interests:
        interests_list = interests.split(",")
        query["interests"] = {"$in": interests_list}
        
    if start_date or end_date:
        date_query = {}
        if start_date:
            date_query["$gte"] = start_date # Assuming ISO datetime string format
        if end_date:
            date_query["$lte"] = end_date
        query["starting_event_date"] = date_query
        
    total_events = await events_collection.count_documents(query)
    total_pages = (total_events + limit - 1) // limit
    skip = (page - 1) * limit
    
    cursor = events_collection.find(query).skip(skip).limit(limit)
    events_docs = await cursor.to_list(length=None)
    
    # Convert ObjectIds to strings
    events_list = []
    for doc in events_docs:
        doc["id"] = str(doc["_id"])
        events_list.append(EventResponse(**doc))
        
    return {
        "events": events_list,
        "total_events": total_events,
        "page": page,
        "limit": limit,
        "total_pages": total_pages
    }

async def messageGuestsService(event_id: str, message_text: str, userId: str, background_tasks: BackgroundTasks):
    if not bson.ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Identificador de evento no válido")
    
    event = await events_collection.find_one({"_id": bson.ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="El evento no existe")
        
    if str(event.get("creator_id")) != str(userId):
        raise HTTPException(status_code=403, detail="No tiene permisos para enviar mensajes a los invitados de este evento")
        
    if not message_text or not message_text.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")
        
    # Word count validation: max 500 words
    word_count = len(message_text.strip().split())
    if word_count > 500:
        raise HTTPException(status_code=400, detail="El mensaje no puede exceder las 500 palabras")
        
    ticket_price = event.get("ticket_price")
    is_paid_event = ticket_price is not None and ticket_price > 0
    target_status = "paid" if is_paid_event else "accepted"
    
    from config.db import tickets_collection
    cursor = tickets_collection.find({"event_id": event_id, "status": target_status})
    tickets = await cursor.to_list(length=None)
    
    if not tickets:
        return {
            "msg": "No hay invitados registrados para recibir este mensaje",
            "status": "success",
            "count": 0
        }
        
    from services.mailService import sendEventUpdateNotificationService
    
    sent_count = 0
    for t in tickets:
        user = await user_collection.find_one({"_id": bson.ObjectId(t["user_id"])})
        if user and user.get("email"):
            background_tasks.add_task(
                sendEventUpdateNotificationService,
                email=user["email"],
                username=user.get("name", "Usuario"),
                event_title=event.get("title", "Evento"),
                message_text=message_text
            )
            sent_count += 1
            
    return {
        "msg": f"Mensaje enviado con éxito a {sent_count} invitados",
        "status": "success",
        "count": sent_count
    }
    