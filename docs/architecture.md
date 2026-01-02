System Architecture The project is split into two main parts: a Frontend (the website) and a Backend (the logic and database).

How it Works

The Frontend (HTML/JS) sends requests to the Backend using the Fetch API.

The Backend (Node.js) verifies the user's JWT token to see who they are.

The Backend then asks the Database (PostgreSQL) for data that belongs ONLY to that user's tenant_id.

Everything is wrapped in Docker containers so it can be installed with one command: docker-compose up.