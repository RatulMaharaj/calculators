import daisyui from "daisyui";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat Variable", ...defaultTheme.fontFamily.sans],
        serif: ["Schoolbell", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["garden"],
  },
};
