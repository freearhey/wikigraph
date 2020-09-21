import DataLoader from 'dataloader'
import wdk from 'wikidata-sdk'
import axios from 'axios'

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

import { remove as removeDiacritics } from 'diacritics'
import config from './config.json'
const properties = {}
for (let { property, label, datatype } of config.property) {
  properties[property] = _genFieldNameByLabel(label)
}

const client = new DataLoader(keys => {
  const args = keys[0].split('_')
  let id = args[0]
  let lang = args[1]
  return getItemsByIds(id, lang)
})

const getItemsByIds = (id, lang = 'en') => {
  const url = wdk.getEntities({
    ids: [id],
    languages: [lang],
    format: 'json'
  })

  return axios
    .get(url)
    .then(function (response) {
      return response.data.entities
    })
    .then(res => {
      return [id].map(id => {
        return new Entity(res[id], lang)
      })
    })
}

class Entity {
  constructor(rawData, lang) {
    this.rawData = rawData
    this.id = rawData.id
    this.lang = lang
    this.label = rawData.labels[lang] ? rawData.labels[lang].value : null
    this._processClaims()
  }

  _processClaims() {
    const claims = this.rawData.claims
    for (let key in claims) {
      let label = this._getPropertyLabel(key)
      if (label) {
        this[label] = this._processClaimItems(claims[key])
      } else {
        // console.log(key, label)
      }
    }
  }

  _processClaimItems(value) {
    return value.map(item => {
      return this._processClaimItem(item)
    })
  }

  _processClaimItem(item) {
    // TODO: dealing with other types
    const mainsnak = item.mainsnak
    return this._processMainSnak(mainsnak)
  }

  async _processMainSnak(mainsnak) {
    switch (mainsnak.datatype) {
      case 'wikibase-item':
        const itemId = mainsnak.datavalue.value.id
        const url = wdk.getEntities({
          ids: itemId,
          format: 'json'
        })

        return await axios
          .get(url)
          .then(function (response) {
            return response.data.entities
          })
          .then(res => {
            return res[itemId].labels[this.lang] ? res[itemId].labels[this.lang].value : null
          })
      case 'time':
        // TODO: add a time type
        return mainsnak.datavalue.value.time.toString()
      case 'external-id':
      case 'string':
        return mainsnak.datavalue.value
      default:
        return mainsnak.datavalue.value
    }
  }

  _getPropertyLabel(id) {
    return properties[id]
  }
}

export default client
