'use client'
import { useRouter } from 'next/navigation'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useModal } from '../context/ModalContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useDirection } from '../hooks/useDirection.js'

export default function MobileMenu({ isOpen, onClose }) {
  const { setActiveModal } = useModal()
  const { isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const { isRTL, flip } = useDirection()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleModal = (modal) => {
    onClose()
    setActiveModal(modal)
  }

  const handleLogout = () => {
    onClose()
    logout()
    router.push('/')
  }

  const linkStyle = {
    display: 'flex', alignItems: 'center',
    height: '52px', padding: '0 20px',
    fontFamily: "'Anek Latin', var(--font-body), sans-serif",
    fontWeight: 600, fontSize: '13px',
    letterSpacing: '1.5px', textTransform: 'uppercase',
    color: 'var(--text-primary)',
    background: 'none', border: 'none', cursor: 'pointer',
    textDecoration: 'none', width: '100%',
    textAlign: flip('left', 'right'),
    borderBottom: '0.5px solid var(--border-subtle)',
    transition: 'color 0.2s',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 1200,
            }}
          />

          {/* Panel — slides from the end side (right in LTR, left in RTL) */}
          <motion.div
            initial={{ x: flip('100%', '-100%') }}
            animate={{ x: 0 }}
            exit={{ x: flip('100%', '-100%') }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            style={{
              position: 'fixed', top: 0, bottom: 0,
              [flip('right', 'left')]: 0,
              width: 'min(84vw, 340px)',
              zIndex: 1201,
              background: 'var(--bg-nav)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              [flip('borderLeft', 'borderRight')]: '0.5px solid var(--accent-gold-border)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 20px 16px',
              borderBottom: '0.5px solid var(--border-subtle)',
            }}>
              <Link href="/" onClick={onClose} style={{
                fontFamily: "'Anton SC', var(--font-display), sans-serif",
                fontSize: '24px', letterSpacing: '4px',
                color: 'var(--text-primary)', textDecoration: 'none',
                direction: 'ltr',
              }}>
                BI<img
                  src="/assets/81694cb7-7918-41a9-a93c-a54c8323bdac.png"
                  alt=""
                  style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle', margin: '0 1px', display: 'inline-block' }}
                />HNA
              </Link>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  border: '1px solid var(--accent-gold-border)',
                  background: 'var(--accent-gold-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-primary)', fontSize: '20px',
                }}
              >×</motion.button>
            </div>

            {/* Nav links */}
            <nav>
              <motion.div whileTap={{ color: 'var(--accent-gold)' }}>
                <Link href="/produits" onClick={onClose} style={linkStyle}>{t('nav.products')}</Link>
              </motion.div>
              {[
                { key: 'vendors',    modal: 'vendeurs' },
                { key: 'categories', modal: 'categories' },
                { key: 'contact',    modal: 'contact' },
              ].map(({ key, modal }) => (
                <motion.button
                  key={modal}
                  whileTap={{ color: 'var(--accent-gold)' }}
                  style={linkStyle}
                  onClick={() => handleModal(modal)}
                >{t(`mobile_menu.${key}`)}</motion.button>
              ))}
              <motion.button
                whileTap={{ color: 'var(--accent-gold)' }}
                style={linkStyle}
                onClick={() => handleModal('favorites')}
              >{t('mobile_menu.favorites')}</motion.button>
            </nav>

            {/* Spacer to push auth section to bottom */}
            <div style={{ flex: 1, minHeight: '32px' }} />

            {/* Bottom: auth + utilities */}
            <div style={{ borderTop: '0.5px solid var(--border-subtle)' }}>
              {isAuthenticated ? (
                <>
                  {/* Profile sub-items */}
                  {[
                    {
                      labelKey: 'profile_menu.my_profile',
                      path: '/profile',
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                        </svg>
                      ),
                    },
                    {
                      labelKey: 'profile_menu.my_orders',
                      path: null,
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2"/>
                          <line x1="9" y1="7" x2="15" y2="7"/>
                          <line x1="9" y1="12" x2="15" y2="12"/>
                          <line x1="9" y1="17" x2="13" y2="17"/>
                        </svg>
                      ),
                    },
                  ].map(item => (
                    <motion.button
                      key={item.labelKey}
                      whileTap={{ background: 'var(--bg-surface-hover)' }}
                      onClick={() => { if (item.path) { onClose(); router.push(item.path) } }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        width: '100%', padding: '13px 20px',
                        background: 'none', border: 'none',
                        borderBottom: '0.5px solid var(--border-subtle)',
                        cursor: item.path ? 'pointer' : 'default',
                        fontFamily: "'Anek Latin', var(--font-body), sans-serif",
                        fontSize: '13px', fontWeight: 500, letterSpacing: '0.5px',
                        color: item.path ? 'var(--text-secondary)' : 'var(--text-muted)',
                        textAlign: flip('left', 'right'),
                      }}
                    >
                      <span style={{ flexShrink: 0, color: item.path ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                        {item.icon}
                      </span>
                      {t(item.labelKey)}
                      {!item.path && (
                        <span style={{ marginLeft: flip('auto', undefined), marginRight: flip(undefined, 'auto'), fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {t('profile_menu.soon')}
                        </span>
                      )}
                    </motion.button>
                  ))}

                  {/* Logout */}
                  <motion.button
                    whileTap={{ background: 'var(--destructive-bg)', color: 'var(--destructive)' }}
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      width: '100%', padding: '13px 20px 28px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Anek Latin', var(--font-body), sans-serif",
                      fontSize: '13px', fontWeight: 500,
                      color: 'var(--destructive)',
                      textAlign: flip('left', 'right'),
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    {t('profile_menu.logout')}
                  </motion.button>
                </>
              ) : (
                <div style={{ padding: '20px 20px 40px' }}>
                  <Link href="/login" onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '13px 22px',
                    borderRadius: '28px',
                    border: '1px solid var(--accent-gold)',
                    background: 'var(--accent-gold-bg)',
                    color: 'var(--accent-gold)', fontWeight: 600, fontSize: '13px',
                    letterSpacing: '1px', textTransform: 'uppercase',
                    textDecoration: 'none',
                  }}>{t('nav.login')}</Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
