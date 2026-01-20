import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Tremor module
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // UIDAI Official Brand Colors
        uidai: {
          navy: '#1a4480',
          'navy-dark': '#0d2240',
          'navy-light': '#2563a8',
          saffron: '#f26522',
          'saffron-dark': '#d4541a',
          'saffron-light': '#ff8a50',
          green: '#2e7d32',
          'green-dark': '#1b5e20',
          'green-light': '#4caf50',
        },
        // Custom palette
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#0F172A',
          card: '#FFFFFF',
          'card-dark': '#1E293B',
        },
        accent: {
          success: '#2e7d32',
          warning: '#f26522',
          danger: '#EF4444',
          info: '#1a4480',
        }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-cal-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(242, 101, 34, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(242, 101, 34, 0.8), 0 0 30px rgba(26, 68, 128, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'uidai-gradient': 'linear-gradient(135deg, #f26522 0%, #1a4480 100%)',
        'uidai-gradient-dark': 'linear-gradient(135deg, #d4541a 0%, #0d2240 100%)',
      },
      boxShadow: {
        'glow-saffron': '0 0 20px rgba(242, 101, 34, 0.3)',
        'glow-navy': '0 0 20px rgba(26, 68, 128, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

export default config
