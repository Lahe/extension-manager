# Extension Management Dashboard

A [Frontend Mentor](https://www.frontendmentor.io/challenges/browser-extension-manager-ui-yNZnOfsMAp) challenge extended to a full stack app using:
- [TanStack Start](https://tanstack.com/start/latest)
- [Drizzle ORM](https://orm.drizzle.team/) with a [PostgreSQL](https://www.postgresql.org/) database
    - A [separate branch](https://github.com/Lahe/extension-manager/tree/kysely) for trying out [Kysely](https://kysely.dev/) and [Kanel](https://kristiandupont.github.io/kanel/) instead of Drizzle
- [Shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [better-auth](https://www.better-auth.com/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [pnpm](https://pnpm.io/)
*   A running [PostgreSQL](https://www.postgresql.org/download/) database instance.

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Lahe/extension-manager.git
    ```

2. **Install dependencies:**
    ```bash
    pnpm install
    ```

3. **Set up environment variables:**
    * Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    * Add your database url and set [better-auth](https://www.better-auth.com/docs/installation#set-environment-variables) variables.
        ```bash
        DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
        BETTER_AUTH_URL=http://localhost:3000
        BETTER_AUTH_SECRET=<your_secret_here>
        ```

4. **Set up the database:**
    * Ensure your PostgreSQL server is running and accessible.
    * Optionally run the included docker-compose.yml file to set up a local PostgreSQL instance:
    ```bash
    docker compose up -d
    ```

5. **Initialize database:**
    ```bash
    pnpm db:push
    ```

6. **Start the development server:**
    ```bash
    pnpm dev
    ```

This will start the Vite development server at http://localhost:3000.

## Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io/challenges/browser-extension-manager-ui-yNZnOfsMAp)
- [TanStack Start](https://tanstack.com/start/latest)
- [dotnize - tanstarter](https://github.com/dotnize/tanstarter)
- [Drizzle ORM](https://orm.drizzle.team/)
- [better-auth](https://www.better-auth.com/)
- [TailwindCSS](https://tailwindcss.com/docs/v4-beta)
- [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
- [kolm-startr](https://github.com/jellekuipers/kolm-start)
