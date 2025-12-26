import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // 메인 컬러
          600: '#0284c7',
          700: '#0369a1',
        },
        baseline: {
          on: '#10b981', // 부드러운 초록
          off: '#e5e7eb', // 부드러운 회색
        },
        reset: {
          default: '#f59e0b', // 부드러운 주황
          hover: '#d97706',
        },
        phase: {
          1: '#6366f1', // 인디고
          2: '#8b5cf6', // 보라
          3: '#ec4899', // 핑크
          4: '#f59e0b', // 앰버
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'system-ui', 'sans-serif'],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
export default config

