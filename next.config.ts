import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  assetPrefix: "./",
  compress: false,
  webpack(webpackConfig) {
    return {
      ...webpackConfig,
      optimization: {
        minimize: false,
      },
    };
  },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
          {
            key: "strict-transport-security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "x-content-type-options",
            value: "nosniff",
          },
          {
            key: "x-frame-options",
            value: "DENY",
          },
          {
            key: "x-xss-protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self';
              object-src 'none';
              base-uri 'self';
              frame-ancestors 'none';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
