'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useModal } from '../context/ModalContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import ProfileDropdown from './ProfileDropdown.jsx'
import LanguagePicker from './LanguagePicker.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import MobileMenu from './MobileMenu.jsx'
import { useIsNarrow } from '../hooks/useIsNarrow.js'

const S = {
  nav: (scrolled) => ({
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    height: '72px',
    display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
    padding: '0 48px',
    background: scrolled ? 'var(--bg-nav)' : 'var(--bg-nav-transparent)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom: '1px solid var(--border-nav)',
    transition: 'background 0.4s, border-color 0.4s',
  }),
  logo: {
    fontFamily: "'Anton SC', sans-serif",
    fontSize: '32px', letterSpacing: '4px',
    color: 'var(--text-primary)', textDecoration: 'none',
    userSelect: 'none', direction: 'ltr',
  },
  links: {
    display: 'flex', alignItems: 'center', gap: '32px',
  },
  link: {
    fontFamily: "'Anek Latin', sans-serif",
    fontWeight: 600, fontSize: '13px',
    letterSpacing: '1.5px', textTransform: 'uppercase',
    color: 'var(--text-secondary)', textDecoration: 'none',
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    transition: 'color 0.2s',
  },
  right: { display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' },
  iconBtn: {
    width: '38px', height: '38px', borderRadius: '50%',
    border: '1px solid var(--accent-gold-border)',
    background: 'var(--bg-nav-btn)',
    backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text-primary)', fontSize: '16px',
    textDecoration: 'none',
  },
  loginBtn: {
    padding: '9px 22px', borderRadius: '28px',
    border: '1px solid var(--accent-gold-border)',
    background: 'var(--bg-nav-btn)',
    backdropFilter: 'blur(10px)',
    color: 'var(--accent-gold)', fontWeight: 600, fontSize: '13px',
    letterSpacing: '1px', textTransform: 'uppercase',
    textDecoration: 'none', cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
}

export default function NavBar() {
  const { setActiveModal } = useModal()
  const { user, isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isNarrow = useIsNarrow()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        dir="ltr"
        style={{
          ...S.nav(scrolled),
          ...(isNarrow && { gridTemplateColumns: 'auto 1fr auto', padding: '0 16px' }),
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <Link href="/" style={{ ...S.logo, ...(isNarrow && { fontSize: '24px' }) }}>
          BI<img
            src="/assets/81694cb7-7918-41a9-a93c-a54c8323bdac.png"
            alt=""
            style={{
              width: isNarrow ? '22px' : '28px',
              height: isNarrow ? '22px' : '28px',
              objectFit: 'contain', verticalAlign: 'middle',
              margin: '0 1px', display: 'inline-block',
            }}
          />HNA
        </Link>

        {/* Center links — hidden on narrow */}
        {isNarrow ? <div /> : (
          <div style={S.links}>
            <motion.div whileHover={{ color: 'var(--accent-gold)' }}>
              <Link href="/produits" style={S.link}>{t('nav.products')}</Link>
            </motion.div>
            <motion.button
              style={S.link}
              whileHover={{ color: 'var(--accent-gold)' }}
              onClick={() => setActiveModal('vendeurs')}
            >
              {t('nav.vendors')}
            </motion.button>
            <motion.button
              style={S.link}
              whileHover={{ color: 'var(--accent-gold)' }}
              onClick={() => setActiveModal('categories')}
            >
              {t('nav.categories')}
            </motion.button>
            <motion.button
              style={S.link}
              whileHover={{ color: 'var(--accent-gold)' }}
              onClick={() => setActiveModal('contact')}
            >
              {t('nav.contact')}
            </motion.button>
          </div>
        )}

        {/* Right side */}
        {isNarrow ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ThemeToggle />
            <LanguagePicker />
            <motion.button
              style={S.iconBtn}
              whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)', scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              title="Panier"
              onClick={() => setActiveModal('panier')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </motion.button>
            <motion.button
              style={S.iconBtn}
              whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)', scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Menu"
              onClick={() => setMenuOpen(v => !v)}
            >
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="0" y1="1" x2="16" y2="1"/>
                <line x1="0" y1="5.5" x2="16" y2="5.5"/>
                <line x1="0" y1="10" x2="16" y2="10"/>
              </svg>
            </motion.button>
          </div>
        ) : (
          <div style={S.right}>
            {pathname !== '/' && (
              <motion.button
                style={S.iconBtn}
                whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)', scale: 1.08 }}
                title="Rechercher"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </motion.button>
            )}
            <motion.button
              style={S.iconBtn}
              whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)', scale: 1.08 }}
              title={t('nav.favorites')}
              onClick={() => setActiveModal('favorites')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </motion.button>
            <motion.button
              style={S.iconBtn}
              whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)', scale: 1.08 }}
              title="Panier"
              onClick={() => setActiveModal('panier')}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </motion.button>
            <ThemeToggle />
            {isAuthenticated ? (
              <ProfileDropdown user={user} />
            ) : (
              <motion.div style={{ borderRadius: '28px' }}>
                <Link href="/login" style={S.loginBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--bg-base)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-nav-btn)'; e.currentTarget.style.color = 'var(--accent-gold)'; }}
                >{t('nav.login')}</Link>
              </motion.div>
            )}
            <LanguagePicker />
          </div>
        )}
      </motion.nav>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
