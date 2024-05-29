/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    flowbite.content(),
  ],
  theme: {
   
    extend: {},
  },
  plugins: [require("daisyui"),
  flowbite.plugin(),
  ],
}
