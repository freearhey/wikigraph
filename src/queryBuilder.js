export default {
  property(entityIds, propIds, lang = 'en') {
    let query = `SELECT ?entity ?prop ?statement (?vLabel as ?value)`

    query += ` WHERE {`

    query += ` VALUES ?entity {`

    entityIds.forEach(entityId => {
      query += ` wd:${entityId}`
    })

    query += `}`

    query += ` VALUES ?prop {`

    propIds.forEach(pid => {
      query += ` p:${pid}`
    })

    query += `}`

    query += ` VALUES ?ps {`

    propIds.forEach(pid => {
      query += ` ps:${pid}`
    })

    query += `}`

    query += ` OPTIONAL { ?entity ?prop ?statement }`

    query += `OPTIONAL { ?statement ?ps ?v }`

    query += `filter (!isLiteral(?statement) || lang(?statement) = "" || lang(?statement) = "${lang}")`

    query += `SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}" . ?v rdfs:label ?vLabel }`

    query += `}`

    return query
  }
}
