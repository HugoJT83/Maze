import secrets
from typing import Annotated

import bson
import cloudinary
import cloudinary.uploader
import config.CloudinaryConfig
from fastapi import BackgroundTasks, File, UploadFile

from config import db
from config.db import user_collection, profile_collection
from models import authModel
from models.authModel import RegisterUser, LoginUser, UpdateDetails
from fastapi.exceptions import HTTPException
import bcrypt
import jwt
from datetime import datetime, timedelta
from config.env import ENVConfig
from services.mailService import createAccountNotificationService, send2FACodeNotificationService

from google.oauth2 import id_token
from google.auth.transport import requests

async def registerService(data:RegisterUser, background_tasks: BackgroundTasks):
    
    """ Comprueba si ya existe el usuario """
    check_exist = await user_collection.find_one({"email":data.email.lower()})
    
    if check_exist:
        if check_exist.get("auth_method") == "google":
            raise HTTPException(status_code=400, detail="Esta cuenta ya está registrada con Google. Por favor, inicia sesión con Google.")
        raise HTTPException(status_code=400,detail="User already exists")
    
    """ Encriptacion de la contraseña """
    salt = bcrypt.gensalt()
    # print(salt)
    hash_string = bcrypt.hashpw(data.password.encode(),salt).decode()
    user_data = data.model_dump()
    user_data['password']=hash_string
    
    """ Insercion en la BD del usuario """
    user_data['email'] = data.email.lower()
    doc = await user_collection.insert_one(user_data)
    
    #profile
    
    """ Se crea una instancia de perfil de usuario con el id de usuario guardado en user_id """
    user_p = authModel.UserProfile(user_id=str(doc.inserted_id), name=data.name)
    
    """ Inserción del perfil en la colección de perfiles """
    await profile_collection.insert_one(user_p.dict())
    
    background_tasks.add_task(
        createAccountNotificationService,
        user_data = user_data
    )
    
    """ Se genera un token de almacenamiento local con el id de usuario """
    # token
    token = jwt.encode({
        "user_id":str(doc.inserted_id),
        "exp": datetime.utcnow()+timedelta(days=10),
        'iat':datetime.utcnow()
    }, ENVConfig.JWT_AUTH_SCREATE,algorithm="HS256")
    
    return {
        "msg":"Register Success",
        "token":token
    }
    
async def loginService(data: LoginUser, background_tasks: BackgroundTasks):
    check_exist = await user_collection.find_one({"email":data.email.lower()})
    
    if not check_exist:
        raise HTTPException(status_code=400,detail="User doesn't exist")
    
    if check_exist.get("auth_method") == "google" or not check_exist.get("password"):
        raise HTTPException(status_code=400, detail="Esta cuenta está registrada con Google. Por favor, inicia sesión con Google.")
     
    is_match = bcrypt.checkpw(data.password.encode(), check_exist['password'].encode())
    if not is_match:
        raise HTTPException(status_code=400, detail="Invalid Credentials")
     
    if check_exist.get("role") == "ADMIN":
        otp_code = "".join(secrets.choice("0123456789") for _ in range(6))
        expiration = datetime.utcnow() + timedelta(minutes = 2)
        
        await user_collection.update_one(
            {"_id" : check_exist["_id"]},
            {"$set": {
                "two_factor_code": otp_code,
                "two_factor_expires": expiration
            }}
        )
        
        background_tasks.add_task(
            send2FACodeNotificationService,
            check_exist["email"],
            otp_code
        )
        
        return {
            "status":"2FA_REQUIRED",
            "msg": "Verification code sent to email",
            "email": check_exist["email"]
        }
        
    token = jwt.encode({
        "user_id":str(check_exist['_id']),
        "exp": datetime.utcnow()+timedelta(days=10),
        'iat':datetime.utcnow()
    }, ENVConfig.JWT_AUTH_SCREATE,algorithm="HS256")
    
    return {
        "msg":"Successful login",
        "token": token
    }
    
async def verify2FAService (email:str, code: str):
    
    check_exist = await user_collection.find_one({"email":email.lower()})
    
    if not check_exist or "two_factor_code" not in check_exist:
        raise HTTPException(status_code=400,detail="User doesn't exist or no 2FA process found")
    
    if check_exist["two_factor_code"] != code:
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if datetime.utcnow() > check_exist["two_factor_expires"]:
        raise HTTPException(status_code=400, detail="Code expired")
    
    userId = check_exist["_id"];
    
    await user_collection.update_one(
        {"_id": bson.ObjectId(userId)},
        {"$unset": {
            "two_factor_code": "",
             "two_factor_expires":""
            
        }}
    )
    
    token = jwt.encode({
        "user_id":str(check_exist['_id']),
        "exp": datetime.utcnow()+timedelta(days=10),
        'iat':datetime.utcnow()
    }, ENVConfig.JWT_AUTH_SCREATE,algorithm="HS256")
    
    return {
        "msg":"2FA verified",
        "token": token
    }
    
