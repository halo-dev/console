module.exports = {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {}
  },
  corePlugins: {
    preflight: false
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
}
