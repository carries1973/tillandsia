import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f7f6f1',
        card: '#ffffff',
        ink: '#1f2a23',
        'ink-soft': '#5d6b60',
        green: { DEFAULT: '#3f7d52', deep: '#2c5c3b', tint: '#e6f0e4' },
        // care-group accent hues
        bulbous: '#caa45a',
        rosette: '#5aa9c9',
        xeric: '#b08bbf',
        wispy: '#d4a98f',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '26px',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(31,42,35,.10), 0 2px 6px rgba(31,42,35,.06)',
      },
    },
  },
  plugins: [],
};

export default config;
