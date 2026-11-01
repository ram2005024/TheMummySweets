Mummy Sweet

A modern web platform for Mummy Sweets, built to showcase products and provide customers with a seamless online shopping experience.

Tech Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

Database & Infrastructure

- PostgreSQL
- Redis
- Docker
- Git & GitHub

Features

- Responsive and modern user interface
- Product listing and product details
- Product categorization and browsing
- Customer-friendly shopping experience
- Backend REST API
- Database-driven product management
- Request validation and structured API responses
- Scalable frontend and backend architecture

Project Structure

mummy-sweets/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   ├── alembic/
│   ├── tests/
│   ├── pyproject.toml
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── stores/
│   │   └── types/
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
└── README.md

Getting Started

Prerequisites

Make sure you have the following installed:

- Python 3.12+
- uv
- Node.js 20+
- PostgreSQL
- Redis
- Git

1. Clone the Repository

git clone <repository-url>
cd mummy-sweets

2. Backend Setup

Navigate to the backend directory:

cd backend

Install dependencies:

uv sync

Configure environment variables using the provided example:

cp .env.example .env

Run database migrations:

uv run alembic upgrade head

Start the FastAPI development server:

uv run uvicorn app.main:app --reload

Backend API:

http://localhost:8000

API documentation:

http://localhost:8000/docs
http://localhost:8000/redoc

3. Frontend Setup

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Configure environment variables:

cp .env.example .env.local

Start the development server:

npm run dev

Frontend:

http://localhost:3000

Environment Variables

Backend

Configure the following variables in "backend/.env":

APP_NAME=Mummy Sweets
DEBUG=True
DATABASE_URL=
REDIS_URL=
SECRET_KEY=

Frontend

Configure "frontend/.env.local":

NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

Add any additional variables required by your implementation.

API Documentation

FastAPI provides interactive API documentation.

Documentation| URL
Swagger UI| "/docs"
ReDoc| "/redoc"
OpenAPI Schema| "/openapi.json"

Development

Backend

cd backend
uv run uvicorn app.main:app --reload

Frontend

cd frontend
npm run dev

Production Build

Frontend

cd frontend
npm run build
npm run start

Backend

Run the backend using a production ASGI server configuration and apply database migrations before deployment.

Future Enhancements

- Customer authentication and authorization
- Shopping cart and checkout
- Online payment integration
- Order placement and tracking
- Product reviews and ratings
- Inventory management
- Admin dashboard
- Email and order notifications
- Analytics and sales reporting

License

This project is developed for Mummy Sweets. All rights reserved unless otherwise specified.

---

Mummy Sweets — A better way to discover and enjoy sweets.
