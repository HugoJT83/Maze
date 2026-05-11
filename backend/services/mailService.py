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

async def createEventNotificationService (email:str, event_title:str, username: str):
    message = MessageSchema(
        subject="MAZE - Evento Registrado",
        recipients=[email],
        template_body={
            "user":username,
            "event_title":event_title,
            "status":"pending"
        },
        subtype=MessageType.html
    )
    try:
        fm = FastMail(conf)
        await fm.send_message(message, template_name="event_created.html")
        
    except Exception as e:
        
        raise HTTPException(status_code=400, detail="Mail Error")