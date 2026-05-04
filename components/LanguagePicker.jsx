'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDirection } from '../hooks/useDirection.js'

const ease = [0.22, 1, 0.36, 1]

const LANGUAGES = [
  { code: 'fr', short: 'FR', label: 'Français' },
  { code: 'ar', short: 'AR', label: 'العربية' },
  { code: 'en', short: 'EN', label: 'English' },
  { code: 'tz', short: 'ⴰⵎⴰ', label: 'Tamazight' },
]

export default function LanguagePicker() {
  const { i18n } = useTranslation()
  const { isRTL, flip } = useDirection()
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isOpen])

  function select(code) {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0]

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ background: 'var(--accent-gold-bg)', borderColor: 'var(--accent-gold-border)' }}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '10px 14px', borderRadius: '10px',
          background: isOpen ? 'var(--accent-gold-bg)' : 'var(--bg-surface)',
          border: isOpen ? '1px solid var(--accent-gold-border)' : '1px solid var(--accent-gold-border-lo)',
          color: isOpen ? 'var(--accent-gold)' : 'var(--text-muted)',
          fontSize: '12px', fontWeight: 700, letterSpacing: '1px',
          fontFamily: "'Anek Latin', sans-serif",
          cursor: 'pointer', transition: 'all 0.2s',
          backdropFilter: 'blur(10px)',
        }}
        title="Changer la langue"
      >
        {current.short}
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </motion.svg>
      </motion.button>

      {/* Dropdown — positioned on start side (right in LTR, left in RTL) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.14, ease }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: '150px',
              background: 'var(--bg-dropdown)',
              border: '1px solid var(--accent-gold-border-lo)',
              borderRadius: '14px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-heavy)',
              zIndex: 1500,
              transformOrigin: 'top right',
              overflow: 'hidden',
              padding: '6px 0',
            }}
          >
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Anek Latin', sans-serif",
                  fontSize: '13px', fontWeight: l.code === i18n.language ? 700 : 500,
                  color: l.code === i18n.language ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  textAlign: flip('left', 'right'),
                  direction: 'ltr',
                }}
              >
                <span>{l.label}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', opacity: 0.55 }}>
                  {l.short}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
