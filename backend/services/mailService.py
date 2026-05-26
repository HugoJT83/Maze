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
    """ message = MessageSchema(
        subject="MAZE - Evento Registrado",
        recipients=[user_data["email"]],
        template_body={
            "username":user_data["name"],
            "phone":event_data["phone"],
            "event_title":event_data["title"],
            "creation_date":event_data["creation_date"].strftime("%y-%m-%d"),
            "starting_event_date":event_data["starting_event_date"].strftime("%y-%m-%d"),
            "start_hour":event_data["start_hour"],
            "finish_hour":event_data["finish_hour"],
            "finish_event_date":event_data["finish_event_date"].strftime("%y-%m-%d"),
            "province": event_data["location"]["province"],
            "city": event_data["location"]["city"],
            "direction": event_data["location"]["direction"]
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_created.html")
        
    except Exception as e:
        
        raise HTTPException(status_code=400, detail="Mail Error") """

async def createAccountNotificationService (user_data: dict):
    """ message = MessageSchema(
        subject="MAZE - Usuario creado",
        recipients=[user_data["email"]],
        template_body={
            "username":user_data["name"],
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="account_created.html")
        
    except Exception as e:
        
        raise HTTPException(status_code=400, detail="Mail Error") """
    
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
    """ message = MessageSchema(
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
        raise HTTPException(status_code=400, detail="Mail Error") """
    
async def sendEventApprovalNotificationService(email: str, username: str, event_title: str):
   
   """  message = MessageSchema(
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
        raise HTTPException(status_code=400, detail="Mail Error") """
        
async def sendTicketApprovedNotificationService(email: str, username: str, event_title: str, ticket_type: str, qr_code: str = None):
    message = MessageSchema(
        subject="MAZE - Entrada Confirmada",
        recipients=[email],
        template_body={
            "username": username,
            "event_title": event_title,
            "is_paid": True if ticket_type == "paid" else False,
            "qr_code": qr_code
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="ticket_approved.html")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Mail Error")