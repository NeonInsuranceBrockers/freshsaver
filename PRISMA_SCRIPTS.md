# Prisma Scripts Reference

## Available Scripts

### Core Commands

#### `yarn prisma:generate`
Generates Prisma Client based on your schema.
- Run this after any schema changes
- Required before using Prisma in your code

#### `yarn prisma:migrate`
Creates and applies a new migration.
- Use during development
- Prompts for migration name
- Updates database schema

#### `yarn prisma:push`
Pushes schema changes directly to database without creating migrations.
- **Use with caution** - doesn't create migration history
- Good for prototyping
- Not recommended for production

### Migration Management

#### `yarn prisma:migrate:create`
Creates a new migration file without applying it.
- Useful for reviewing SQL before applying
- Allows manual edits to migration

#### `yarn prisma:migrate:deploy`
Applies pending migrations (production).
- Use in CI/CD pipelines
- Doesn't prompt for migration names
- Only applies existing migrations

#### `yarn prisma:migrate:reset`
Resets database and applies all migrations.
- **Destructive** - deletes all data
- Reapplies all migrations from scratch
- Runs seed after reset

### Database Operations

#### `yarn prisma:pull`
Pulls schema from existing database.
- Introspects database structure
- Updates your Prisma schema
- Useful when database was modified outside Prisma

#### `yarn prisma:seed`
Runs the seed script to populate database with test data.
- Defined in `prisma/seed.ts`
- Creates sample users, inventory, etc.

#### `yarn prisma:studio`
Opens Prisma Studio - a visual database browser.
- View and edit data in browser
- Great for development
- Runs on http://localhost:5555

### Utility Commands

#### `yarn prisma:format`
Formats your Prisma schema file.
- Auto-formats schema.prisma
- Consistent formatting

#### `yarn prisma:validate`
Validates your Prisma schema.
- Checks for errors
- Doesn't modify anything

#### `yarn prisma:reset`
Force resets database without confirmation.
- **Very destructive**
- Use with extreme caution
- Good for automated scripts

### Combo Commands

#### `yarn db:setup`
Complete database setup from scratch.
- Generates Prisma Client
- Runs migrations
- Seeds database
- **Use this for initial setup**

#### `yarn db:reset`
Reset and reseed database.
- Resets database
- Runs seed
- Quick way to get fresh test data

## Common Workflows

### Initial Setup
```bash
# First time setup
yarn db:setup
```

### After Schema Changes
```bash
# Create and apply migration
yarn prisma:migrate

# Or just push changes (development only)
yarn prisma:push
```

### Reset to Fresh State
```bash
# Complete reset with seed data
yarn db:reset
```

### View/Edit Data
```bash
# Open Prisma Studio
yarn prisma:studio
```

### Production Deployment
```bash
# Generate client
yarn prisma:generate

# Apply migrations
yarn prisma:migrate:deploy
```

## Important Notes

- **Always use `dotenv -e .env`** - Scripts automatically load environment variables
- **Migrations are version controlled** - Commit migration files to git
- **Never use `prisma:push` in production** - Always use migrations
- **`prisma:reset` is destructive** - All data will be lost
- **Seed data is for development** - Don't run in production with real data

## Environment Variables Required

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Make sure `.env` file exists
- Check DATABASE_URL is set correctly

### "Migration failed"
- Check database connection
- Review migration SQL
- May need to reset: `yarn db:reset`

### "Prisma Client not generated"
- Run: `yarn prisma:generate`
- Check for schema errors: `yarn prisma:validate`
