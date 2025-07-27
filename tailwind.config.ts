import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Main brand colors
        background: '#0F172A',
        foreground: '#F8FAFC',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          muted: '#1E40AF',
        },
        accent: {
          DEFAULT: '#7C3AED',
          muted: '#F3F4F6',
        },
        
        // Surface and border colors
        surface: {
          DEFAULT: '#1E293B',
          light: '#334155',
        },
        border: {
          DEFAULT: '#475569',
          light: '#64748B',
        },
        
        // Text colors
        'text-secondary': '#94A3B8',
        'text-muted': '#64748B',
        
        // Dark mode colors
        'dark-background': '#0F172A',
        'dark-foreground': '#F8FAFC',
        'dark-surface': '#1E293B',
        'dark-border': '#334155',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(37, 99, 235, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
