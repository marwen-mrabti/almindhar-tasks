import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config();

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schemas',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: 'journal',
    schema: 'drizzle',
  },
  verbose: true,
  strict: true,
});
