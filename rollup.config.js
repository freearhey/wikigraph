import json from '@rollup/plugin-json'

export default {
  input: 'src/server.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [json()]
}
