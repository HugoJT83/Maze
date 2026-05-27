from fastapi import HTTPException
from config.db import user_collection
from bson import ObjectId
import stripe
import os

from services import stripeService

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

async def createAccountLinkController(user_id: str):
    # Intentamos cargar de nuevo por si se cargó después
    res_obj = await stripeService.createAccountLinkService(user_id)
    return res_obj
    
async def createCheckoutSessionController(event_id: str, user_id: str):
    return await stripeService.createCheckoutSessionService(event_id, user_id)

async def stripeWebhookController(request, payload, sig_header):
    return await stripeService.stripeWebhookService(request, payload, sig_header)

