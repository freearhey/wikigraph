import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import EntityType from './types/entity.js'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      entity: {
        type: EntityType,
        args: {
          id: { type: GraphQLString },
          lang: { type: GraphQLString, defaultValue: 'en' }
        },
        resolve: (_, args) => args
      }
    })
  })
})
