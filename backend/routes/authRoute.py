from fastapi import APIRouter, BackgroundTasks, Depends, File, Request, UploadFile
from controllers import authController
from controllers.authController import loginController, registerController, updateDetailsController
from typing import Annotated, Any 
from models.authModel import LoginUser, RegisterUser, UpdateDetails
from config.db import user_collection
from middleware.VerifyToken import verifyToken


router = APIRouter(prefix="/api/v1/auth", tags=['auth'])

#register
@router.post("/register")
async def registerView(data: RegisterUser, background_tasks: BackgroundTasks):
    return await authController.registerController(data,background_tasks)

#login
@router.post("/login")
async def loginView(data: LoginUser,  background_tasks: BackgroundTasks):
    return await authController.loginController(data, background_tasks)

#verificacion 2FA
@router.post("/verify-2fa")
async def verify2FAview(data: dict):
    return await authController.verify2FAController(data["email"],data["code"])

#login con Google
@router.post("/google-login")
async def googleLoginView(data: dict, background_tasks: BackgroundTasks):
    return await authController.googleLoginController(data["token"], background_tasks)

#profile details
@router.get("/profile")
async def profileView(userId = Depends(verifyToken)):
    return await authController.profileController(userId)

#avatar update
@router.put("/update-avatar")
async def updateAvatar(avatar: Annotated[UploadFile,File()], userId = Depends(verifyToken)):
    return await authController.updateAvatarController(avatar, userId)

#details update
@router.put("/update-details")
async def updateDetails(data:UpdateDetails, userId = Depends(verifyToken)):
    return await authController.updateDetailsController(data,userId)

@router.get("/public-profile/{id}")
async def getPublicProfileDetails(id: str):
    return await authController.getPublicProfileController(id)