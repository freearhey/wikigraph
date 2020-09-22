import DataLoader from 'dataloader'
import wdk from 'wikidata-sdk'
import axios from 'axios'
import properties from './properties.json'

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
    props: ['labels', 'claims'],
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

  async _processClaims() {
    const claims = this.rawData.claims
    for (let key in claims) {
      let label = properties[key]
      if (label) {
        this[label] = this._processClaimItems(claims[key])
      } else {
        console.log(key, label)
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
}

export default client
