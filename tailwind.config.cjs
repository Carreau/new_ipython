/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        // IPython Modern Brand - Blue & Green
        'ipython': {
          'blue': '#0D5C63',       // Primary teal blue
          'cyan': '#008B95',       // Cyan accent
          'green': '#059669',      // Green accent
          'dark': '#0F172A',       // Dark background
          'slate': '#1E293B',      // Slate background
          'light': '#F0FDFA',      // Light background
        },
        // Semantic colors
        'success': '#059669',
        'warning': '#D97706',
        'error': '#DC2626',
        'info': '#008B95',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
      },
      maxWidth: {
        '7xl': '80rem',
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
};
