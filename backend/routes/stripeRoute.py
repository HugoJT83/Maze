from fastapi import APIRouter, Depends, Request, Header
from fastapi.responses import JSONResponse
from controllers import stripeController
from middleware.VerifyToken import verifyToken

router = APIRouter(prefix="/api/v1/stripe", tags=['stripe'])

@router.post("/create-account-link")
async def createAccountLinkView(userId = Depends(verifyToken)):
    return await stripeController.createAccountLinkController(userId)

@router.post("/create-checkout-session/{event_id}")
async def createCheckoutSessionView(event_id: str, userId = Depends(verifyToken)):
    return await stripeController.createCheckoutSessionController(event_id, userId)

@router.post("/webhook")
async def stripeWebhookView(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    return await stripeController.stripeWebhookController(request, payload, stripe_signature)
