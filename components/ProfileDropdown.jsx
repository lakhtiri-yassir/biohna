'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { useDirection } from '../hooks/useDirection.js'

const ease = [0.22, 1, 0.36, 1]

function AvatarFace({ user, size = 38, fontSize = '13px' }) {
  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        style={{
          width: `${size}px`, height: `${size}px`,
          borderRadius: '50%', objectFit: 'cover',
          border: '2px solid var(--accent-gold-border)',
          display: 'block',
        }}
      />
    )
  }
  const initials = user.initials ?? 
    (user.fullName ? 
      user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 
      '??')
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))',
      border: '1.5px solid var(--accent-gold-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Anek Latin', sans-serif", fontWeight: 700,
      fontSize, letterSpacing: '1.5px', color: 'var(--accent-gold)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function ProfileDropdown({ user }) {
  const { logout } = useAuth()
  const { t } = useTranslation()
  const { flip } = useDirection()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    function handleMouseDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  function handleNavigate(path) {
    setOpen(false)
    if (path) router.push(path)
  }

  function handleLogout() {
    setOpen(false)
    logout()
    router.push('/')
  }

  const roleBadge = t('profile_menu.client') // Default to client since role field doesn't exist in schema

  const menuItems = [
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
    {
      labelKey: 'profile_menu.my_favorites',
      path: '/favoris',
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
    },
  ]

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Avatar trigger button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)', scale: 1.05 }}
        style={{
          width: '38px', height: '38px', borderRadius: '50%',
          border: user.avatarUrl ? 'none' : '1px solid var(--accent-gold-border)',
          background: user.avatarUrl ? 'none' : 'var(--accent-gold-bg)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, overflow: 'hidden',
        }}
        title={t('profile_menu.my_account')}
      >
        <AvatarFace user={user} size={38} fontSize="13px" />
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.15, ease }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              [flip('right', 'left')]: 0,
              width: '220px',
              background: 'var(--bg-dropdown)',
              border: '1px solid var(--accent-gold-border-lo)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow-heavy)',
              zIndex: 1500,
              transformOrigin: flip('top right', 'top left'),
              overflow: 'hidden',
            }}
          >
            {/* User header */}
            <div style={{
              padding: '16px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <AvatarFace user={user} size={34} fontSize="11px" />
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontFamily: "'Anek Latin', sans-serif",
                  fontWeight: 700, fontSize: '13px',
                  color: 'var(--text-primary)', lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user.firstName} {user.lastName}
                </p>
                <span style={{
                  display: 'inline-block', marginTop: '5px',
                  padding: '2px 9px', borderRadius: '10px',
                  background: 'var(--accent-gold-bg)',
                  border: '1px solid var(--accent-gold-border)',
                  fontSize: '10px', fontWeight: 700,
                  color: 'var(--accent-gold)', letterSpacing: '1px',
                  fontFamily: "'Anek Latin', sans-serif",
                  textTransform: 'uppercase',
                }}>
                  {roleBadge}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <ul style={{ listStyle: 'none', padding: '6px 0', margin: 0 }}>
              {menuItems.map(item => (
                <motion.li
                  key={item.labelKey}
                  whileHover={{ background: 'var(--bg-surface-hover)' }}
                  onClick={() => handleNavigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '11px',
                    padding: '10px 18px',
                    cursor: item.path ? 'pointer' : 'default',
                    fontFamily: "'Anek Latin', var(--font-body), sans-serif",
                    fontSize: '13px', fontWeight: 500,
                    color: item.path ? 'var(--text-secondary)' : 'var(--text-muted)',
                    userSelect: 'none',
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
                </motion.li>
              ))}
            </ul>

            {/* Logout */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '6px 0' }}>
              <motion.button
                whileHover={{ background: 'var(--destructive-bg)', color: 'var(--destructive)' }}
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '11px',
                  padding: '10px 18px',
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
