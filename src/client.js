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

const client = new DataLoader(ids => {
  return getItemsByIds(ids)
})

const getItemsByIds = ids => {
  const url = wdk.getEntities({
    ids: ids,
    format: 'json'
  })

  return axios
    .get(url)
    .then(function (response) {
      return response.data.entities
    })
    .then(res => {
      return ids.map(id => {
        return new Entity(res[id])
      })
    })
}

class Entity {
  constructor(rawData) {
    this.rawData = rawData
    this.id = rawData.id
    this.labels = rawData.labels
    this._processClaims()
  }

  label({ lang }) {
    const label = this.labels[lang]
    return label && label.value
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
            console.log(res[itemId].labels['en'].value)
            return res[itemId].labels['en'].value
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
