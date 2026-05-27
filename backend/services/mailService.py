from fastapi import HTTPException
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from config.env import ENVConfig

conf = ConnectionConfig(
    MAIL_USERNAME= ENVConfig.MAILMUG_USERNAME, 
    MAIL_PASSWORD= ENVConfig.MAILMUG_PASSWORD,
    MAIL_FROM= ENVConfig.GMAIL_FROM,
    MAIL_PORT= ENVConfig.MAILMUG_PORT,
    MAIL_SERVER= ENVConfig.MAILMUG_HOST,
    MAIL_SSL_TLS= False,
    MAIL_STARTTLS= True,
    USE_CREDENTIALS= True,
    TEMPLATE_FOLDER= './templates'
)

async def createEventNotificationService (event_data: dict, user_data: dict):
    message = MessageSchema(
        subject="MAZE - Evento Registrado",
        recipients=[user_data["email"]],
        template_body={
            "username":user_data.get("name", "Usuario"),
            "phone":event_data.get("phone", ""),
            "event_title":event_data.get("title", ""),
            "creation_date":event_data.get("creation_date").strftime("%y-%m-%d") if event_data.get("creation_date") else "",
            "starting_event_date":event_data.get("starting_event_date").strftime("%y-%m-%d") if event_data.get("starting_event_date") else "",
            "start_hour":event_data.get("start_hour", ""),
            "finish_hour":event_data.get("finish_hour", ""),
            "finish_event_date":event_data.get("finish_event_date").strftime("%y-%m-%d") if event_data.get("finish_event_date") else "",
            "province": event_data.get("location", {}).get("province", ""),
            "city": event_data.get("location", {}).get("city", ""),
            "direction": event_data.get("location", {}).get("direction", "")
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_created.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")

async def createAccountNotificationService (user_data: dict):
    message = MessageSchema(
        subject="MAZE - Usuario creado",
        recipients=[user_data["email"]],
        template_body={
            "username":user_data.get("name", "Usuario"),
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="account_created.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")
    
async def send2FACodeNotificationService (email: str, otp_code: str):
    message = MessageSchema(
        subject="MAZE - Verificación en dos pasos",
        recipients=[email],
        template_body={
            "email": email,
            "otp_code": otp_code
        },
        subtype= MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message,template_name="2fa_verification.html")
        
    except Exception as e:
        
        raise HTTPException(status_code=400, detail="Mail Error")

async def sendEventDenialNotificationService(email: str, username: str, event_title: str, justification: str):
    message = MessageSchema(
        subject="MAZE - Evento Rechazado",
        recipients=[email],
        template_body={
            "username": username,
            "event_title": event_title,
            "justification": justification
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_denied.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")
    
async def sendEventApprovalNotificationService(email: str, username: str, event_title: str):
   
    message = MessageSchema(
        subject="MAZE - Evento Aprobado",
        recipients=[email],
        template_body={
            "username": username,
            "event_title": event_title,
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_approved.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")
        
async def sendTicketApprovedNotificationService(email: str, username: str, event_title: str, ticket_type: str, ticket_validator: str = None, ticket_id: str = None):
    template = "ticket_approved_paid.html" if ticket_type == "paid" else "ticket_approved_free.html"
    body = {
        "username": username,
        "event_name": event_title
    }
    
    if ticket_type == "paid":
        body["ticket_id"] = ticket_id
        body["ticket_validator"] = ticket_validator
        
    message = MessageSchema(
        subject="MAZE - Entrada Confirmada",
        recipients=[email],
        template_body=body,
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name=template)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")

async def sendEventCanceledNotificationService(email: str, username: str, event_title: str):
    message = MessageSchema(
        subject="MAZE - Evento Cancelado",
        recipients=[email],
        template_body={
            "username": username,
            "event_name": event_title,
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_canceled.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")

async def sendTicketDeniedNotificationService(email: str, username: str, event_title: str):
    message = MessageSchema(
        subject="MAZE - Entrada Denegada",
        recipients=[email],
        template_body={
            "username": username,
            "event_name": event_title,
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="ticket_denied_free.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")

async def sendEventUpdateNotificationService(email: str, username: str, event_title: str, message_text: str):
    message = MessageSchema(
        subject="MAZE - Actualización del evento",
        recipients=[email],
        template_body={
            "username": username,
            "event_name": event_title,
            "event_update": message_text,
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_update.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")