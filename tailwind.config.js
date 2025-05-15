/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff2ff',
          100: '#e1e6ff',
          200: '#c8d0ff',
          300: '#a5afff',
          400: '#8483ff',
          500: '#6a59ff',
          600: '#4F46E5', // Primary
          700: '#4430c5',
          800: '#3829a0',
          900: '#32297f',
          950: '#1d1647',
        },
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0D9488', // Secondary
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F59E0B', // Accent
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        success: {
          500: '#10B981', // Success
        },
        warning: {
          500: '#FBBF24', // Warning
        },
        error: {
          500: '#EF4444', // Error
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'slide-out': 'slideOut 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(10px)', opacity: 0 },
        },
      },
      boxShadow: {
        'task-card': '0 2px 10px rgba(0, 0, 0, 0.08)',
        'task-card-hover': '0 4px 20px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};