from dotenv import load_dotenv
import os
load_dotenv()

# Evitar que el SDK de Cloudinary falle si CLOUDINARY_URL no tiene el esquema de URL esperado o está vacío.
_cloudinary_url_val = os.getenv("CLOUDINARY_URL", "").strip()
if not _cloudinary_url_val.startswith("cloudinary://"):
    if "CLOUDINARY_URL" in os.environ:
        del os.environ["CLOUDINARY_URL"]
    _cloudinary_url_val = ""

class ENVConfig:
    
    MONGO_CONNECTION = os.getenv("MONGO_CONNECTION","")
    MONGO_DB = os.getenv("MONGO_DB","")
    MONGO_CLOUD_CONNECTION = os.getenv("MONGO_CLOUD_CONNECTION","")
    
    JWT_AUTH_SCREATE = os.getenv("JWT_AUTH_SCREATE", os.getenv("JTW_AUTH_SCREATE", "!)($!)($&)/·$&23894923()/·)($/8534875&((&/!!$!$/!$/!$/!))"))
    ALGORITHMS = "HS256"
    
    API_KEY_CLOUDINARY=os.getenv("API_KEY_CLOUDINARY","")
    API_SECRET_CLOUDINARY=os.getenv("API_SECRET_CLOUDINARY","")
    CLOUDINARY_URL=_cloudinary_url_val
    
    
    MAILMUG_USERNAME= os.getenv("MAILMUG_USERNAME","")
    MAILMUG_PASSWORD= os.getenv("MAILMUG_PASSWORD","")
    MAILMUG_HOST= os.getenv("MAILMUG_HOST","")
    
    _mailmug_port_env = os.getenv("MAILMUG_PORT", "").strip()
    MAILMUG_PORT = int(_mailmug_port_env) if _mailmug_port_env.isdigit() else 2525
    
    GMAIL_USERAME = os.getenv("GMAIL_USERNAME","")
    GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD","")
    GMAIL_FROM = os.getenv("GMAIL_FROM","")
    
    _gmail_port_env = os.getenv("GMAIL_PORT", "").strip()
    GMAIL_PORT = int(_gmail_port_env) if _gmail_port_env.isdigit() else 587
    
    GOOGLEAUTH_CLIENT=os.getenv("GOOGLEAUTH_CLIENT","")
    
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")