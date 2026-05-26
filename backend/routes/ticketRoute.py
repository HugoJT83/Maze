from fastapi import APIRouter, Depends
from controllers import ticketController
from middleware.VerifyToken import verifyToken
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/tickets", tags=['tickets'])

class StatusUpdate(BaseModel):
    status: str

@router.post("/request/{event_id}")
async def request_free_ticket(event_id: str, userId=Depends(verifyToken)):
    return await ticketController.requestFreeTicketController(event_id, userId)

@router.get("/event/{event_id}")
async def get_tickets_for_event(event_id: str, userId=Depends(verifyToken)):
    return await ticketController.getTicketsForEventController(event_id, userId)

@router.put("/{ticket_id}/status")
async def update_ticket_status(ticket_id: str, data: StatusUpdate, userId=Depends(verifyToken)):
    return await ticketController.updateTicketStatusController(ticket_id, data.status, userId)

@router.get("/my-ticket/{event_id}")
async def get_user_ticket(event_id: str, userId=Depends(verifyToken)):
    return await ticketController.getUserTicketController(event_id, userId)
