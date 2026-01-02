# Technical Specification

## Project Structure
- **backend/**: Node.js Express API.
  - **src/controllers/**: Business logic and API functions.
  - **src/middleware/**: JWT protection and Tenant isolation.
  - **migrations/**: SQL files for database setup.
- **frontend/**: Static HTML/JS files.
- **docs/**: Project documentation.

## Development Setup (Docker)
1. Ensure Docker Desktop is running.
2. Open terminal in the root folder.
3. Run: `docker-compose up -d --build`
4. Access Frontend: `http://localhost:3000`
5. Access Backend Health: `http://localhost:5000/api/health`

## Environment Variables
- `DATABASE_URL`: Connection string for PostgreSQL.
- `JWT_SECRET`: Key for signing security tokens.
- `PORT`: 5000.