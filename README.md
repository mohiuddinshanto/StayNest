# StayNest

A full-stack rental property platform where renters can discover homes, owners can manage listings, and administrators can review platform activity.

## Live demo

[Open StayNest](https://staynest-next.vercel.app)

## What you can do

- Browse, search, filter, and view rental properties
- Sign up and sign in with Better Auth
- Rent an available, approved property from its details page
- View confirmed rentals in the renter dashboard
- Send messages and viewing requests to property owners
- Create, edit, manage, and track owner listings
- Review properties and see ratings
- Approve, reject, and monitor listings as an administrator

## Tech stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS and Lucide icons
- Better Auth for session-based authentication
- Express and MongoDB backend, reached through a Next.js API proxy
- Recharts for dashboard visualizations

## Project structure

```text
src/
  app/            # Pages, API proxy routes, and layouts
  components/     # Reusable UI components
  context/        # Property and session-aware client state
  lib/            # API and authentication clients
  types/          # Shared TypeScript types
```

## Run locally

### 1. Start the backend

```bash
cd ../../Backend
npm install
npm run dev
```

The backend listens on `http://localhost:5000` by default.

### 2. Configure the frontend

Create `.env.local` in this directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=replace_with_a_long_random_secret
```

Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` only when Google login is enabled.

### 3. Start the frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Deployment

The frontend is deployed on Vercel at [staynest-next.vercel.app](https://staynest-next.vercel.app). Configure `NEXT_PUBLIC_API_URL` in Vercel to point to the deployed backend; the app forwards requests through `/api/backend` so browser sessions are preserved.

## Roles

| Role | Main access |
| --- | --- |
| User | Explore properties, rent, message owners, view My Rentals |
| Owner | Create and manage properties, receive inquiries, view analytics |
| Admin | Review listings and access platform-wide dashboards |

## Notes

- Only approved and available properties can be rented.
- A property can only be confirmed once; the API prevents concurrent rental confirmations.
- Do not commit `.env.local` or any database credentials.