async def googleLoginService(token: str, background_tasks: BackgroundTasks):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            ENVConfig.GOOGLEAUTH_CLIENT
        )
        
        email = idinfo["email"].lower();      
        check_exist = await user_collection.find_one({"email":email})
        print(check_exist)
        #Crea un usuario si no existe
        if not check_exist:
            new_user_data =  authModel.User(
                name=idinfo.get('name',email.split('@')[0]),
                email=email,
                auth_method="google",
                role="USER"
            )
            dict_user_data = new_user_data.dict()
            
            doc = await user_collection.insert_one(dict_user_data)
            user_id = str(doc.inserted_id)
            user_avatar = idinfo.get("picture","")


            if not user_avatar or "profile/picture/0" in user_avatar:
                avatar_uri = None
            else:
                avatar_uri = user_avatar
                
            avatar_data = {"image_uri": avatar_uri, "public_id": None} if avatar_uri else None
            
            user_p = authModel.UserProfile(
                user_id=user_id,
                name=dict_user_data["name"],
                avatar=avatar_data
            )
            
            await profile_collection.insert_one(user_p.dict())
            
            background_tasks.add_task(
                createAccountNotificationService,
                user_data = dict_user_data
            )
        else:
            user_id = str(check_exist.get("_id"))
            
        token = jwt.encode({
            "user_id":user_id,
            "exp": datetime.utcnow()+timedelta(days=10),
            'iat':datetime.utcnow()
        }, ENVConfig.JWT_AUTH_SCREATE,algorithm="HS256")
        
        return {
            "msg": "Successful Google Login",
            "token": token
        }
    except Exception as e:
        if isinstance(e,ValueError):
            raise HTTPException(status_code=401, detail="Invalid Google Token")
        else:
            raise HTTPException(status_code=400, detail=str(e))
    
    

async def profileService(userId: str):
    """ Comprueba que existe el usuario """
    check_exist = await user_collection.find_one({"_id":bson.ObjectId(userId)},{
        "password":0
    })
    if not check_exist:
        raise HTTPException(status_code=404,detail="User Details not Found")
    
    """ Busca si existe un perfil de usuario """
    check_exist['_id'] = str(check_exist['_id'])
    profile = await profile_collection.find_one({"user_id":check_exist['_id']})
    
    if not profile:
        raise HTTPException(status_code=404,detail="Profile not found")
    
    del profile['_id']
    del profile['user_id']
    
    if profile.get('avatar') and 'image_uri' in profile['avatar']:
        profile['avatar'] = profile['avatar']['image_uri']
    else:
        profile['avatar'] = None
        
    merged = check_exist | profile
    if check_exist.get("stripe_account_id"):
        merged["stripe_account_id"] = check_exist["stripe_account_id"]
        
    return merged

async def updateAvatarService(avatar: Annotated[UploadFile,File()], userId: str):
    exist = await profile_collection.find_one({"user_id":userId})
    
    if exist and exist.get('avatar') and exist['avatar'].get('public_id'):
        try:
            cloudinary.uploader.destroy(exist['avatar']['public_id'])
        except Exception as e:
            raise HTTPException(status_code=404,detail="Profile Avatar Update Error")
    
    
    contents = await avatar.read()
    
    upload_result = cloudinary.uploader.upload(
        contents,
        folder="events_user_profile",
        resource_type="image")
    
    await profile_collection.find_one_and_update(
        {"user_id":userId},
        {
            "$set":{
                "avatar":{
                    "image_uri":upload_result['secure_url'],
                    "public_id":upload_result['public_id']
                },
                "update_at":datetime.now()
            }
        }
    )
    return {
        "msg":"Profile Updated Success",
    }
    
async def UpdateDetailsService(data: UpdateDetails, userId:str):
    
    check_exist = await profile_collection.find_one_and_update({"user_id":userId},{
        "$set":{
            "name":data.name,
            "description":data.description,
            "interests": data.interests,
            "address":data.address.dict() if data.address else None,
            "update_at":datetime.now()
        }
    })
    if not check_exist:
        raise HTTPException(status_code=404,detail="User Details not Found")
    
    return{
        "msg":"Details Update Success"

    }
    
async def getPublicProfileService(userId:str):
    if not bson.ObjectId.is_valid(userId):
        raise HTTPException(status_code=400, detail="Identificador de usuario no válido")
    
    user = await user_collection.find_one(
        {"_id": bson.ObjectId(userId)},
        {"name": 1}
    )
    
    if not user:
        raise HTTPException(status_code=404, detail="El usuario no existe")
        
    # 2. Obtener los detalles del perfil público
    profile = await profile_collection.find_one({"user_id": userId})
    if not profile:
        raise HTTPException(status_code=404, detail="Perfil no encontrado")
    
    avatar_uri = None
    if profile.get('avatar') and 'image_uri' in profile['avatar']:
        avatar_uri = profile['avatar']['image_uri']
    
    profile_data = {
        "id": str(user["_id"]),
        "name": profile.get("name", user.get("name")),
        "description": profile.get("description", "Sin descripción disponible."),
        "address": profile.get("address", "Sin ubicacion disponible"),
        "interests": profile.get("interests", []),
        "avatar": avatar_uri,
        "created_events": profile.get("created_events", [])
    }
    
    return profile_data