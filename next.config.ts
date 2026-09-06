import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  eslint: {
    // 项目使用 eslint-config-next@16 + next@15，其内置 lint 序列化存在兼容问题，
    // 类型与规则校验改为单独的 tsc / eslint 命令执行
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https' as const, hostname: 'images.unsplash.com' },
      { protocol: 'https' as const, hostname: 'maps.google.com' },
      { protocol: 'https' as const, hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https' as const, hostname: '*.google.com' },
    ],
  },
};

export default withNextIntl(nextConfig);

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
