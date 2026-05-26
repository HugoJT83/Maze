from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime

from config.db import tickets_collection, events_collection, user_collection
from models.ticketModel import TicketCreate, TicketStatus, TicketType
from services.mailService import sendTicketApprovedNotificationService

async def request_free_ticket(event_id: str, user_id: str):
    # Verify event exists
    event = await events_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
        
    # Check if the user already requested a ticket
    existing_ticket = await tickets_collection.find_one({
        "event_id": event_id,
        "user_id": user_id
    })
    
    if existing_ticket:
        raise HTTPException(status_code=400, detail="Ya tienes una solicitud para este evento")
        
    # Create new ticket
    new_ticket = {
        "event_id": event_id,
        "user_id": user_id,
        "status": TicketStatus.pending.value,
        "ticket_type": TicketType.free.value,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    result = await tickets_collection.insert_one(new_ticket)
    return {"message": "Solicitud enviada correctamente", "ticket_id": str(result.inserted_id)}


async def get_tickets_for_event(event_id: str, user_id: str):
    # Verify the user is the creator of the event
    event = await events_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
        
    if event.get("creator_id") != user_id:
        raise HTTPException(status_code=403, detail="No tienes permisos para ver los tickets de este evento")
        
    cursor = tickets_collection.find({"event_id": event_id})
    tickets = await cursor.to_list(length=1000)
    
    # Attach user details
    enriched_tickets = []
    for t in tickets:
        user = await user_collection.find_one({"_id": ObjectId(t["user_id"])})
        
        t_data = {
            "id": str(t["_id"]),
            "event_id": t["event_id"],
            "user_id": t["user_id"],
            "status": t["status"],
            "ticket_type": t["ticket_type"],
            "qr_code": t.get("qr_code"),
            "stripe_session_id": t.get("stripe_session_id"),
            "created_at": t["created_at"],
            "updated_at": t["updated_at"],
            "user_name": user.get("name") if user else "Usuario Desconocido",
            "user_email": user.get("email") if user else "Desconocido"
        }
        enriched_tickets.append(t_data)
        
    return {"tickets": enriched_tickets}

async def update_ticket_status(ticket_id: str, status: str, user_id: str):
    ticket = await tickets_collection.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
        
    event = await events_collection.find_one({"_id": ObjectId(ticket["event_id"])})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
        
    if event.get("creator_id") != user_id:
        raise HTTPException(status_code=403, detail="No tienes permisos para modificar este ticket")
        
    # Update status
    await tickets_collection.update_one(
        {"_id": ObjectId(ticket_id)},
        {"$set": {"status": status, "updated_at": datetime.now()}}
    )
    
    if status == "accepted":
        ticket_user = await user_collection.find_one({"_id": ObjectId(ticket["user_id"])})
        if ticket_user and "email" in ticket_user:
            try:
                await sendTicketApprovedNotificationService(
                    email=ticket_user["email"],
                    username=ticket_user.get("name", "Usuario"),
                    event_title=event.get("title", "Evento"),
                    ticket_type="free"
                )
            except Exception as e:
                print(f"Error sending approval email: {e}")
    
    return {"message": "Estado actualizado", "status": status}

    
async def get_user_ticket(event_id: str, user_id: str):
    ticket = await tickets_collection.find_one({
        "event_id": event_id,
        "user_id": user_id
    })
    
    if not ticket:
        return {"has_ticket": False}
        
    return {
        "has_ticket": True,
        "status": ticket["status"],
        "ticket_type": ticket["ticket_type"],
        "id": str(ticket["_id"])
    }
