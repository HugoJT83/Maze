from fastapi import FastAPI
from routes.authRoute import router as AuthRouter
from routes.eventRoute import router as EventRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title = "Event Manager")


app.add_middleware(CORSMiddleware, 
    allow_headers=["*"],
    allow_methods=['GET','POST','PATCH','PUT','DELETE'],
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True)

#Routes
app.include_router(AuthRouter)
app.include_router(EventRouter)

@app.get('/')
def welcome():
    return {
        'message' : 'hola'
    }
