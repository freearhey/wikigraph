import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql'
import { entityLoader, searchLoader } from './loaders.js'
import EntityType from './types/entity.js'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      entity: {
        type: EntityType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The IDs of the entities to get the data from.'
          },
          lang: {
            type: GraphQLString,
            defaultValue: 'en',
            description: 'Language to use for property values.'
          }
        },
        resolve: (_, args) => entityLoader.load(JSON.stringify(Object.values(args)))
      },
      search: {
        type: new GraphQLList(EntityType),
        args: {
          query: { type: new GraphQLNonNull(GraphQLString), description: 'Search for this text.' },
          lang: {
            type: GraphQLString,
            defaultValue: 'en',
            description: 'Language to use for property values.'
          },
          first: {
            type: GraphQLInt,
            defaultValue: 10,
            description: 'Maximal number of results.'
          },
          offset: {
            type: GraphQLInt,
            defaultValue: 0,
            description: 'Offset where to continue a search.'
          }
        },
        resolve: (_, args) => searchLoader.load(JSON.stringify(Object.values(args)))
      }
    })
  })
})
