/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: "#090C10",
          surface: "#0E121A",
          card: "#161B26",
          elevated: "#1D2332",
          border: "#232A3B",
          borderStrong: "#323B52",
          red: "#E50914",
          redHover: "#F41E2A",
          redActive: "#C10711",
          text: "#FFFFFF",
          textMuted: "#94A3B8",
          textDim: "#64748B",
        }
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'solid': '0 2px 8px rgba(0, 0, 0, 0.45)',
        'elevated': '0 10px 25px rgba(0, 0, 0, 0.65)',
      }
    },
  },
  plugins: [],
}
