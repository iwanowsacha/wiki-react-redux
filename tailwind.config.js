module.exports = {
  purge: ['./src/**/*/*.tsx'],
  darkMode: false, // or 'media' or 'class',
  important: true,
  theme: {
    extend: {
      colors: {
        primary: '#1E1E1E',
        secondary: '#2E2E2E',
        inverse: '#979797',
        select: '#BB86FC',
      },
      textColor: {
        primary: '#BB86FC',
        secondary: '#979797',
        inverse: '#2E2E2E',
        hover: '#D2B7F3',
      },
      borderColor: {
        primary: '#BB86FC',
        secondary: '#979797',
      },
      height: {
        'p-75': '75%',
      },
      zIndex: {
        '--1': '-1',
        100: '100',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
