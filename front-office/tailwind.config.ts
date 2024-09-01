import type { Config } from 'tailwindcss';
const flowbite = require('flowbite-react/tailwind');

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    colors: {
      gold: '#B88E2F'
    },
    extend: {
      gridTemplateRows: {
        '[auto,auto,1fr]': 'auto auto 1fr'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [require('flowbite/plugin'), require('tailwindcss-animated'), flowbite.plugin(), require('@tailwindcss/aspect-ratio')]
};
export default config;
