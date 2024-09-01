import type { Config } from 'tailwindcss';

const flowbite = require('flowbite-react/tailwind');

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', flowbite.content()],
  theme: {
    colors: {
      gold: '#B88E2F',
      primary: {
        50: '#0176d2',
        100: '#016ec4',
        200: '#0166b6',
        300: '#015ea8',
        400: '#01569a',
        500: '#041173',
        600: '#061174',
        700: '#003f70',
        800: '#003762',
        900: '#0A0E32'
      },
      gray: {
        50: '#fafafa',
        100: '#f8f8fa',
        200: '#e8e8eb',
        300: '#d6d9e4',
        400: '#bdc0c9',
        500: '#95979e',
        600: '#6c6e73',
        700: '#545559',
        800: '#3c3d40',
        900: '#18181a'
      }
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
