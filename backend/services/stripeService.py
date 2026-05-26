from fastapi import HTTPException
from config.db import user_collection
from bson import ObjectId
import stripe
import os
import uuid
from datetime import datetime

from config.db import user_collection, events_collection, tickets_collection
from models.ticketModel import TicketStatus, TicketType
from services.mailService import sendTicketApprovedNotificationService

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

async def createAccountLinkService(user_id:str):
    
    if not stripe.api_key:
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        
    if not stripe.api_key:
        raise HTTPException(status_code=500, detail="Stripe API key no configurada en el backend.")

    # 1. Obtener usuario de la BD
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    stripe_account_id = user.get("stripe_account_id")

    try:
        # 2. Si el usuario no tiene una cuenta de stripe, la creamos
        if not stripe_account_id:
            account = stripe.Account.create(
                type="express",
                country="ES",
                email=user.get("email"),
                capabilities={
                    "card_payments": {"requested": True},
                    "transfers": {"requested": True},
                },
            )
            stripe_account_id = account.id
            
            # Guardamos el id en base de datos
            await user_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"stripe_account_id": stripe_account_id}}
            )

        # 3. Generamos el Account Link para redirigir al Onboarding
        base_url = "http://localhost:5173"
        
        account_link = stripe.AccountLink.create(
            account=stripe_account_id,
            refresh_url=f"{base_url}/profile",
            return_url=f"{base_url}/profile",
            type="account_onboarding",
        )

        return {"url": account_link.url}

    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def createCheckoutSessionService(event_id: str, user_id: str):
    # 1. Verify user and event
    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    event = await events_collection.find_one({"_id": ObjectId(event_id)})
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
        
    if event.get("ticket_price", 0) <= 0:
        raise HTTPException(status_code=400, detail="El evento es gratuito, usa la ruta normal de solicitud")
        
    # Check if user already has a pending or paid ticket
    existing_ticket = await tickets_collection.find_one({
        "event_id": event_id,
        "user_id": user_id,
        "status": {"$in": ["pending", "paid"]}
    })
    
    if existing_ticket and existing_ticket["status"] == "paid":
        raise HTTPException(status_code=400, detail="Ya tienes una entrada comprada para este evento")
        
    creator = await user_collection.find_one({"_id": ObjectId(event["creator_id"])})
    if not creator or not creator.get("stripe_account_id"):
        raise HTTPException(status_code=400, detail="El creador del evento no tiene configurada la cuenta de pagos")
        
    creator_stripe_account = creator["stripe_account_id"]
    
    base_url = "http://localhost:5173"
    
    try:
        # 2. Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': event["title"],
                        'description': event.get("description", "Entrada para el evento"),
                    },
                    'unit_amount': int(event["ticket_price"] * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            payment_intent_data={
                'application_fee_amount': int(event["ticket_price"] * 100 * 0.1), # 10% de comisión por ejemplo
                'transfer_data': {
                    'destination': creator_stripe_account,
                },
            },
            success_url=f"{base_url}/my-events?success=true",
            cancel_url=f"{base_url}/events/{event_id}?canceled=true",
            customer_email=user["email"],
            metadata={
                "event_id": event_id,
                "user_id": user_id
            }
        )
        
        # 3. Create a pending ticket tracking the checkout session
        if existing_ticket:
            await tickets_collection.update_one(
                {"_id": existing_ticket["_id"]},
                {"$set": {"stripe_session_id": session.id, "updated_at": datetime.now()}}
            )
        else:
            new_ticket = {
                "event_id": event_id,
                "user_id": user_id,
                "status": TicketStatus.pending.value,
                "ticket_type": TicketType.paid.value,
                "stripe_session_id": session.id,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            await tickets_collection.insert_one(new_ticket)
            
        return {"checkout_url": session.url}
        
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
async def stripeWebhookService(request, payload, sig_header):
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")
        
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Retrieve metadata
        event_id = session.get('metadata', {}).get('event_id')
        user_id = session.get('metadata', {}).get('user_id')
        
        if event_id and user_id:
            # Generate unique QR code UUID
            qr_code = str(uuid.uuid4())
            
            # Update the ticket
            await tickets_collection.update_one(
                {"stripe_session_id": session.id},
                {"$set": {
                    "status": TicketStatus.paid.value,
                    "qr_code": qr_code,
                    "payment_intent_id": session.payment_intent,
                    "updated_at": datetime.now()
                }}
            )
            
            # Send Email with QR
            ticket_user = await user_collection.find_one({"_id": ObjectId(user_id)})
            event_data = await events_collection.find_one({"_id": ObjectId(event_id)})
            
            if ticket_user and event_data:
                try:
                    await sendTicketApprovedNotificationService(
                        email=ticket_user["email"],
                        username=ticket_user.get("name", "Usuario"),
                        event_title=event_data.get("title", "Evento"),
                        ticket_type="paid",
                        qr_code=qr_code
                    )
                except Exception as e:
                    print(f"Error sending QR email: {e}")
                    
    return {"status": "success"}