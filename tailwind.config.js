/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFDF0',
        canvasMuted: '#F4F1DE',
        brutalYellow: '#FEF08A',
        brutalPink: '#FF2A85',
        brutalLime: '#A3E635',
        brutalViolet: '#8B5CF6',
        brutalCyan: '#00F0FF',
        brutalAmber: '#FFE600',
        brutalDark: '#0A0A0A',
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '6px 6px 0px 0px #000000',
        'brutal-xl': '8px 8px 0px 0px #000000',
        'brutal-pink': '4px 4px 0px 0px #FF2A85',
        'brutal-lime': '4px 4px 0px 0px #A3E635',
        'brutal-violet': '4px 4px 0px 0px #8B5CF6',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
