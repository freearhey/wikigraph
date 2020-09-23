import { GraphQLObjectType, GraphQLString } from 'graphql'
import properties from '../properties.json'
import { propertyLoader } from '../loaders.js'

const _generateNamedPropertyList = () => {
  let fields = {}
  for (let propName of Object.values(properties)) {
    fields[propName] = {
      type: GraphQLString,
      resolve: obj => {
        let key = `${obj.id}.${propName}.${obj.lang}`
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
          type: GraphQLString
        }
      },
      _generateNamedPropertyList()
    )
})
