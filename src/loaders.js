import axios from 'axios'
import DataLoader from 'dataloader'
import queryBuilder from './queryBuilder.js'
import wdk from 'wikidata-sdk'

const entityLoader = new DataLoader(keys => {
  const args = keys[0].split('.')
  let id = args[0]
  let lang = args[1]
  return getItemById(id, lang)
})

const propertyLoader = keys => {
  const args = keys.split('.')
  let entityId = args[0]
  let propName = args[1]
  let lang = args[2]
  return getPropByName(entityId, propName, lang)
}

const getPropByName = (entityId, propName, lang = 'en') => {
  const sparql = queryBuilder.property(entityId, propName, lang)
  const data = 'query=' + encodeURI(sparql)

  return axios
    .post('https://query.wikidata.org/sparql', data)
    .then(function (response) {
      return response.data.results.bindings[0]
    })
    .then(data => {
      const value = data[propName].value || null
      return value
    })
}

const getItemById = (id, lang = 'en') => {
  const url = wdk.getEntities(id, lang, ['labels'], 'json')

  return axios
    .get(url)
    .then(function (response) {
      return response.data.entities[id]
    })
    .then(data => {
      return [
        {
          id: data.id,
          label: data.labels[lang].value,
          lang
        }
      ]
    })
}

export { entityLoader, propertyLoader }
