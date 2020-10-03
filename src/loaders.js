import axios from 'axios'
import DataLoader from 'dataloader'
import queryBuilder from './queryBuilder.js'
import wdProps from './wikidata-properties/index.js'

const propertyLoader = new DataLoader(keys => {
  return getPropByName(keys)
})

const getPropByName = keys => {
  let entityIds = {}
  let propNames = {}
  let lang = keys[0][1]
  keys.forEach(key => {
    let [entityId, _, propName] = key
    entityIds[entityId] = true
    propNames[propName] = true
  })

  let propIds = Object.keys(propNames)
    .map(name => {
      const prop = wdProps.find(name)

      return prop ? prop.id : null
    })
    .filter(p => p)

  if (!propIds.length) return keys.map(key => new Error(`No result for ${key}`))

  const sparql = queryBuilder.property(Object.keys(entityIds), propIds, lang)
  const data = 'query=' + encodeURI(sparql)

  // console.log(sparql)

  return axios
    .post('https://query.wikidata.org/sparql', data)
    .then(function (response) {
      return response.data.results.bindings
    })
    .then(entities => {
      // console.log(entities)
      return keys.map(key => {
        let [entityId, lang, propName] = key
        let prop = wdProps.find(propName)
        let items = entities.filter(
          item => item.entity.value.indexOf(entityId) > -1 && item.prop.value.indexOf(prop.id) > -1
        )

        return items.map(item => item.value.value)
      })
    })
}

export { propertyLoader }
