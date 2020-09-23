import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import { entityLoader } from './loaders.js'
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
        resolve: (_, { id, lang }) => {
          let key = `${id}.${lang}`
          return entityLoader.load(key)
        }
      }
    })
  })
})
