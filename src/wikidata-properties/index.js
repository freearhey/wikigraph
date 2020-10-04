import slugify from '@sindresorhus/slugify'
import props from './props.json'

const propsWithSlug = {}

for (let prop of props) {
  prop = addSlug(prop)
  propsWithSlug[prop.slug] = prop
}

export default {
  all() {
    return Object.values(propsWithSlug)
  },
  get(id) {
    return Object.values(propsWithSlug).find(p => p.id === id)
  },
  find(name) {
    return propsWithSlug[slug(name)]
  }
}

function addSlug(p) {
  p.slug = slug(p.label)

  return p
}

function slug(str) {
  let slug = slugify(str.toLowerCase(), { separator: '_' })

  if (slug.match(/^\d/)) {
    return `_${slug}`
  }

  return slug
}
