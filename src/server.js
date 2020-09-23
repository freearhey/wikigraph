import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import schema from './schema.js'

const app = express()
const port = 4000

app.use(
  '/graph',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
