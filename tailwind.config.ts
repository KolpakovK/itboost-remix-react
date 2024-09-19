import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  prefix: "",
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx,mdx}","@/components/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily:{
        'sans':['IBM Plex Sans', 'system-ui'],
        'display':['Dela Gothic One', 'system-ui'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      colors:{
        'green': {
          '50': '#f1fce9',
          '100': '#e0f8cf',
          '200': '#c3f1a5',
          '300': '#9de670',
          '400': '#7ad645',
          '500': '#5abc26',
          '600': '#43961a',
          '700': '#357219',
          '800': '#2d5b19',
          '900': '#294d1a',
          '950': '#112a09',
        },
        'violet': {
          '50': '#f4f2ff',
          '100': '#ebe8ff',
          '200': '#d9d4ff',
          '300': '#bfb1ff',
          '400': '#9f85ff',
          '500': '#7d4fff',
          '600': '#7030f7',
          '700': '#621ee3',
          '800': '#5218bf',
          '900': '#44169c',
          '950': '#290b6a',
      },
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
