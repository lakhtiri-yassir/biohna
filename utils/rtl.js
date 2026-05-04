'use client'

/**
 * Pure RTL style helpers — no React hooks, safe to call outside components.
 *
 * Usage:
 *   import { flipInline } from '../utils/rtl.js'
 *   const s = flipInline(isRTL, { left: '12px', paddingLeft: '44px', textAlign: 'left' })
 *   // RTL → { right: '12px', paddingRight: '44px', textAlign: 'right' }
 */

const FLIP_MAP = {
  left: 'right',
  right: 'left',
  paddingLeft: 'paddingRight',
  paddingRight: 'paddingLeft',
  marginLeft: 'marginRight',
  marginRight: 'marginLeft',
  borderLeft: 'borderRight',
  borderRight: 'borderLeft',
  borderTopLeftRadius: 'borderTopRightRadius',
  borderTopRightRadius: 'borderTopLeftRadius',
  borderBottomLeftRadius: 'borderBottomRightRadius',
  borderBottomRightRadius: 'borderBottomLeftRadius',
}

/**
 * Flips physical directional CSS properties for RTL.
 * Mutually exclusive pairs are swapped: left<->right, paddingLeft<->paddingRight, etc.
 * textAlign 'left' becomes 'right' and vice versa.
 * transformOrigin strings containing 'left'/'right' are swapped.
 *
 * @param {boolean} isRTL
 * @param {object} styleObj - React inline style object
 * @returns {object} - New style object with flipped properties
 */
export function flipInline(isRTL, styleObj) {
  if (!isRTL) return styleObj

  const result = {}
  const seen = new Set()

  for (const [key, value] of Object.entries(styleObj)) {
    if (seen.has(key)) continue

    const flippedKey = FLIP_MAP[key]

    if (flippedKey) {
      // If the flipped counterpart also exists in the original, swap both values
      if (key in styleObj && flippedKey in styleObj && !seen.has(flippedKey)) {
        result[key] = styleObj[flippedKey]
        result[flippedKey] = styleObj[key]
        seen.add(key)
        seen.add(flippedKey)
      } else {
        // Only this side exists — move value to flipped key
        result[flippedKey] = value
        seen.add(key)
        seen.add(flippedKey)
      }
    } else if (key === 'textAlign' && (value === 'left' || value === 'right')) {
      result.textAlign = value === 'left' ? 'right' : 'left'
      seen.add(key)
    } else if (key === 'transformOrigin' && typeof value === 'string') {
      result.transformOrigin = value.replace(/\bleft\b/g, '__TMP__').replace(/\bright\b/g, 'left').replace(/__TMP__/g, 'right')
      seen.add(key)
    } else {
      result[key] = value
      seen.add(key)
    }
  }

  return result
}

/**
 * Conditionally picks a value based on direction.
 * @param {boolean} isRTL
 * @param {*} ltrValue
 * @param {*} rtlValue
 */
export function pick(isRTL, ltrValue, rtlValue) {
  return isRTL ? rtlValue : ltrValue
}
