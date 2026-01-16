# Calendly Clone

A full-stack scheduling and booking app that mirrors Calendly's core flows: event types, availability, public booking, and meeting management.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL

## Features
- Event types CRUD with unique public booking links
- Weekly availability settings with timezone
- Public booking page with calendar, slot selection, and confirmation
- Meetings page for upcoming/past meetings with cancel flow
- Seed data for sample event types and meetings

## Project Structure
- `backend/` Express API + SQL schema/seed
- `frontend/` React SPA

## Setup

### 1) Database
Create a PostgreSQL database and run the schema + seed scripts:

```bash
# Create database
createdb calendly_clone

# Initialize schema and seed data
cd backend
npm run db:init
```


### 2) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and expects the API on `http://localhost:4000`.

## API Endpoints
- `GET /api/event-types`
- `POST /api/event-types`
- `PUT /api/event-types/:id`
- `DELETE /api/event-types/:id`
- `GET /api/availability`
- `PUT /api/availability`
- `GET /api/bookings/slots?date=YYYY-MM-DD&slug=...`
- `POST /api/bookings`
- `GET /api/meetings?status=upcoming|past`
- `POST /api/meetings/:id/cancel`

## Assumptions
- Single default admin user (no login), controlled by `DEFAULT_USER_ID` in the backend env file.
- Availability is weekly with optional date overrides supported in the schema.
- Timezone logic uses Luxon on the backend for consistent slot generation.

## Notes
- The public booking page lives at `/book/:slug`.
- Seed data includes a few event types and meetings for demo purposes.
