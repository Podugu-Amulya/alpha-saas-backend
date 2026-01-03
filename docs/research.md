# Multi-Tenancy Research & Analysis

## Technology Selection Justification
We selected **PostgreSQL** over NoSQL because multi-tenant SaaS platforms rely heavily on relational integrity. Ensuring that a Task belongs to a Project, which in turn belongs to a specific Tenant, is best handled via Foreign Key constraints.

## Isolation Strategies
During research, we compared **Schema Isolation** vs **Row-Level Isolation**. While Schema isolation provides better security, it makes automated migrations significantly harder. We chose Row-Level Isolation (Shared Schema) because it allows us to run a single migration script across the entire platform via Docker, meeting the "Automatic Migration" requirement of this task.

## Security and JWT
Stateless authentication is critical. By embedding the `tenant_id` inside the JWT payload, we prevent "ID Spoofing" where a user might try to access another tenant's data by changing a URL parameter.