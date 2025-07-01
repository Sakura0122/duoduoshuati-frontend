/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // 禁用符号链接，改用文件拷贝
    disableOptimizedLoading: true,
    // 如果问题依旧，尝试关闭完整文件跟踪
    outputFileTracingExcludes: {
      '*': ['node_modules/**/*'],
    },
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
}

export default nextConfig
