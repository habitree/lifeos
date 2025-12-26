/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 프로젝트별 빌드 출력 디렉토리 명시 (다른 프로젝트와 격리)
  distDir: '.next',
  // 프로젝트별 캐시 디렉토리 설정
  generateBuildId: async () => {
    // 프로젝트별 고유 빌드 ID 생성
    return 'life-os-' + Date.now()
  },
}

module.exports = nextConfig

