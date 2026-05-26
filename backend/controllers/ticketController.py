from services import ticketService

async def requestFreeTicketController(event_id: str, user_id: str):
    return await ticketService.request_free_ticket(event_id, user_id)

async def getTicketsForEventController(event_id: str, user_id: str):
    return await ticketService.get_tickets_for_event(event_id, user_id)

async def updateTicketStatusController(ticket_id: str, status: str, user_id: str):
    return await ticketService.update_ticket_status(ticket_id, status, user_id)
    
async def getUserTicketController(event_id: str, user_id: str):
    return await ticketService.get_user_ticket(event_id, user_id)
