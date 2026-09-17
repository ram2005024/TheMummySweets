from fastapi import WebSocket


class SocketConnection:
    def __init__(self) -> None:
        self.admin_connections: dict[str, set[WebSocket]] = {}

    async def connect_admin_connection(self, websocket: WebSocket, admin_id: str):
        connection = self.admin_connections.get(admin_id, set())
        connection.add(websocket)
        self.admin_connections[admin_id] = connection

    async def disconnect_admin(self, websocket: WebSocket, admin_id: str):
        existing_connection = self.admin_connections.get(admin_id, set())
        if existing_connection:
            existing_connection.discard(websocket)
            if not existing_connection:
                self.admin_connections.pop(admin_id, None)

    async def broadcast_admin_message(self, message: dict):
        if not self.admin_connections:
            return
        for connections in self.admin_connections.values():
            for connection in list(connections):
                try:
                    await connection.send_json(message)
                except Exception:  # noqa: BLE001
                    connections.discard(connection)

    async def disconnect(self, admin_id: str, ws: WebSocket):
        exisiting = self.admin_connections.get(admin_id, set())
        if not exisiting:
            return
        for connection in exisiting:
            if connection == ws:
                await connection.close()
                exisiting.discard(connection)
        if not exisiting:
            self.admin_connections.pop(admin_id, None)
