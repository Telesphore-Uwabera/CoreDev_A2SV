import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@generated/prisma": path.resolve(__dirname, "generated/prisma"),
      "@generated/prisma/client": path.resolve(
        __dirname,
        "generated/prisma/client.js"
      ),
    },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["dist/**", "node_modules/**"],
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
    },
  },
});

