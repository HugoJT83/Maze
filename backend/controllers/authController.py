from fastapi import HTTPException

from services import authService
from services.authService import loginService, registerService
from models.authModel import LoginUser, RegisterUser

async def registerController(data: RegisterUser):
        res_obj = await registerService(data)
        return res_obj
    

async def loginController(data: LoginUser):    
        res_obj = await loginService(data)
        return res_obj

        
async def profileController(userId:str):
        res_obj = await authService.profileService(userId)
        return res_obj

async def updateAvatarController(avatar, userId):
        res_obj = await authService.updateAvatarService(avatar, userId)
        return res_obj

    
async def updateDetailsController(data,userId):
        res_obj = await authService.UpdateDetailsService(data, userId)
        return res_obj
