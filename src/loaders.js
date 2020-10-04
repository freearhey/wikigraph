import axios from 'axios'
import numeral from 'numeral'
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
  // console.log(keys)
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

  // console.log(params)

  return axios
    .get('https://www.wikidata.org/w/api.php', { params })
    .then(response => response.data.entities)
    .then(entities => {
      //console.log(entities)
      if (!entities) return []

      return keys.map(key => {
        const [id, lang] = key
        const label = entities[id]['labels'][lang] ? entities[id]['labels'][lang].value : null
        const description = entities[id]['descriptions'][lang]
          ? entities[id]['descriptions'][lang].value
          : null
        const sitelink = entities[id]['sitelinks'][`${lang}wiki`]
          ? entities[id]['sitelinks'][`${lang}wiki`].url
          : null
        const aliases =
          entities[id]['aliases'][lang] && entities[id]['aliases'][lang].length
            ? entities[id]['aliases'][lang].map(i => i.value)
            : []

        return { id, lang, label, description, sitelink, aliases }
      })
    })
}

const getPropByName = keys => {
  // console.log(keys)
  const args = keys
    .map(key => {
      const [entityId, lang, propName] = key
      const prop = wdProps.find(propName)

      return {
        entityId,
        propName,
        propId: prop ? prop.id : null,
        lang
      }
    })
    .filter(i => i.propId)

  // console.log(args)

  const sparql = queryBuilder.property(args)
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
        let items = entities.filter(item => {
          return item.entity.value.indexOf(entityId) > -1 && item.prop.value.indexOf(prop.id) > -1
        })

        return items.map(item => {
          let type = item.type ? item.type.value : null
          let value = item.value ? item.value.value : null
          let unit = item.unit ? item.unit.value : null

          if (type && type.indexOf('QuantityValue') > -1) {
            value = numeral(value).format('0,0')

            return [value, unit].filter(v => v).join(' ')
          }

          return value
        })
      })
    })
}

export { entityLoader, propertyLoader }
