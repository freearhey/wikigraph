import axios from 'axios'
import DataLoader from 'dataloader'
import queryBuilder from './queryBuilder.js'

const entityLoader = new DataLoader(keys => {
  return getItemById(keys)
})

const propertyLoader = new DataLoader(keys => {
  return getPropByName(keys)
})

const getPropByName = keys => {
  let entityIds = {}
  let propNames = {}
  let lang = keys[0].split('.')[1]
  keys.forEach(key => {
    let [entityId, _, propName] = key.split('.')
    entityIds[entityId] = true
    propNames[propName] = true
  })

  const sparql = queryBuilder.property(Object.keys(entityIds), Object.keys(propNames), lang)
  const data = 'query=' + encodeURI(sparql)

  return axios
    .post('https://query.wikidata.org/sparql', data)
    .then(function (response) {
      return response.data.results.bindings
    })
    .then(entities => {
      return keys.map(key => {
        let [entityId, lang, propName] = key.split('.')
        let entity = entities.find(item => item.entity.value.indexOf(entityId) > -1)
        let value =
          entity[propName] && entity[propName].value ? entity[propName].value.split(', ') : null

        return value
      })
    })
}

const getItemById = keys => {
  let ids = []
  let lang = keys[0].split('.')[1]
  keys.forEach(key => {
    let id = key.split('.')[0]
    ids.push(id)
  })

  const props = ['labels', 'descriptions', 'aliases', 'sitelinks/urls']
  const url = `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&ids=${ids.join(
    '|'
  )}&languages=${lang}&sitefilter=${lang}wiki&props=${props.join('|')}`

  return axios
    .get(url)
    .then(response => response.data.entities)
    .then(entities => {
      return keys.map(key => {
        let [entityId, lang] = key.split('.')
        let data = entities[entityId]
        return {
          id: data.id,
          label: data.labels[lang] ? data.labels[lang].value : null,
          description: data.descriptions[lang] ? data.descriptions[lang].value : null,
          aliases: data.aliases[lang] ? data.aliases[lang].map(i => i.value) : null,
          wiki_url: data.sitelinks[`${lang}wiki`] ? data.sitelinks[`${lang}wiki`].url : null,
          lang
        }
      })
    })
}

export { entityLoader, propertyLoader }
