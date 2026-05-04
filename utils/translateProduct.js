'use client'

import i18n from '../i18n/index.js'

/**
 * Returns a product object with content fields resolved from the `data` namespace,
 * falling back to the raw value from artisanes.js if no translation exists.
 */
export function translateProduct(product) {
  const { id } = product
  const ns = 'data'
  const r = (key, fallback) => i18n.t(`product.${id}.${key}`, { ns, defaultValue: fallback ?? '' })
  const raw = (key) => i18n.t(`product.${id}.${key}`, { ns, returnObjects: true, defaultValue: null })

  const composition = (() => {
    const translated = raw('composition')
    if (Array.isArray(translated) && translated.length) return translated
    return product.composition ?? []
  })()

  return {
    ...product,
    name:            r('name', product.name),
    tagline:         r('tagline', product.tagline),
    description:     r('description', product.description),
    longDescription: r('longDescription', product.longDescription),
    origin:          r('origin', product.origin),
    composition,
  }
}

/**
 * Returns an artisan object with content fields resolved from the `data` namespace,
 * falling back to the raw value from artisanes.js if no translation exists.
 */
export function translateArtisan(artisan) {
  const { id } = artisan
  const ns = 'data'
  const r = (key, fallback) => i18n.t(`artisan.${id}.${key}`, { ns, defaultValue: fallback ?? '' })

  return {
    ...artisan,
    story:         r('story', artisan.story),
    quote:         r('quote', artisan.quote),
    specialtyLabel: r('specialtyLabel', artisan.specialtyLabel),
    products:      artisan.products.map(translateProduct),
  }
}
