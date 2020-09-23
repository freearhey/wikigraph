import properties from './properties.json'

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

export default {
  property(entityId, propName, lang) {
    let propId = getKeyByValue(properties, propName)
    let query = `
      SELECT
        (group_concat(DISTINCT ?p_${propName}Label;separator=", ") as ?${propName})
      WHERE { 
        BIND(wd:${entityId} AS ?entity). 
        OPTIONAL { 
          ?entity wdt:${propId} ?p_${propName} . 
        } 
        SERVICE wikibase:label {
          bd:serviceParam wikibase:language "${lang}". 
          ?p_${propName} rdfs:label ?p_${propName}Label . 
        }
      }
    `

    return query
  }
}
