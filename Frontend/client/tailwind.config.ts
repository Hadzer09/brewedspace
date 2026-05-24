import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brew-dark': '#1A120B',   // Hitam Kopi Tua
        'brew-brown': '#3C2A21',  // Cokelat Espresso
        'brew-tan': '#D5CEA3',    // Krem/Emas Pucat
        'brew-cream': '#E5E5CB',  // Background Hangat
      },
    },
  },
  plugins: [],
};
export default config;