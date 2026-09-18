from fastapi import WebSocket


class UserSocketConnection:
    def __init__(self) -> None:
        self.user_connection: dict[str, set[WebSocket]] = {}

    async def connect_user(self, user_id: str, ws: WebSocket):
        existing = self.user_connection.get(user_id, None)
        if not existing:
            self.user_connection[user_id] = {ws}
            return
        existing.add(ws)
        return

    async def broadcast_message(self, user_id: str, message: dict):
        connections = self.user_connection.get(user_id, None)
        if not connections:
            return
        for connection in connections:
            try:
                await connection.send_json(message)
            except Exception:  # noqa: BLE001
                connections.discard(connection)

    async def disconnect(self, user_id: str, ws: WebSocket):
        connections = self.user_connection.get(user_id, None)
        if not connections:
            return
        if ws in connections:
            await ws.close()
            connections.discard(ws)
        if not connections:
            self.user_connection.pop(user_id)


user_manager = UserSocketConnection()
