/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['BandaRegular', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        banda: ['BandaRegular', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: ['BandaRegular', 'sans-serif'],
              fontWeight: '700',
            },
            h2: {
              fontFamily: ['BandaRegular', 'sans-serif'],
              fontWeight: '700',
            },
            h3: {
              fontFamily: ['BandaRegular', 'sans-serif'],
              fontWeight: '600',
            },
            h4: {
              fontFamily: ['BandaRegular', 'sans-serif'],
              fontWeight: '600',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'cyberpunk', 'synthwave'],
    styled: true,
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: '',
    darkTheme: 'dark',
  },
};
