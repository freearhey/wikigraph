import json from '@rollup/plugin-json'
import run from '@rollup/plugin-run'

const dev = process.env.NODE_ENV !== 'production'

export default {
  input: 'src/server.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [json(), dev && run()],
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
