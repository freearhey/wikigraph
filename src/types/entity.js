import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'
import { propertyLoader } from '../loaders.js'
import wdProps from '../wikidata-properties/index.js'

const _generateNamedPropertyList = () => {
  let fields = {}
  for (let prop of wdProps.all()) {
    fields[prop.slug] = {
      type: new GraphQLList(GraphQLString),
      resolve: entity => {
        return propertyLoader.load(JSON.stringify([entity.id, entity.lang, prop.slug]))
      }
    }
  }

  return fields
}

export default new GraphQLObjectType({
  name: 'Entity',
  description: `Wikidata entity.`,
  fields: () =>
    Object.assign(
      {
        id: {
          type: GraphQLString
        },
        lang: {
          type: GraphQLString
        },
        label: {
          type: GraphQLString
        },
        description: {
          type: GraphQLString
        },
        aliases: {
          type: new GraphQLList(GraphQLString)
        }
      },
      _generateNamedPropertyList()
    )
})
