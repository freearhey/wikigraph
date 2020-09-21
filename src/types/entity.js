import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLUnionType
} from 'graphql'

import { remove as removeDiacritics } from 'diacritics'
import config from '../config.json'

// TODO: add qualiter/reference
// sometimes the property have values too:
// for example, spouse (P26) can also have start time, end time qualifiter
// And they all can have multiple references
const PropertyValueType = new GraphQLObjectType({
  name: 'PropertyValue',
  description: `A peroperty's value`,
  fields: () => ({ type: WikiDataValueType })
})

let EntityType = null

const WikiDataStringType = new GraphQLObjectType({
  name: 'WikiDataString',
  description: `Just string`,
  fields: () => ({
    value: {
      type: GraphQLString,
      resolve(obj) {
        return obj
      }
    }
  })
})

// TODO: maybe the most complex data type
// see https://www.wikidata.org/wiki/Special:ListDatatypes
// Because of the property can have different type of value
// for example, date of birth (P569) is should be a datetime object
const WikiDataValueType = new GraphQLUnionType({
  name: 'WikiDataValue',
  description: `An wikidata value type`,
  types: [EntityType, WikiDataStringType],
  resolveType(value) {
    if (typeof value == 'string') {
      return WikiDataStringType
    }
    // fallback to entity type, need more detail
    return EntityType
  }
})

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

const _generateNamedPropertyList = () => {
  let fields = {}
  config.property.forEach(({ property, label, datatype }) => {
    const fieldName = _genFieldNameByLabel(label)
    fields[fieldName] = {
      type: GraphQLString
    }
  })

  return fields
}

EntityType = new GraphQLObjectType({
  name: 'Entity',
  description: `Wikidata entity.`,
  fields: () =>
    Object.assign(
      {
        id: {
          description: `Wikidata's item id, for exampe Q42.`,
          type: GraphQLString
        },
        label: {
          type: GraphQLString,
          args: {
            lang: {
              name: 'lang',
              type: new GraphQLNonNull(GraphQLString)
            }
          }
        }
      },
      _generateNamedPropertyList()
    )
})

export default EntityType
