const production = !process.env.ROLLUP_WATCH;

let plugins = {
  autoprefixer: {},
};

if (production) {
  plugins = {
    ...plugins,
    tailwindcss: {},
  };
} else {
  plugins = {
    ...plugins,
    "@tailwindcss/jit": {},
  };
}

module.exports = {
  plugins,
};
