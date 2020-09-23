import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'
import properties from '../properties.json'
import { propertyLoader } from '../loaders.js'

const _generateNamedPropertyList = () => {
  let fields = {}
  for (let propName of Object.values(properties)) {
    fields[propName] = {
      type: new GraphQLList(GraphQLString),
      resolve: obj => {
        let key = `${obj.id}.${obj.lang}.${propName}`
        return propertyLoader.load(key)
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
