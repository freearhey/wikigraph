import properties from './properties.json'

function getPropIdByName(name) {
  return Object.keys(properties).find(id => properties[id] === name)
}

export default {
  property(entityIds, propNames, lang = 'en') {
    let props = propNames.map(propName => {
      return {
        id: getPropIdByName(propName),
        name: propName
      }
    })

    let query = `SELECT ?entity`

    props.forEach(prop => {
      query += ` (group_concat(DISTINCT ?p_${prop.name}Label;separator=", ") as ?${prop.name})`
    })

    query += ` WHERE { VALUES ?entity {`

    entityIds.forEach(entityId => {
      query += ` wd:${entityId}`
    })

    query += `}`

    props.forEach(prop => {
      query += `OPTIONAL { ?entity wdt:${prop.id} ?p_${prop.name}. }`
    })

    query += `SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}".`

    props.forEach(prop => {
      query += `?p_${prop.name} rdfs:label ?p_${prop.name}Label.`
    })

    query += `}} GROUP BY ?entity`

    return query
  }
}
