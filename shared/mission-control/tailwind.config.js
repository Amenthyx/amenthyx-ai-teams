/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/client/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agent: {
          TL: '#F59E0B',
          PM: '#64748B',
          BE: '#3B82F6',
          FE: '#22C55E',
          MOB: '#06B6D4',
          DEVOPS: '#F97316',
          INFRA: '#F59E0B',
          QA: '#A855F7',
          RM: '#14B8A6',
          MKT: '#EC4899',
          LEGAL: '#6B7280',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
