import pytest
from bson import ObjectId
from pydantic import ValidationError
from fastapi import BackgroundTasks, HTTPException
import bcrypt

from models.authModel import RegisterUser, UpdateDetails
from services.authService import registerService, UpdateDetailsService, updateAvatarService
from config.db import user_collection, profile_collection

pytestmark = pytest.mark.asyncio

async def test_user_registration_password_hashing():
    """Verifica que la contraseña no se guarde en texto plano durante el registro."""
    background_tasks = BackgroundTasks()
    
    register_data = RegisterUser(
        name="Jose Perez",
        email="jose@example.com",
        password="supersecretpassword",
        role="USER"
    )
    
    res = await registerService(register_data, background_tasks)
    
    # Assert successful registration
    assert res["msg"] == "Register Success"
    assert "token" in res
    
    # Retrieve user from database
    user = await user_collection.find_one({"email": "jose@example.com"})
    assert user is not None
    
    # Verify plain text password is NOT stored
    assert user["password"] != "supersecretpassword"
    
    # Verify password is encrypted with bcrypt
    is_match = bcrypt.checkpw("supersecretpassword".encode(), user["password"].encode())
    assert is_match is True

async def test_update_profile_interests_max_limit():
    """Valida que el servicio de actualización de perfil de usuario respete el límite de intereses."""
    user_id = str(ObjectId())
    
    # Setup profile
    profile_doc = {
        "user_id": user_id,
        "name": "Jose Perez",
        "interests": [],
        "created_events": [],
        "joined_events": []
    }
    await profile_collection.insert_one(profile_doc)
    
    # 1. Update with 4 interests (allowed)
    valid_details = UpdateDetails(
        name="Jose Modificado",
        description="Hola mundo",
        interests=["MUSICA", "JARDINERIA", "JUEGOS", "DEPORTE"],
        address={"province": "Madrid", "city": "Madrid"}
    )
    res = await UpdateDetailsService(valid_details, user_id)
    assert res["msg"] == "Details Update Success"
    
    updated_profile = await profile_collection.find_one({"user_id": user_id})
    assert len(updated_profile["interests"]) == 4
    
    # 2. Update with 5 interests (should raise ValidationError on Pydantic schema validation)
    with pytest.raises(ValidationError) as exc_info:
        UpdateDetails(
            name="Jose Modificado",
            description="Hola mundo",
            interests=["MUSICA", "JARDINERIA", "JUEGOS", "DEPORTE", "COCINA"],
            address={"province": "Madrid", "city": "Madrid"}
        )
    assert "No puedes seleccionar más de 4 intereses" in str(exc_info.value)

async def test_update_avatar_replaces_old_image():
    """Valida que se gestione correctamente la eliminación (public_id) del avatar viejo en Cloudinary."""
    user_id = str(ObjectId())
    
    # Setup profile with an existing avatar
    profile_doc = {
        "user_id": user_id,
        "name": "Avatar Test User",
        "avatar": {
            "image_uri": "https://res.cloudinary.com/demo/image/upload/old_avatar.jpg",
            "public_id": "demo_old_avatar_public_id"
        },
        "created_events": [],
        "joined_events": []
    }
    await profile_collection.insert_one(profile_doc)
    
    # Mock Cloudinary destroy and upload
    import cloudinary.uploader
    destroyed_public_ids = []
    
    original_destroy = cloudinary.uploader.destroy
    original_upload = cloudinary.uploader.upload
    
    try:
        cloudinary.uploader.destroy = lambda public_id, **kwargs: destroyed_public_ids.append(public_id)
        cloudinary.uploader.upload = lambda content, **kwargs: {
            "secure_url": "https://res.cloudinary.com/demo/image/upload/new_avatar.jpg",
            "public_id": "demo_new_avatar_public_id"
        }
        
        class MockFile:
            async def read(self):
                return b"fake-avatar"
                
        # Update avatar
        res = await updateAvatarService(MockFile(), user_id)
        assert res["msg"] == "Profile Updated Success"
        
        # Verify old avatar public_id was sent to Cloudinary destroy
        assert "demo_old_avatar_public_id" in destroyed_public_ids
        
        # Verify new avatar is saved in database
        updated_profile = await profile_collection.find_one({"user_id": user_id})
        assert updated_profile["avatar"]["image_uri"] == "https://res.cloudinary.com/demo/image/upload/new_avatar.jpg"
        assert updated_profile["avatar"]["public_id"] == "demo_new_avatar_public_id"
        
    finally:
        cloudinary.uploader.destroy = original_destroy
        cloudinary.uploader.upload = original_upload
