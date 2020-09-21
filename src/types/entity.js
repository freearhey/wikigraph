import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql'

import { remove as removeDiacritics } from 'diacritics'
import config from '../config.json'

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

const _generateNamedPropertyList = () => {
  let fields = {}
  config.property.forEach(({ property, label, datatype }) => {
    const fieldName = _genFieldNameByLabel(label)
    fields[fieldName] = {
      type: new GraphQLList(GraphQLString)
    }
  })

  return fields
}

const _genFieldNameByLabel = label => {
  // genertate property name
  // maximum frequency of audible sound =>  maximum_frequency_of_audible_sound

  // remove some diacritics as in https://www.wikidata.org/wiki/Property:P380
  let newLabel = removeDiacritics(label)

  newLabel = newLabel
    .toLowerCase()
    .replace(/[,()\/\.]/g, '')
    .replace(/[-–]/g, '_') // https://www.wikidata.org/wiki/Property:P2170
    .replace(/[']/g, '_')
    .replace(/[:]/g, '_')
    .replace(/[+]/g, '_')
    .replace(/[&]/g, '_')
    .replace(/[!]/g, '_')

  // https://www.wikidata.org/wiki/Property:P3605
  if (!isNaN(newLabel[0])) {
    newLabel = `p_${newLabel}`
  }
  return newLabel.split(' ').join('_')
}
