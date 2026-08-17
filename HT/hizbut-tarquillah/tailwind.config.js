/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ht: {
          page: '#F7FBF8',
          card: '#FFFFFF',
          mist: '#EFF6F1',
          mint: '#DCEEE2',
          mintDeep: '#C3E3D0',
          sage: '#7FAE94',
          fern: '#3F9270',
          emerald: '#1F6B4B',
          emeraldDark: '#1F5E43',
          ink: '#16241C',
          inkSoft: '#66796E',
          line: '#E6EFEA',
          amber: '#C08A3E',
          amberLight: '#FEF8EC',
          clay: '#C06152',
          clayLight: '#FDF3F2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(31, 107, 75, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 30px -4px rgba(31, 107, 75, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
