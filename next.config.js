module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  unstable_runtimeJS: false,
  output: 'export',
  images: { unoptimized: true },
  experimental: { disableOptimizedLoading: true },
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/generate-keys': { page: '/generate-keys' },
      '/login': { page: '/login' },
      '/profile': { page: '/profile' },
      '/signup': { page: '/signup' },
      '/404': { page: '/404' },
    };
  },
}
