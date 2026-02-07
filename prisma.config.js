import 'dotenv/config';
import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    // Prisma CLI expects `datasource.url` to be present at the top-level
    provider: "postgresql",
    url: process.env.DATABASE_URL, // your Neon DB connection string
  },
});
