# System Architecture

## Overview
The platform uses a **Shared Database, Logical Isolation** model. Every table contains a `tenant_id` to ensure users only see data belonging to their organization.



## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Containerized via Nginx).
- **Backend**: Node.js, Express.js (REST API).
- **Database**: PostgreSQL (Relational storage).
- **DevOps**: Docker & Docker Compose.

## Database ERD
- **Tenants Table**: `id, name, subdomain, email, created_at`
- **Users Table**: `id, tenant_id, full_name, email, password_hash, role`
- **Projects Table**: `id, tenant_id, name, description`
- **Tasks Table**: `id, project_id, tenant_id, title, status`