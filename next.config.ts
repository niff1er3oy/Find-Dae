import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.27", "find-dae.niff1er-3oy.com"],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
      allowedOrigins: ['find-dae.niff1er-3oy.com', '192.168.1.27'],
    },
  },
  turbopack: {
    // UPLOAD_DIR (lib/uploadDirs.ts) points outside the project (configurable via .env),
    // so Output File Tracing can't statically scope it and falls back to tracing the
    // whole project. Harmless here since this app deploys via `next start`, not standalone.
    ignoreIssue: [
      {
        path: 'next.config.ts',
        title: 'Encountered unexpected file in NFT list',
      },
    ],
  },
};

export default nextConfig;
