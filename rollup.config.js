import json from '@rollup/plugin-json'

export default {
  input: 'src/server.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [json()],
  external: [
    'axios',
    'dataloader',
    'express',
    'express-graphql',
    'graphql',
    'numeral',
    '@sindresorhus/slugify'
  ]
}
