// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Mencegah clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Mencegah MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self';
              connect-src 'self' https://api.groq.com https://openrouter.ai https://*.neon.tech https://*.vercel-storage.com;
              frame-ancestors 'none';
            `.replace(/\s+/g, ' ').trim(),
          },
          // Strict Transport Security (HTTPS only)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Image domains yang diizinkan
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '*.neon.tech',
      },
    ],
  },
};

export default nextConfig;