Alpha Multi-Tenant SaaS Platform
A complete, dockerized multi-tenant SaaS application featuring Project and Task Management with strict data isolation between tenants.

🚀 Quick Start (Docker Installation)
This project is fully containerized according to the mandatory requirements. You can start all services (Database, Backend, and Frontend) with a single command:

Bash

docker-compose up -d --build
Mandatory Service Configuration:
Database: Port 5432 (Internal & External)

Backend: Port 5000 (Internal & External)

Frontend: Port 3000 (Internal & External)

🏗️ Architecture & Technical Overview
Multi-tenancy Model: Logical isolation using a tenant_id column to ensure data privacy between different organizations.

Backend Stack: Node.js and Express.js providing 19 functional API endpoints.

Database: PostgreSQL with automatic migrations and seed data loading upon container startup.

Authentication: JWT-based authentication with Bcrypt password hashing and role-based access control (RBAC).

📂 Project Structure & Documentation
The following mandatory artifacts are located in the repository:

/docs/research.md: Multi-tenancy analysis and technology stack justification.

/docs/PRD.md: Product Requirements Document with user personas and functional requirements.

/docs/architecture.md: System architecture diagram and Database ERD.

/docs/API.md: Complete documentation for all 19 API endpoints.

submission.json: Mandatory file containing test credentials for automated evaluation.

🔑 Test Credentials (Seed Data)
The system automatically seeds the following accounts for testing:

Super Admin: superadmin@alpha.com / AdminPassword123

Tenant Admin: admin@demo.com / Demo@123 (Subdomain: demo)

Regular User: user@demo.com / User@123 (Subdomain: demo)