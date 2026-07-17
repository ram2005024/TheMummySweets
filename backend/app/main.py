from contextlib import asynccontextmanager

from fastapi import FastAPI
from rich.panel import Panel

from app import api
from app.core.logger import console
from app.core.middleware import LoggingMiddleware
from app.exceptions.exception_handler import exception_handler


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
app.add_middleware(LoggingMiddleware)

# Def to handle the exception
exception_handler(app)
app.include_router(api.auth_router,prefix="/api/v1")

# Test
@app.get("/")
async def default():
    return {"message": "Default route"}
