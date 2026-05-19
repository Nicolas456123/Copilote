/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: '#3D405B',
        coral: '#E07A5F',
        sage: '#81B29A',
        sand: '#F2CC8F',
        cream: '#FFF8F0',
        surface: '#FFFFFF',
        'surface-2': '#F5F2EE',
        'surface-3': '#FAFAFA',
        ink: '#3D405B',
        'ink-muted': '#6B7280',
        'ink-soft': '#9CA3AF',
        line: '#E5E7EB',
        'line-soft': '#F3F4F6',
      },
      fontFamily: {
        nunito: ['Nunito_400Regular'],
        'nunito-bold': ['Nunito_700Bold'],
        'nunito-black': ['Nunito_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
