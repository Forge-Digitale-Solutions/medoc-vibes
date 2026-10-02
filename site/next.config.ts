import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  // Keep tracing rooted on site/ so Docker context=site/ gets a flat
  // .next/standalone (not nested under a monorepo package name).
  outputFileTracingRoot: siteDir,
};

export default nextConfig;
