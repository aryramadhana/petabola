import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json's "@/*" -> repo root path alias.
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    include: ["lib/**/*.test.ts"],
  },
});
