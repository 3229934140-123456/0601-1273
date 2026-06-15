/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#FFF5ED',
          100: '#FFE8D6',
          200: '#FFD0AD',
          300: '#FFB37A',
          400: '#FF9A52',
          500: '#FF8C42',
          600: '#F5700F',
          700: '#CC5A08',
          800: '#A14708',
          900: '#7A3608',
        },
        secondary: {
          50: '#EDF5F0',
          100: '#D5E8DC',
          200: '#A9D1B9',
          300: '#78B792',
          400: '#529E72',
          500: '#2D6A4F',
          600: '#235340',
          700: '#1B4031',
          800: '#143025',
          900: '#0E2119',
        },
        warm: {
          50: '#FFFBF7',
          100: '#FFF9F2',
          200: '#FFF0E0',
          300: '#FFE4CC',
          400: '#FFD6B3',
          500: '#FFC799',
        },
      },
      fontFamily: {
        serif: ['"Source Han Serif SC"', '"Noto Serif SC"', 'serif'],
        sans: ['Inter', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px rgba(255, 140, 66, 0.1)',
        'warm-lg': '0 8px 30px rgba(255, 140, 66, 0.15)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
