/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 inspired colors
        primary: '#0b57d0',
        'primary-container': '#d3e3fd',
        'on-primary-container': '#041e49',
        secondary: '#00639b',
        'secondary-container': '#cce5ff',
        'on-secondary-container': '#001d31',
        tertiary: '#146c2e',
        'tertiary-container': '#c4eed0',
        'on-tertiary-container': '#002106',
        error: '#b3261e',
        'error-container': '#f9dedc',
        'on-error-container': '#410e0b',
        background: '#fef7ff',
        'on-background': '#1d1b20',
        surface: '#fef7ff',
        'on-surface': '#1d1b20',
        'surface-variant': '#e7e0ec',
        'on-surface-variant': '#49454f',
        outline: '#79747e',
        'outline-variant': '#cac4d0',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
