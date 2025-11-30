# Notes App with Better Auth

A Next.js application with authentication using Better Auth, Drizzle ORM, and Supabase PostgreSQL.

## Features

- 🔐 Email/Password Authentication
- 🔍 Google OAuth Login
- 🗄️ PostgreSQL Database with Supabase
- 🔧 Drizzle ORM for database management
- 💅 Tailwind CSS for styling
- 🎨 Shadcn/ui components

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy the `.env.example` file to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Fill in the following environment variables:

- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: From Google Cloud Console
- `GOOGLE_CLIENT_SECRET`: From Google Cloud Console  
- `BETTER_AUTH_SECRET`: A secure random string (generate with `openssl rand -base64 32`)
- `BETTER_AUTH_URL`: Your app URL (http://localhost:3000 for development)

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env` file

### 4. Database Migration

Generate and run the database migration:

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Run the Application

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app!

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate database migration files
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio for database management

## Routes

- `/` - Home page (shows user profile if logged in)
- `/login` - Login/Registration page
- `/api/auth/[...all]` - Better Auth API routes

## Database Schema

The app uses Better Auth's recommended schema with the following tables:

- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts and password storage
- `verification` - Email verification tokens

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Better Auth
- **Database**: Supabase PostgreSQL
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **Package Manager**: pnpm