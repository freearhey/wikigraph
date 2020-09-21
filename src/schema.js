import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'

import EntityType from './types/entity.js'
import wiki from './client.js'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: `The query root, from which multiple types of Wikidata
requests can be made.`,
    fields: () => ({
      entity: {
        type: EntityType,
        args: {
          id: { type: GraphQLString },
          lang: { type: GraphQLString }
        },
        resolve: (_, { id, lang }) => {
          let key = `${id}_${lang}`
          return wiki.load(key)
        }
      }
    })
  })
})
