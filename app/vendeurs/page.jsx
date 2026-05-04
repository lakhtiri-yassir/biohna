'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import { ARTISANES, SPECIALTY_COLORS, REGIONS, SPECIALTIES } from '@/data/artisanes.js'
import { translateArtisan } from '@/utils/translateProduct.js'
import { useTheme } from '@/context/ThemeContext.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow'
import { useDirection } from '@/hooks/useDirection.js'

function AvatarCircle({ initials, size = 64 }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))',
      border: '2px solid var(--accent-gold-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontWeight: 700,
      fontSize: `${Math.round(size * 0.28)}px`, letterSpacing: '1px', color: 'var(--accent-gold)',
    }}>
      {initials}
    </div>
  )
}

function ArtisanCard({ artisan, delay, seeWorkshopLabel, creationsLabel, coopLabel }) {
  const router = useRouter()
  const { isDark } = useTheme()
  const specialtyColor = SPECIALTY_COLORS[artisan.specialty] ?? '#d4af37'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, boxShadow: isDark ? '0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.2)' : '0 16px 50px rgba(44,44,44,0.12), 0 0 0 1px rgba(212,175,55,0.2)' }}
      onClick={() => router.push(`/vendeurs/${artisan.id}`)}
      style={{
        borderRadius: '22px', overflow: 'hidden',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--accent-gold-border-lo)',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer', padding: '26px 24px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <AvatarCircle initials={artisan.initials} size={60} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '1px', marginBottom: '4px', lineHeight: 1.1 }}>
            {artisan.name}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {artisan.region}
            {artisan.type === 'coopérative' && (
              <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>{coopLabel}</span>
            )}
          </p>
        </div>
      </div>

      {/* Specialty badge */}
      <span style={{
        alignSelf: 'flex-start',
        fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: '#061108',
        background: specialtyColor,
        padding: '4px 12px', borderRadius: '20px',
      }}>
        {artisan.specialtyLabel}
      </span>

      {/* Story excerpt */}
      <p style={{
        fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
        fontSize: '14px', lineHeight: 1.6,
        color: 'var(--text-secondary)',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {artisan.story}
      </p>

      {/* Footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{creationsLabel}</span>
        <motion.span
          whileHover={{ color: 'var(--accent-gold)', x: 2 }}
          style={{ fontSize: '12px', color: 'var(--accent-gold)', opacity: 0.7, fontWeight: 600, fontFamily: "'Anek Latin', var(--font-body), sans-serif", letterSpacing: '0.5px' }}
        >
          {seeWorkshopLabel}
        </motion.span>
      </div>
    </motion.div>
  )
}

function SidebarSection({ title, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ padding: '22px 20px', borderRadius: '20px', background: 'var(--bg-surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--accent-gold-border-lo)' }}
    >
      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>{title}</p>
      {children}
    </motion.div>
  )
}

export default function Vendeurs() {
  const { t } = useTranslation('vendors')
  const { flip } = useDirection()
  const [activeSpecialty, setActiveSpecialty] = useState(null)
  const [activeRegion, setActiveRegion] = useState(null)
  const [activeType, setActiveType] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const isNarrow = useIsNarrow()

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  const filtered = ARTISANES
    .filter(a => {
      if (activeSpecialty && a.specialty !== activeSpecialty) return false
      if (activeRegion && a.region !== activeRegion) return false
      if (activeType && a.type !== activeType) return false
      return true
    })
    .map(translateArtisan)

  const clearFilters = () => {
    setActiveSpecialty(null)
    setActiveRegion(null)
    setActiveType(null)
  }

  const hasFilters = activeSpecialty || activeRegion || activeType

  // Stable values for type filter — mapped to display labels
  const TYPE_OPTIONS = [
    { value: 'individuelle', label: t('filters.type_individual') },
    { value: 'coopérative', label: t('filters.type_cooperative') },
  ]

  const sidebarContent = (
    <>
      <SidebarSection title={t('filters.specialty')} delay={0.3}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {SPECIALTIES.map(spec => (
            <li key={spec}>
              <button
                onClick={() => setActiveSpecialty(activeSpecialty === spec ? null : spec)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', borderRadius: '10px',
                  color: activeSpecialty === spec ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background: activeSpecialty === spec ? 'var(--accent-gold-bg)' : 'transparent',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  textAlign: flip('left', 'right'),
                }}
              >
                <span>{spec}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: '20px' }}>
                  {ARTISANES.filter(a => a.specialty === spec).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title={t('filters.region')} delay={0.4}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {REGIONS.map(r => (
            <li key={r}>
              <button
                onClick={() => setActiveRegion(activeRegion === r ? null : r)}
                style={{
                  width: '100%', textAlign: flip('left', 'right'), padding: '8px 12px', borderRadius: '9px',
                  color: activeRegion === r ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  background: activeRegion === r ? 'var(--accent-gold-bg)' : 'transparent',
                  fontSize: '13px', cursor: 'pointer', transition: 'background 0.2s, color 0.2s',
                }}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection title={t('filters.type')} delay={0.5}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {TYPE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setActiveType(activeType === opt.value ? null : opt.value)}
              style={{
                padding: '9px 12px', borderRadius: '10px', textAlign: flip('left', 'right'), textTransform: 'capitalize',
                color: activeType === opt.value ? 'var(--accent-gold)' : 'var(--text-secondary)',
                background: activeType === opt.value ? 'var(--accent-gold-bg)' : 'transparent',
                border: activeType === opt.value ? '1px solid var(--accent-gold-border)' : '1px solid transparent',
                fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </SidebarSection>

      {hasFilters && (
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{ opacity: 0.75 }}
          onClick={clearFilters}
          style={{ fontSize: '12px', color: 'var(--destructive)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', textAlign: flip('left', 'right'), padding: '4px 0' }}
        >
          {t('page.clear_filters')}
        </motion.button>
      )}
    </>
  )

  return (
    <PageWrapper>
      <NavBar />

      {/* Hero */}
      <header style={{ padding: isNarrow ? '96px 16px 40px' : '120px 48px 60px', textAlign: 'center' }}>
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '20px', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '20px' }}
        >
          {t('page.subtitle')}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(42px, 6vw, 80px)', lineHeight: 1.05, textTransform: 'uppercase', color: 'var(--text-primary)' }}
        >
          {t('page.heading')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '17px', color: 'var(--text-secondary)', marginTop: '22px', maxWidth: '560px', margin: '22px auto 0', lineHeight: 1.7 }}
        >
          {t('page.description')}
        </motion.p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '260px 1fr', gap: isNarrow ? '0' : '28px', padding: isNarrow ? '0 16px 80px' : '0 48px 120px', maxWidth: '1500px', margin: '0 auto' }}>

        {/* Sidebar — desktop only */}
        {!isNarrow && (
          <aside style={{ position: 'sticky', top: '88px', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sidebarContent}
          </aside>
        )}

        {/* Main */}
        <main>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ marginBottom: '24px' }}
          >
            {isNarrow ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFiltersOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '18px', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="4" y1="6" x2="20" y2="6"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                      <line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                    {t('page.filters_btn')}
                  </motion.button>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {t('page.results', { count: filtered.length })}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {t('page.results', { count: filtered.length })}
                </p>
              </div>
            )}
          </motion.div>

          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)', fontSize: '15px' }}
              >
                {t('page.empty')}
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isNarrow ? '14px' : '22px' }}
              >
                {filtered.map((a, i) => (
                  <ArtisanCard
                    key={a.id}
                    artisan={a}
                    delay={i * 0.06}
                    seeWorkshopLabel={t('page.see_workshop')}
                    creationsLabel={t('page.creations', { count: a.productCount })}
                    coopLabel={t('filters.type_cooperative')}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        style={{ margin: isNarrow ? '0 16px 60px' : '0 48px 100px', borderRadius: '28px', padding: isNarrow ? '40px 20px' : '60px 48px', textAlign: 'center', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', backdropFilter: 'blur(20px)' }}
      >
        <p style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--text-primary)', letterSpacing: '2px', marginBottom: '12px' }}>
          {t('cta.heading')}
        </p>
        <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
          {t('cta.description')}
        </p>
        <motion.a
          href="/signin"
          whileHover={{ background: 'var(--accent-gold)', color: 'var(--bg-base)', scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'inline-block', padding: '14px 36px', borderRadius: '28px',
            background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)',
            color: 'var(--accent-gold)', fontFamily: "'Anek Latin', var(--font-body), sans-serif",
            fontWeight: 700, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase',
            textDecoration: 'none', cursor: 'pointer',
            transition: 'background 0.25s, color 0.25s',
          }}
        >
          {t('cta.btn')}
        </motion.a>
      </motion.section>

      {/* Bottom-sheet filters — mobile only */}
      <AnimatePresence>
        {filtersOpen && isNarrow && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'var(--bg-overlay, rgba(0,0,0,0.5))', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: 1500 }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 1501, maxHeight: '82vh', overflowY: 'auto', borderTopLeftRadius: '22px', borderTopRightRadius: '22px', background: 'var(--bg-nav)', border: '0.5px solid var(--accent-gold-border)', padding: '12px 20px 32px' }}
            >
              <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: 'var(--border-subtle)', margin: '0 auto 20px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '18px', letterSpacing: '2px', color: 'var(--text-primary)' }}>{t('filters.title')}</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFiltersOpen(false)}
                  style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >×</motion.button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {sidebarContent}
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setFiltersOpen(false)}
                style={{ width: '100%', padding: '14px', borderRadius: '999px', background: 'var(--accent-gold)', color: '#061108', border: 'none', fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}
              >{t('filters.apply')}</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
