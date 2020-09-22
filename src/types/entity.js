import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'
import properties from '../properties.json'

const _generateNamedPropertyList = () => {
  let fields = {}
  for (let propName of Object.values(properties)) {
    fields[propName] = {
      type: new GraphQLList(GraphQLString)
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
        }
      },
      _generateNamedPropertyList()
    )
})
