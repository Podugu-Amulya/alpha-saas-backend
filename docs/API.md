# API Documentation (19 Endpoints)

## Authentication & Multi-Tenancy
1. **POST /api/auth/register** - Register new tenant and admin.
2. **POST /api/auth/login** - Login with email, password, and subdomain.
3. **GET /api/health** - System health check.

## Tenant Management
4. **GET /api/tenants** - List all tenants (Super Admin).
5. **GET /api/tenants/:id** - Get specific tenant details.
6. **PUT /api/tenants/:id** - Update tenant settings.

## User Management
7. **GET /api/users** - List users within the current tenant.
8. **POST /api/users** - Create new user for tenant.
9. **GET /api/users/:id** - Get user profile.
10. **PUT /api/users/:id** - Update user role/profile.
11. **DELETE /api/users/:id** - Deactivate user.

## Project Management
12. **GET /api/projects** - List all projects for current tenant.
13. **POST /api/projects** - Create new project.
14. **GET /api/projects/:id** - View project details.
15. **DELETE /api/projects/:id** - Remove project.

## Task Management
16. **GET /api/tasks** - List tasks for tenant.
17. **POST /api/tasks** - Create task under project.
18. **PUT /api/tasks/:id** - Update task status/assignment.
19. **DELETE /api/tasks/:id** - Delete task.