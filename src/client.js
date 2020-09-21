import DataLoader from 'dataloader'
import wdk from 'wikidata-sdk'
import axios from 'axios'

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
      return ids.map(id => new Entity(res[id]))
    })
}

class Entity {
  constructor(rawData) {
    // console.log(rawData.claims)
    this.rawData = rawData
    this.id = rawData.id
    this.labels = rawData.labels
    this.claims = rawData.claims
  }

  label({ lang }) {
    const label = this.labels[lang]
    return label && label.value
  }

  property({ id }) {
    const value = this.claims[id]
    if (value) {
      return this._processClaimItems(value)
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
    console.log(mainsnak)
    return this._processMainSnak(mainsnak)
  }

  _processMainSnak(mainsnak) {
    switch (mainsnak.datatype) {
      case 'wikibase-item':
        const itemId = mainsnak.datavalue.value.id
        return itemLoader.load(itemId)
        break
      case 'time':
        // TODO: add a time type
        return mainsnak.datavalue.value.time.toString()
        break
      case 'external-id':
      case 'string':
        return mainsnak.datavalue.value
      default:
        return mainsnak.datavalue.value
    }
  }
}

export default client
