# Authentication Setup Guide

## Important: Clerk Authentication

This application uses **Clerk** for authentication, not a custom Prisma-based auth system. Clerk handles:
- User signup/login
- Password management
- Session management
- OAuth providers (Google, GitHub, etc.)

## How It Works

1. **Clerk handles authentication** - Users sign up/login through Clerk
2. **Webhook syncs to Prisma** - When a user signs up in Clerk, a webhook creates the user in our Prisma database
3. **Prisma stores user data** - All user-specific data (inventory, flows, etc.) is stored in Prisma with `userId` references

## Setting Up Clerk

### 1. Create a Clerk Account
1. Go to [clerk.com](https://clerk.com)
2. Create a free account
3. Create a new application

### 2. Get Your API Keys
From your Clerk dashboard, copy:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Add these to your `.env` file:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Configure Clerk Webhook (User Sync)

Create a webhook endpoint to sync Clerk users to Prisma:

**File: `/src/app/api/webhooks/clerk/route.ts`**

This webhook will:
- Create a user in Prisma when they sign up in Clerk
- Update user data when changed in Clerk
- Delete user from Prisma when deleted in Clerk

### 4. Update Clerk Dashboard Settings

In your Clerk dashboard:
1. Go to **Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

## Test Users (For Development)

Since Clerk handles authentication, you need to create test users in Clerk dashboard:

### Option 1: Create Users in Clerk Dashboard
1. Go to Clerk Dashboard → Users
2. Click "Create User"
3. Add users with these emails (matching seed data):
   - admin@freshsaver.com (set role to ADMIN in Prisma after creation)
   - john@example.com
   - jane@example.com

### Option 2: Sign Up Through the App
1. Run the app: `yarn dev`
2. Go to `/signup`
3. Create accounts with any email
4. Webhook will sync to Prisma automatically

## Seed Data Clerk IDs

The seed data uses placeholder Clerk IDs:
- `clerk_admin_123` - Admin user
- `clerk_user_1` - John Doe
- `clerk_user_2` - Jane Smith
- `clerk_user_3` - Bob Johnson

**These are NOT real Clerk IDs.** You need to either:
1. Update seed data with real Clerk IDs after creating users in Clerk
2. Or let the webhook create users automatically when they sign up

## Development Login

For development, you can:

1. **Use Clerk's built-in components** (Recommended):
   ```tsx
   import { SignIn } from "@clerk/nextjs";
   
   export default function LoginPage() {
     return <SignIn />;
   }
   ```

2. **Or create test users in Clerk** and login with those credentials

## Admin Access

To make a user an admin:

1. User signs up through Clerk
2. Find their user record in Prisma database
3. Update their role:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@freshsaver.com';
   ```

## Important Notes

- **Passwords are NOT stored in Prisma** - Clerk handles all password management
- **Sessions are managed by Clerk** - Use Clerk's session management
- **The current LoginForm.client.tsx is a placeholder** - Replace it with Clerk's `<SignIn />` component
- **Database migrations must be run** before the webhook can sync users

## Next Steps

1. Sign up for Clerk account
2. Get API keys and add to `.env`
3. Run database migrations: `npx prisma migrate dev`
4. Create webhook endpoint (I can help with this)
5. Configure webhook in Clerk dashboard
6. Create test users in Clerk or sign up through the app
