// tailwind.chamfer.plugin.js
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function ({ matchUtilities, theme }) {
  // Sharp chamfer
  matchUtilities(
    {
      'chamfer-tr': (value) => ({
        clipPath: `polygon(0 0, calc(100% - ${value}) 0, 100% ${value}, 100% 100%, 0 100%)`,
      }),
    },
    { values: theme('spacing'), type: 'length' }
  );

  // Soft chamfer
  matchUtilities(
    {
      'chamfer-tr-soft': (value) => ({
        clipPath: `path("M0 0 H calc(100% - ${value}) Q 100% 0, 100% ${value} V 100% H 0 Z")`,
      }),
    },
    { values: theme('spacing'), type: 'length' }
  );
});
