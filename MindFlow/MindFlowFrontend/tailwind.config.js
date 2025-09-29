/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "#ffffffff",
        "french-gray": "#b2b6baff",
        jet: "#3a3a3aff",
        black: "#000000ff",
        "golden-gate-bridge": "#f04a00ff",
      }
    }
  },
  plugins: [],
}