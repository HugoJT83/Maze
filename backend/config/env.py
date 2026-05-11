from dotenv import load_dotenv
import os
load_dotenv()

class ENVConfig:
    
    MONGO_CONNECTION = os.getenv("MONGO_CONNECTION","")
    MONGO_DB = os.getenv("MONGO_DB","")
    JWT_AUTH_SCREATE = os.getenv("JTW_AUTH_SCREATE","!)($!)($&)/·$&")
    ALGORITHMS = "HS256"
    API_KEY_CLOUDINARY=os.getenv("API_KEY_CLOUDINARY","")
    API_SECRET_CLOUDINARY=os.getenv("API_SECRET_CLOUDINARY","")
    CLOUDINARY_URL=os.getenv("CLOUDINARY_URL","")
    MONGO_CLOUD_CONNECTION = os.getenv("MONGO_CLOUD_CONNECTION","")