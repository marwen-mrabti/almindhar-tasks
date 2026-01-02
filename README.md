# Almindhar Tasks

A modern task management application built with Next.js 16, Drizzle ORM, and Better Auth.

## Project Links

- **Repository**: [https://github.com/marwen-mrabti/almindhar-tasks]
- **Live Deployment**: [https://almindhar-tasks.vercel.app/]

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- [pnpm](https://pnpm.io/) (preferred package manager)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:marwen-mrabti/almindhar-tasks.git
   cd almindhar-tasks
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Configure the following variables in your `.env` file:

| Variable | Description |
|Data Source| |
| `DATABASE_URL` | Connection string for your PostgreSQL database. |
| **Authentication** | |
| `BETTER_AUTH_SECRET` | Secret key for signing session tokens. Generate one with `openssl rand -base64 32`. |
| `BASE_URL` | The base URL of your application (e.g., `http://localhost:3000`). |
| `AUTH_GOOGLE_CLIENT_ID` | Google OAuth Client ID (optional). |
| `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (optional). |
| **Email (SMTP)** | |
| `SMTP_SERVICE` | SMTP service provider (e.g., `gmail`). |
| `SMTP_HOST` | SMTP host address. |
| `SMTP_PORT` | SMTP port (e.g., `465` or `587`). |
| `SMTP_USER` | SMTP username/email. |
| `SMTP_PASSWORD` | SMTP password. |
| **Misc** | |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`). |

## Why Better Auth?

I chose **Better Auth** over Supabase Authentication for the following reasons:

- **Data Ownership**: I maintain full control over our user data and database schema within our own PostgreSQL instance, avoiding reliance on a third-party wrapper.
- **Vendor Independence**: Better Auth is open-source and infrastructure-agnostic, preventing vendor lock-in and allowing us to host our auth layer anywhere (Vercel, VPS, Docker, etc.).
- **Cost Efficiency**: No arbitrary "monthly active user" (MAU) limits or pricing tiers; we only pay for the database resources we actually use. I can add any other method of authentication I want without any extra cost.

## Database Management

### Migrations

Use Drizzle Kit to manage database schema changes.

- **Generate migrations**: Create SQL migration files based on schema changes.
  ```bash
  pnpm db:generate
  ```

- **Run migrations**: Apply pending migrations to the database.
  ```bash
  pnpm db:push
  ```

## Project Structure & Architecture

The project follows a **feature-based** directory structure (e.g., `src/_features`), which organizes code by domain functionality rather than technical layers.

**Why this is efficient:**
- **Colocation**: Related UI, business logic, and data access code sit together, identifying boundaries and reducing context switching.
- **Scalability**: New features can be added as self-contained modules without cluttering global `components` or `utils` folders.
- **Maintainability**: It limits the "spaghetti code" effect by making dependencies between features explicit.

### Data Access Layer (DAL)

I implement a strict **Data Access Layer (DAL)** pattern (found in `src/_features/**/dal.ts`) to manage all database interactions.

- **Security & Authorization**: Every DAL function explicitly validates the user's permissions (e.g., verifying `userId` or `organizationId`) before executing queries. This prevents IDOR (Insecure Direct Object Reference) vulnerabilities effectively.
- **Separation of Concerns**: The DAL is the *only* place where direct DB queries occur. Server Actions and UI components communicate with the DAL, ensuring business logic stays clean.
- **Performance**: We leverage Next.js `use cache` directives within the DAL to efficiently cache frequently accessed data like user profiles and organization settings.

### Organization Management & Security

I use **Better Auth**'s native organization plugin to handle secure multi-tenancy.

- **Isolation**: Resources (Tasks, Projects) are strictly scoped to organizations. A user can only access data belonging to the organization they are currently signed into.
- **Reliability**: instead of rolling a custom solution, we rely on Better Auth's battle-tested infrastructure to handle complex flows like member invitations, role management (Owner, Admin, Member), and active organization switching.

## Key added Features

- **Mode Toggle**: Built-in dark/light mode support using `next-themes` and Tailwind CSS, fully accessible and persistent.
- **Magic Link Authentication**: A passwordless sign-in experience powered by Better Auth. Users receive a secure link in their email to log in, reducing friction and increasing security.

## Limitations

Due to time constraints, the following planned features were not fully implemented in this iteration:

1. **Invite by Email**
   - **Goal**: Allow organization owners to invite new members via email.
   - **Flow**: The invited user would receive an email, and accepting it would link them to the organization after signing in.
   - **Current State**: Conceptual; the backend invitation flow is semi-implemented and the UI structure is pending.

2. **Activity Log**
   - **Goal**: A "Who did what" feed for organization administrators.
   - **Implementation Plan**: Create an `audit_logs` table to record high-value actions (create, update, delete) and display them in a timeline.
   - **Current State**: Not implemented.


