import { graphqlHTTP } from 'express-graphql'
import express from 'express'
import schema from './schema.js'

const app = express()
const port = process.env.PORT || 4000

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

app.listen(port, err => {
  if (err) throw err
  console.log(`> Server is running at 'http://localhost:${port}'`)
})

module.exports = app
