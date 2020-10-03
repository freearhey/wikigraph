import { GraphQLObjectType, GraphQLString } from 'graphql'

export default new GraphQLObjectType({
  name: 'Value',
  description: `Entity property value.`,
  fields: () => {
    return {
      type: {
        type: GraphQLString
      },
      value: {
        type: GraphQLString
      },
      statement: {
        type: GraphQLString
      }
    }
  }
})
