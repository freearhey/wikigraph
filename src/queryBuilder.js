export default {
  property(args) {
    const lang = args[0] ? args[0].lang : 'en'

    let query = `SELECT ?entity ?prop ?statement (?vLabel as ?value)`

    query += ` WHERE {`

    query += ` VALUES (?entity ?prop ?ps ) {`

    args.forEach(i => {
      query += ` (wd:${i.entityId} p:${i.propId} ps:${i.propId})`
    })

    query += `}`

    query += ` OPTIONAL { ?entity ?prop ?statement . ?statement ?ps ?v }`

    query += `filter (!isLiteral(?statement) || lang(?statement) = "" || lang(?statement) = "${lang}")`

    query += `SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}" . ?v rdfs:label ?vLabel }`

    query += `}`

    return query
  }
}
