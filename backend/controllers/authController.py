from fastapi import BackgroundTasks, HTTPException

from services import authService
from services.authService import loginService, registerService
from models.authModel import LoginUser, RegisterUser

async def registerController(data: RegisterUser, background_tasks: BackgroundTasks):
        res_obj = await registerService(data,background_tasks)
        return res_obj
    

async def loginController(data: LoginUser,  background_tasks: BackgroundTasks):    
        res_obj = await loginService(data, background_tasks)
        return res_obj

async def verify2FAController(email:str, code:str):
        res_obj = await authService.verify2FAService(email,code)
        return res_obj

async def googleLoginController(token: str, background_tasks: BackgroundTasks):
        res_obj = await authService.googleLoginService( token, background_tasks)
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

async def getPublicProfileController(id):
        res_obj = await authService.getPublicProfileService(id)
        return res_obj