# Wikidata GraphQL API

GraphQL API for quick access to Wikidata.

## Usage

### GraphQL IDE

<a href="https://wikigraph.vercel.app/graphql" target="_blank">https://wikigraph.vercel.app/graphql</a>

### cURL

```sh
curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "{ entity(id: \"Q2\") { id, label, description } }" }' \
https://wikigraph.vercel.app/graphql
```

### JavaScript

```js
fetch('https://wikigraph.vercel.app/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: `
      query { 
        entity(id: "Q2") { 
           id, 
           label,
           description 
        } 
     }`
  })
})
  .then(response => response.json())
  .then(json => console.log(json.data))
```

## Supported Operations

**search**

Searches for entities using labels.

Arguments:

- `query` - term to search (required)
- `lang` - language to use for property values (default: 'en')
- `first` - maximal number of results (default: 10)
- `offset` - offset where to continue a search (default: 0)

Example:

```graphql
{
  search(query: "Earth", lang: "fr", first: 1) {
    id
    label
    description
  }
}
```

Response:

```json
{
  "data": {
    "search": [
      {
        "id": "Q982498",
        "label": "Earth",
        "description": "ville américaine de l'état du Texas"
      }
    ]
  }
}
```

**entity**

Lookup an entity by ID.

Arguments:

- `id` - the ID of the entity to get the data from (required)
- `lang` - language to use for property values (default: 'en')

Example:

```graphql
{
  entity(id: "Q2", lang: "de") {
    id
    label
    description
  }
}
```

Response:

```json
{
  "data": {
    "entity": {
      "id": "Q2",
      "label": "Erde",
      "description": "dritter Planet von der Sonne aus im Sonnensystem"
    }
  }
}
```

## Available Properties

You can get the value of any property by its slug. For example query:

```graphql
{
  entity(id: "Q2") {
    instance_of
  }
}
```

will produce the following JSON response:

```json
{
  "data": {
    "entity": {
      "instance_of": ["inner planet"]
    }
  }
}
```

If the object has no such property, the value will be an empty array.

## Contribution

If you find a bug or want to contribute to the code or documentation, you can help by submitting an [issue](https://github.com/freearhey/wikigraph/issues) or a [pull request](https://github.com/freearhey/wikigraph/pulls).

## License

[MIT](LICENSE.md)
