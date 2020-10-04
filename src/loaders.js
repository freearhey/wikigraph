import axios from 'axios'
import DataLoader from 'dataloader'
import queryBuilder from './queryBuilder.js'
import wdProps from './wikidata-properties/index.js'

const entityLoader = new DataLoader(keys => {
  keys = keys.map(JSON.parse)
  return getEntityById(keys)
})

const propertyLoader = new DataLoader(keys => {
  keys = keys.map(JSON.parse)
  return getPropByName(keys)
})

const getEntityById = keys => {
  let entityIds = {}
  let lang = keys[0][1]
  keys.forEach(key => {
    let [entityId, _] = key
    entityIds[entityId] = true
  })

  const params = {
    action: 'wbgetentities',
    ids: Object.keys(entityIds).join('|'),
    languages: lang.split(',').join('|'),
    props: ['aliases', 'descriptions', 'labels', 'sitelinks/urls'].join('|'),
    format: 'json',
    sitefilter: `${lang}wiki`
  }

  return axios
    .get('https://www.wikidata.org/w/api.php', { params })
    .then(response => response.data.entities)
    .then(entities => {
      if (!entities) return []

      return keys.map(key => {
        let [id, lang] = key
        return {
          id,
          lang,
          label: entities[id].labels[lang].value,
          description: entities[id].descriptions[lang].value,
          sitelink: entities[id].sitelinks[`${lang}wiki`].url,
          aliases: entities[id].aliases[lang].map(i => i.value)
        }
      })
    })
}

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

export { entityLoader, propertyLoader }
