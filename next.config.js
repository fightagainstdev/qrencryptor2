module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  unstable_runtimeJS: false,
  output: 'export',
  images: { unoptimized: true },
  experimental: { disableOptimizedLoading: true },
  exportPathMap: async () => ({}),
}
