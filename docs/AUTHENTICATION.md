# Authentication Setup Guide

This application uses **NextAuth.js v4** for authentication with support for:
- Email/Password (Credentials)
- Google OAuth
- GitHub OAuth

## Quick Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

**Required variables:**

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 2. OAuth Providers (Optional)

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`:

```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### GitHub OAuth

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Secret to `.env.local`:

```env
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 3. Database Setup

The user table is already configured in the Prisma schema. Make sure your database is up to date:

```bash
npx prisma db push
# or
npx prisma migrate dev
```

## How It Works

### Routes

- `/login` - Sign in page
- `/signup` - Sign up page
- `/api/auth/[...nextauth]` - NextAuth API routes
- `/api/auth/signup` - Custom signup endpoint

### Protected Routes

The following routes require authentication (configured in `middleware.ts`):

- `/dashboard/*`
- `/chat/*`
- `/projects/*`
- `/settings/*`

### Session Management

The app uses **JWT strategy** for sessions. User data is stored in the token and made available via:

```tsx
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session } = useSession();

  return <div>Hello {session?.user?.name}</div>;
}
```

### Sign Out

```tsx
import { signOut } from 'next-auth/react';

function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>
      Sign out
    </button>
  );
}
```

## User Flow

1. **New User:**
   - Visit `/signup`
   - Enter name, email, password
   - Account created with 80 credits
   - Auto sign-in and redirect to `/dashboard`

2. **Existing User:**
   - Visit `/login`
   - Enter email and password (or use OAuth)
   - Redirect to `/dashboard`

3. **Protected Route:**
   - Try to access `/dashboard`
   - If not authenticated → redirect to `/login`
   - If authenticated → access granted

## Database Schema

The `User` model in Prisma:

```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  passwordHash  String?   // Only for credentials provider
  credits       Int       @default(80)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  conversations Conversation[]
}
```

## Security Notes

1. **Passwords** are hashed using `bcryptjs` with salt rounds of 10
2. **Sessions** use JWT tokens signed with `NEXTAUTH_SECRET`
3. **OAuth tokens** are not stored in the database
4. **Middleware** protects routes automatically
5. **HTTPS** should be used in production

## Troubleshooting

### "No secret provided" error
Make sure `NEXTAUTH_SECRET` is set in `.env.local`

### OAuth not working
- Check redirect URIs match exactly
- Verify client ID and secret are correct
- Make sure OAuth app is not in development mode (for production)

### Session not persisting
- Clear browser cookies
- Check `NEXTAUTH_URL` matches your domain
- Verify JWT secret hasn't changed

## Production Deployment

For production (e.g., Vercel):

1. Set environment variables in your hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Update OAuth redirect URIs to production URLs
4. Use HTTPS (required for OAuth)

Example:
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
```
