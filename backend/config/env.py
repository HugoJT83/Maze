from dotenv import load_dotenv
import os
load_dotenv()

class ENVConfig:
    
    MONGO_CONNECTION = os.getenv("MONGO_CONNECTION","")
    MONGO_DB = os.getenv("MONGO_DB","")
    MONGO_CLOUD_CONNECTION = os.getenv("MONGO_CLOUD_CONNECTION","")
    
    JWT_AUTH_SCREATE = os.getenv("JTW_AUTH_SCREATE","!)($!)($&)/·$&23894923()/·)($/8534875&((&/!!$!$/!$/!$/!))")
    ALGORITHMS = "HS256"
    
    API_KEY_CLOUDINARY=os.getenv("API_KEY_CLOUDINARY","")
    API_SECRET_CLOUDINARY=os.getenv("API_SECRET_CLOUDINARY","")
    CLOUDINARY_URL=os.getenv("CLOUDINARY_URL","")
    
    
    MAILMUG_USERNAME= os.getenv("MAILMUG_USERNAME","")
    MAILMUG_PASSWORD= os.getenv("MAILMUG_PASSWORD","")
    MAILMUG_HOST= os.getenv("MAILMUG_HOST","")
    MAILMUG_PORT = os.getenv("MAILMUG_PORT","")
    
    GMAIL_USERAME = os.getenv("GMAIL_USERNAME","")
    GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD","")
    GMAIL_FROM = os.getenv("GMAIL_FROM","")
    GMAIL_PORT = os.getenv("GMAIL_PORT","")