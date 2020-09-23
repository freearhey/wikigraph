import axios from 'axios'
import wdk from 'wikidata-sdk'
import DataLoader from 'dataloader'
import queryBuilder from './queryBuilder.js'

const entityLoader = new DataLoader(async keys => {
  let values = []

  for (let key of keys) {
    const args = key.split('.')
    let value = await getItemById(args[0], args[1])
    values.push(value)
  }

  return values
})

const propertyLoader = new DataLoader(async keys => {
  let values = []

  for (let key of keys) {
    const args = key.split('.')
    let value = await getPropByName(args[0], args[1], args[2])
    values.push(value)
  }

  return values
})

const getPropByName = (entityId, propName, lang = 'en') => {
  const sparql = queryBuilder.property(entityId, propName, lang)
  const data = 'query=' + encodeURI(sparql)

  return axios
    .post('https://query.wikidata.org/sparql', data)
    .then(function (response) {
      return response.data.results.bindings[0]
    })
    .then(data => {
      return data[propName] && data[propName].value ? data[propName].value : null
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
      return {
        id: data.id,
        label: data.labels[lang] ? data.labels[lang].value : null,
        lang
      }
    })
}

export { entityLoader, propertyLoader }
