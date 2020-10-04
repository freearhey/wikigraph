export default {
    property(args) {
        const lang = args[0] ? args[0].lang : 'en'

        let query = `SELECT ?entity ?prop ?statement (?vLabel as ?value) (?tLabel as ?type) (?uLabel as ?unit)`

        query += ` WHERE {`

        query += ` VALUES (?entity ?prop ?ps ?psv ) {`

        args.forEach(i => {
            query += ` (wd:${i.entityId} p:${i.propId} ps:${i.propId} psv:${i.propId})`
        })

        query += `}`

        query += ` OPTIONAL { ?entity ?prop ?statement . ?statement ?ps ?v }`

        query += ` OPTIONAL { ?entity ?prop ?statement . ?statement ?ps ?v . ?statement ?psv ?vnode . ?vnode rdf:type ?t . ?vnode wikibase:quantityUnit ?u . }`

        query += `filter (!isLiteral(?statement) || lang(?statement) = "" || lang(?statement) = "${lang}")`

        query += `SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang}" . ?t rdfs:label ?tLabel . ?v rdfs:label ?vLabel . ?u rdfs:label ?uLabel }`

        query += `}`

        return query
    }
}
