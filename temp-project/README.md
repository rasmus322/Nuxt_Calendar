# Nuxt Calendar - Google Calendar Analog

A full-featured calendar application built with Nuxt 3, TypeScript, PostgreSQL, and TailwindCSS.

## Features

- ✅ User authentication (registration & login)
- ✅ Event CRUD (create, read, update, delete)
- ✅ Drag & drop events between days/time slots
- ✅ Three calendar views: Month, Week, Day
- ✅ Event categories with filtering
- ✅ Responsive design (mobile-first)
- ✅ Semantic HTML with ARIA attributes

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NuxtAuth (Credentials with bcrypt)
- **State Management**: Pinia

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Nuxt_Calendar/temp-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `temp-project` directory:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nuxt_calendar?schema=public"
   AUTH_SECRET="your-secret-key-change-in-production"
   AUTH_ORIGIN="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run migrations to create tables
   npm run db:migrate

   # Seed initial categories
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at: http://localhost:3000

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed initial categories |

## Project Structure

```
temp-project/
├── app/
│   ├── components/          # Vue components
│   │   ├── CalendarMonth.vue
│   │   ├── CalendarWeek.vue
│   │   ├── CalendarDay.vue
│   │   ├── EventModal.vue
│   │   └── CategoryFilter.vue
│   ├── pages/               # Nuxt pages
│   │   ├── auth/           # Authentication pages
│   │   └── calendar/       # Calendar pages
│   ├── stores/             # Pinia stores
│   │   └── calendar.ts
│   ├── utils/              # Utility functions
│   │   └── date.ts
│   └── middleware/         # Route middleware
│       └── auth.ts
├── server/
│   ├── api/               # API endpoints
│   │   ├── auth/         # Authentication endpoints
│   │   ├── events/       # Events CRUD endpoints
│   │   └── categories/   # Categories endpoint
│   └── utils/
│       └── prisma.ts
├── prisma/
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts           # Seed script
└── types/                 # TypeScript types
    ├── auth.ts
    └── calendar.ts
```

## Git Branches

- `main` - Production branch
- `stage` - Testing branch (all features merged)
- `feature/*` - Individual feature branches

## Testing the Application

1. Open http://localhost:3000
2. Register a new account at `/auth/register`
3. Log in at `/auth/login`
4. Start creating events!

### Features to Test:

- **Authentication**: Register, login, session persistence
- **Calendar Views**: Switch between Month/Week/Day views
- **Events**: Create, edit, delete events
- **Drag & Drop**: Drag events to different days/times
- **Categories**: Filter events by categories
- **Responsive**: Test on mobile devices/screen sizes

## Database Schema

The application uses three models:

- **User**: Stores user accounts with hashed passwords
- **Category**: Event categories with colors
- **Event**: Calendar events with title, description, dates, and optional category

## License

MIT
