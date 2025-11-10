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
        highBg: '#FDD7D7',
        highText: '#F63737',
        mediumBg: '#FFF1CC',
        mediumText: '#FFB700',
        lowBg: '#D2F1F1',
        lowText: '#1CBABA',
        powderBlue: "#7284BE",
        columbiaBlue: "#71A5E9",
        jordyBlue: "#8FB9E1",
        azure: "#DAF0F7",
      }
    }
  },
  plugins: [],
}