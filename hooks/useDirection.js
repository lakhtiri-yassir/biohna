'use client'

import { useTranslation } from 'react-i18next'

const RTL_LANGS = ['ar', 'tz']

/**
 * Returns direction state and a helper to pick LTR vs RTL values.
 *
 * Usage:
 *   const { isRTL, flip, dir } = useDirection()
 *   style={{ left: flip('12px', 'auto'), right: flip('auto', '12px') }}
 */
export function useDirection() {
  const { i18n } = useTranslation()
  const isRTL = RTL_LANGS.includes(i18n.language)
  const dir = isRTL ? 'rtl' : 'ltr'

  /** Returns ltrValue when LTR, rtlValue when RTL */
  function flip(ltrValue, rtlValue) {
    return isRTL ? rtlValue : ltrValue
  }

  return { isRTL, dir, flip }
}
