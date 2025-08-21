# CueFinder Venue Portal

A web-based management portal for pool hall venue owners to manage bookings, tables, and analytics. Built with Next.js 14 and Firebase.

## Features

- 🔐 **Secure Authentication** - Firebase Auth with role-based access
- 📊 **Dashboard** - Real-time stats and upcoming bookings
- 📅 **Booking Management** - Accept, reject, and track customer bookings
- 🎱 **Table Management** - Monitor table availability and maintenance
- 📈 **Analytics** - Revenue tracking and business insights
- ⚙️ **Settings** - Venue configuration and business rules
- 🔄 **Real-time Updates** - Live data synchronization with Firestore

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Deployment**: Railway
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- Railway account (for deployment)

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment to Railway

1. Push code to GitHub
2. Connect Railway to your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy (Railway will auto-detect Next.js and configure build)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard routes
│   │   ├── bookings/     # Booking management
│   │   ├── tables/       # Table management
│   │   ├── analytics/    # Business analytics
│   │   └── settings/     # Venue settings
│   └── login/            # Authentication page
├── components/           # Reusable React components
├── lib/                  # Utilities and Firebase config
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## User Roles

- **venue_owner**: Full access to venue management features
- **customer**: Mobile app access only (not supported in portal)
- **admin**: System administration (future)

## Firebase Data Structure

```
venues/
  └── {venueId}/
      ├── name
      ├── address
      ├── phone
      └── ...

bookings/
  └── {bookingId}/
      ├── venueId
      ├── userId
      ├── status
      ├── startTime
      └── ...

tables/
  └── {tableId}/
      ├── venueId
      ├── number
      ├── status
      └── ...

users/
  └── {userId}/
      ├── role
      ├── venueId
      └── ...
```

## Development

```bash
# Run linter
npm run lint

# Type check
npm run build
```

## License

Private - CueFinder © 2025