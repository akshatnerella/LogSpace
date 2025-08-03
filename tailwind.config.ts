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
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Background colors
        background: 'hsl(222 14% 8%)', // #0f0f14
        surface: 'hsl(222 14% 11%)', // #1a1a20
        'surface-light': 'hsl(222 14% 14%)', // #21212a
        'surface-hover': 'hsl(222 14% 14%)', // #21212a
        input: 'hsl(222 14% 16%)', // #252530
        hover: 'hsl(222 14% 14%)', // #21212a
        
        // Text colors
        foreground: 'hsl(210 20% 95%)', // #f1f3f5
        'text-secondary': 'hsl(215 15% 70%)', // #9ca3af
        'text-muted': 'hsl(215 15% 50%)', // #6b7280
        'muted-foreground': 'hsl(215 15% 70%)', // #9ca3af
        
        // Brand colors
        primary: {
          DEFAULT: 'hsl(265 85% 65%)', // #8b5cf6
          hover: 'hsl(265 85% 60%)', // #7c3aed
        },
        accent: {
          DEFAULT: 'hsl(285 85% 65%)', // #a855f7
          hover: 'hsl(285 85% 60%)', // #9333ea
        },
        
        // UI colors
        border: 'hsl(222 14% 18%)', // #2a2a35
        'border-hover': 'hsl(222 14% 25%)', // #3a3a45
        'border-light': 'hsl(222 14% 25%)', // #3a3a45
      },
      fontSize: {
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
