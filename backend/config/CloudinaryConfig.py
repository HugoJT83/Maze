import cloudinary
import cloudinary.uploader
from config.env import ENVConfig


# Configurar el SDK de Cloudinary.
if ENVConfig.CLOUDINARY_URL:
    # Si CLOUDINARY_URL está disponible y es correcto, se autoconfigura con este
    cloudinary.config(
        cloudinary_url=ENVConfig.CLOUDINARY_URL
    )
else:
    # De lo contrario, se configuran las credenciales individuales
    cloudinary.config(
        cloud_name=ENVConfig.CLOUD_NAME_CLOUDINARY, 
        api_key=ENVConfig.API_KEY_CLOUDINARY,
        api_secret=ENVConfig.API_SECRET_CLOUDINARY
    )