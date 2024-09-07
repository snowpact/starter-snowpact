/**
 * @type {import('next').NextConfig}
 */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // output: 'export',
  pageExtensions: ['page.tsx', 'page.ts'],
  images: {
    unoptimized: true
  },
  i18n,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com'
    }
  ],
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(pdf)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'static/files',
            publicPath: '_next/static/files'
          }
        }
      ]
    });

    return config;
  }
};

module.exports = nextConfig;
