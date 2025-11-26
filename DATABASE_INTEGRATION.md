# Database Integration Guide

## Overview
The Prisma schema has been extended to support all application features with real database integration.

## New Models Added (10 total)

### User & Team Management
- **User**: User profiles with Clerk integration, roles, and status
- **Team**: Team/household information
- **TeamMember**: Junction table for user-team relationships

### API Keys
- **ApiKey**: API key management with usage tracking and expiration

### Analytics
- **AnalyticsSnapshot**: Daily analytics data (items tracked, money saved, waste reduction, etc.)

### Data Exports
- **DataExport**: Export history with format, size, and download URLs

### Settings
- **UserSettings**: Comprehensive user preferences including notifications, theme, language, etc.

### Billing
- **Subscription**: User subscription plans and billing cycles
- **Invoice**: Invoice history with payment status

## Migration Steps

### 1. Generate Prisma Client
```bash
npx prisma generate
```

### 2. Create and Apply Migration
```bash
npx prisma migrate dev --name add_user_team_analytics_models
```

### 3. Seed the Database
```bash
npx prisma db seed
```

## Seed Data Included

- **3 Users**: John Doe (Admin), Jane Smith (Member), Bob Johnson (Pending)
- **1 Team**: Doe Family Kitchen
- **3 Team Memberships**
- **2 API Keys**: Production and Development keys
- **3 Analytics Snapshots**: Current, yesterday, and last week
- **3 Data Exports**: CSV, PDF, and JSON formats
- **1 User Settings**: Complete settings for John Doe
- **1 Subscription**: Pro plan for John Doe
- **3 Invoices**: Last 3 months of billing history
- **Existing Data**: Flows, Inventory Items, Credentials (from original seed)

## Server Actions Created

Location: `/src/lib/actions/data.ts`

### Available Actions:
- `getLatestAnalytics()` - Latest analytics snapshot
- `getAnalyticsHistory(days)` - Historical analytics data
- `getAllUsers()` - All users with team memberships
- `getTeamStats()` - Team statistics
- `getUserApiKeys(userId)` - User's API keys
- `getDataExports()` - Export history
- `getUserSettings(userId)` - User settings
- `getUser(userId)` - User profile
- `getUserSubscription(userId)` - Subscription details
- `getUserInvoices(userId)` - Invoice history
- `getRecentInventoryActivity()` - Recent inventory changes
- `getExpiringSoonItems()` - Items expiring within 24 hours

## Next Steps

### Pages to Update (Currently using mock data):
1. `/analytics/overview` - Use `getLatestAnalytics()`
2. `/analytics/realtime` - Use `getRecentInventoryActivity()` and `getExpiringSoonItems()`
3. `/analytics/exports` - Use `getDataExports()`
4. `/users` - Use `getAllUsers()` and `getTeamStats()`
5. `/api` - Use `getUserApiKeys()`
6. `/settings/general` - Use `getUser()` and `getUserSettings()`
7. `/settings/billing` - Use `getUserSubscription()` and `getUserInvoices()`
8. `/settings/notifications` - Use `getUserSettings()`

### Example Usage:
```typescript
// In a Server Component
import { getLatestAnalytics } from "@/lib/actions/data";

export default async function AnalyticsPage() {
  const analytics = await getLatestAnalytics();
  
  return (
    <div>
      <h1>Total Items: {analytics?.totalItems || 0}</h1>
      <p>Money Saved: ${analytics?.moneySaved || 0}</p>
    </div>
  );
}
```

## Important Notes

- All server actions use React's `cache()` for request deduplication
- Error handling is built into each action
- Database queries are optimized with proper indexes
- Foreign key constraints ensure data integrity
- Cascade deletes are configured for related data

## Testing

After running migrations and seed:
1. Verify all pages load without errors
2. Check that real data appears instead of mock data
3. Test CRUD operations where applicable
4. Verify relationships between models work correctly
