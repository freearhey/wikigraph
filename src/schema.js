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
    description: `The query root of Wikidata's GraphQL interface.`,
    fields: () => ({
      entity: {
        type: EntityType,
        description: `Lookup an entity by ID.`,
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
        description: `Searches for entities using labels.`,
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
