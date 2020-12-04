import { graphqlHTTP } from 'express-graphql'
import express from 'express'
import cors from 'cors'
import schema from './schema.js'

const port = process.env.PORT || 4000
const app = express()

app.use(cors())
app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }))

app.listen(port, err => {
  if (err) throw err
  console.log(`> Server is running at http://localhost:${port}`)
})

module.exports = app
