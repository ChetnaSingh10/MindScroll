/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: {
          DEFAULT: 'var(--surface)',
          2: 'var(--surface-2)',
        },
        line: 'var(--line)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          fg: 'var(--accent-fg)',
          soft: 'var(--accent-soft)',
        },
        status: {
          good: 'var(--status-good)',
          'good-soft': 'var(--status-good-soft)',
          moderate: 'var(--status-moderate)',
          'moderate-soft': 'var(--status-moderate-soft)',
          attention: 'var(--status-attention)',
          'attention-soft': 'var(--status-attention-soft)',
          concern: 'var(--status-concern)',
          'concern-soft': 'var(--status-concern-soft)',
        },
        chart: {
          accent: 'var(--chart-accent)',
          teal: 'var(--chart-teal)',
          grey: 'var(--chart-grey)',
          grid: 'var(--chart-grid)',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}
