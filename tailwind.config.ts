import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        earth: {
          50: '#f7f6f3',
          100: '#efede7',
          200: '#ddd9cf',
          300: '#c7c0b0',
          400: '#b1a590',
          500: '#9e8c73',
          600: '#8a7860',
          700: '#726250',
          800: '#5e5244',
          900: '#4d443a',
        },
        sakura: {
          50: '#fef7f7',
          100: '#feeaea',
          200: '#fdd8d3',
          300: '#fbb9b2',
          400: '#f79391',
          500: '#f26e6e',
          600: '#e53e3e',
          700: '#c53030',
          800: '#9b2c2c',
          900: '#742a2a',
        },
        bamboo: {
          50: '#f7fdf4',
          100: '#ecfae6',
          200: '#d3f2c4',
          300: '#b0e79f',
          400: '#84d65a',
          500: '#65c832',
          600: '#4ba524',
          700: '#3f7b21',
          800: '#365e20',
          900: '#2f4f1e',
        }
      },
      fontFamily: {
        'zen': ['Inter', 'Noto Sans JP', 'system-ui', 'sans-serif'],
        'heading': ['Playfair Display', 'Noto Sans JP', 'serif'],
        'japanese': ['Noto Sans JP', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'zen': '1.618rem', // Golden ratio spacing
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
                 glow: {
           '0%': { 'box-shadow': '0 0 20px rgba(158, 140, 115, 0.1)' },
           '100%': { 'box-shadow': '0 0 30px rgba(158, 140, 115, 0.2)' },
         },
      },
    },
  },
  plugins: [],
}
export default config 