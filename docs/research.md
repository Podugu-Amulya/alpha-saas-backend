Multi-Tenancy Analysis For this project, I chose the Shared Database and Shared Schema approach. This means all companies (tenants) stay in one database, but every row of data has a tenant_id to keep it private. This is the best choice because it is cheaper to host and much faster to set up than creating a new database for every single user.

Technology Stack

Backend: Node.js and Express were used to build a fast API.

Database: PostgreSQL was chosen because it handles complex data relationships very well.

Authentication: JWT (JSON Web Tokens) allow users to stay logged in securely for 24 hours.

Security Measures We use bcrypt to hash passwords so they are never stored in plain text. We also use a "Middleware" that checks the tenant_id on every request to make sure one company cannot see another company's projects.