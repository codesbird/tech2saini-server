import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres.zxzmwxmssgqwwqecvclf:tech2saini456@@@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
  },
});
