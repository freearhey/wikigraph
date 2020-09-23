import { graphqlHTTP } from 'express-graphql'
import express from 'express'
import schema from './schema.js'

const app = express()
const port = 4000

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
