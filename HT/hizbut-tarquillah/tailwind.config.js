/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ht: {
          page: '#FFFFFF',
          card: '#FFFFFF',
          mist: '#F0F7F3',
          mint: '#DCEDE2',
          mintDeep: '#BFE0CD',
          sage: '#6D9E84',
          fern: '#2D8660',
          emerald: '#165B3C',
          emeraldDark: '#0E422A',
          emeraldDeep: '#082C1B',
          ink: '#0F1A13',
          inkSoft: '#5A6F62',
          inkMuted: '#8E9E95',
          line: '#E3EBE6',
          lineLight: '#F0F5F2',
          amber: '#D97706',
          amberLight: '#FEF3C7',
          amberDark: '#92400E',
          clay: '#DC2626',
          clayLight: '#FEE2E2',
          clayDark: '#991B1B',
          gold: '#C59B27',
          goldLight: '#FCF7E6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        serif: ['"Cinzel"', 'serif'],
        arabic: ['"Amiri"', '"Reem Kufi"', 'serif'],
        calligraphy: ['"Aref Ruqaa"', '"Amiri"', 'serif'],
      },
      boxShadow: {
        'soft-xs': '0 1px 3px 0 rgba(16, 91, 60, 0.04), 0 1px 2px -1px rgba(16, 91, 60, 0.02)',
        'soft': '0 4px 20px -2px rgba(16, 91, 60, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 12px 32px -4px rgba(16, 91, 60, 0.09), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'soft-xl': '0 20px 40px -6px rgba(16, 91, 60, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.04)',
        'glow-emerald': '0 0 24px -4px rgba(22, 91, 60, 0.25)',
        'glow-amber': '0 0 24px -4px rgba(217, 119, 6, 0.25)',
        'glow-gold': '0 0 30px -4px rgba(212, 160, 56, 0.4)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
      }
    },
  },
  plugins: [],
}
