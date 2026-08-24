from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from rich.panel import Panel
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.include_apis import include_apis
from app.core.logger import console
from app.exceptions.exception_handler import exception_handler
from app.middlewares.LoggingMiddleware import LoggingMiddleware


# Startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    console.print(
        Panel(
            "[bold green]🚀  Server is running[/]\n[dim]All systems operational[/]",
            border_style="green",
            expand=False,
        )
    )
    yield
    console.print(
        Panel(
            "[bold red]🛑  Server stopped[/]",
            border_style="red",
            expand=False,
        )
    )


app = FastAPI(title="The Mummy Sweets", lifespan=lifespan)

# Middlwares
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET)
# Def to handle the exception
exception_handler(app)
include_apis(app)  # api routers


# Test
@app.get("/")
async def default():
    return {"message": "Default route"}
