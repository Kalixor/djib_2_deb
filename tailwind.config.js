module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mona Sans', 'sans-serif'],
      },
      colors: {
        back: {
          DEFAULT: '#081028'
        },
        brand: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5b8fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#081028',
          900: '#060c1f',
          950: '#040817',
        },
        card: {
          DEFAULT: '#0b1739',
          text: '#aeb9e1',
        },
        pastel: {
          yellow: '#fffef2',
        },
      },
      keyframes: {
        'bounce-in': {
          '0%': { 
            transform: 'scale(0.8)', 
            opacity: '0' 
          },
          '40%': { 
            transform: 'scale(1.15)', 
            opacity: '1' 
          },
          '60%': { 
            transform: 'scale(0.95)' 
          },
          '80%': { 
            transform: 'scale(1.05)' 
          },
          '100%': { 
            transform: 'scale(1)' 
          },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
