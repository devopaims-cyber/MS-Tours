/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#00C853',
          orange: '#FF6D00',
          sky: '#00B0FF',
          violet: '#7C4DFF',
          rose: '#FF4081',
          mint: '#69F0AE',
        },
        navy: {
          DEFAULT: '#1A1A2E',
          50: '#2D2D4A',
          100: '#252540',
          200: '#1F1F38',
          300: '#191930',
          400: '#14142A',
          500: '#1A1A2E',
          600: '#0F0F1F',
          700: '#0A0A14',
        },
        cream: {
          DEFAULT: '#FFF8E1',
          50: '#FFFEFA',
          100: '#FFFCF2',
          200: '#FFFAEB',
          300: '#FFF8E1',
          400: '#FFF1C7',
          500: '#FFEAA0',
        },
      },
      fontFamily: {
        fredoka: ['"Fredoka"', 'system-ui', 'sans-serif'],
        inter: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 4px 14px rgba(26, 26, 46, 0.08)',
        'card-lift': '0 14px 32px rgba(26, 26, 46, 0.15)',
        'retro': '4px 4px 0 0 #1A1A2E',
        'retro-green': '4px 4px 0 0 #00C853',
        'retro-orange': '4px 4px 0 0 #FF6D00',
        'retro-violet': '4px 4px 0 0 #7C4DFF',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'plane-orbit': {
          '0%': { transform: 'rotate(0deg) translateX(70px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(70px) rotate(-360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'plane-orbit': 'plane-orbit 6s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
