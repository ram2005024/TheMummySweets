from fastapi import FastAPI

app = FastAPI(title="The Mummy Sweets")


# Test
@app.get("/")
async def default():
    return {"message": "Default route"}
