'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SortDropdown({ options, value, onChange, compact = false }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find(o => o.value === value) || options[0]

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      {/* Trigger */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ borderColor: 'var(--accent-gold-border)' }}
        style={{
          display: 'flex', alignItems: 'center', gap: compact ? '8px' : '18px',
          padding: '9px 14px 9px 16px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-gold-border-lo)',
          color: 'var(--text-primary)', fontSize: '13px',
          fontFamily: "'Anek Latin', sans-serif",
          letterSpacing: '0.2px',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '11px',
          minWidth: compact ? '140px' : '190px', justifyContent: 'space-between',
          transition: 'border-color 0.2s',
        }}
      >
        <span>{selected.label}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          width="10" height="10" viewBox="0 0 10 6" fill="none"
          stroke="var(--accent-gold)" strokeWidth="0.9" strokeLinecap="round"
        >
          <path d="M1 1l4 4 4-4" />
        </motion.svg>
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, minWidth: '100%',
              background: 'var(--bg-dropdown)',
              border: '1px solid var(--accent-gold-border-lo)',
              borderRadius: '11px',
              overflow: 'hidden',
              zIndex: 999,
              listStyle: 'none', margin: 0, padding: '4px 0',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              boxShadow: 'var(--shadow-card)',
              transformOrigin: 'top',
            }}
          >
            {options.map(o => {
              const isActive = o.value === value
              return (
                <motion.li
                  key={o.value}
                  onClick={() => { onChange(o.value); setOpen(false) }}
                  whileHover={{ background: isActive ? 'var(--accent-gold-hover-bg)' : 'var(--bg-surface-hover)' }}
                  style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    fontFamily: "'Anek Latin', sans-serif",
                    letterSpacing: '0.2px',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-gold-active)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.12s',
                    borderLeft: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
                  }}
                >
                  {o.label}
                  {isActive && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="var(--accent-gold)" strokeWidth="1" strokeLinecap="round">
                      <path d="M1 4l2 2 4-4" />
                    </svg>
                  )}
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
