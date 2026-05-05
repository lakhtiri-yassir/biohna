'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../context/ModalContext.jsx'
import { useDirection } from '../../hooks/useDirection.js'
import { useIsNarrow } from '../../hooks/useIsNarrow'

// ─── Feature Panel (left 37%) ────────────────────────────────────────────────

function AtelierFeaturePanel({ artisan, onViewProfile, t, flip }) {
  const specialtyColor = '#d4af37' // Default gold color for all vendors
  const storyExcerpt = artisan
    ? artisan.story.slice(0, 130) + (artisan.story.length > 130 ? '…' : '')
    : ''

  return (
    <div style={{
      width: '37%',
      flexShrink: 0,
      position: 'relative',
      [flip('borderRight', 'borderLeft')]: '0.5px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '32px 28px 28px',
      overflow: 'hidden',
    }}>
      {/* Watermark initials */}
      <AnimatePresence mode="sync">
        <motion.div
          key={(artisan?.initials ?? '?') + '-wm'}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.04, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-display), sans-serif',
            fontSize: '140px',
            color: 'var(--accent-gold)',
            letterSpacing: '12px',
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            lineHeight: 1,
          }}
        >
          {artisan?.initials ?? '?'}
        </motion.div>
      </AnimatePresence>

      {/* Content — animates on artisan change */}
      <AnimatePresence mode="wait">
        {artisan ? (
          <motion.div
            key={artisan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* Name */}
            <p style={{
              fontFamily: 'var(--font-serif), serif',
              fontSize: 'clamp(26px, 3vw, 42px)',
              fontWeight: 600,
              fontStyle: 'italic',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {artisan.name}
            </p>

            {/* Region */}
            <p style={{
              fontFamily: 'var(--font-body), sans-serif',
              fontSize: '10px',
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '14px',
            }}>
              {artisan.region}
            </p>

            {/* Specialty */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              [flip('borderLeft', 'borderRight')]: '0.5px solid var(--accent-gold)',
              [flip('paddingLeft', 'paddingRight')]: '10px',
              marginBottom: '18px',
            }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.5px',
              }}>
                {artisan.specialtyLabel}
              </span>
            </div>

            {/* Story excerpt */}
            <p style={{
              fontFamily: 'var(--font-serif), serif',
              fontSize: '13px',
              fontStyle: 'italic',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '22px',
            }}>
              {storyExcerpt}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '22px' }}>
              {[
                { label: t('vendeurs.products_count', { count: artisan.productCount }), value: String(artisan.productCount) },
                { label: t('vendeurs.member_since'), value: artisan.memberSince },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  borderBottom: '0.5px solid var(--accent-gold-border)',
                  paddingBottom: '4px',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display), sans-serif',
                    fontSize: '15px',
                    color: 'var(--accent-gold)',
                    letterSpacing: '1px',
                  }}>
                    {value}
                  </p>
                  <p style={{
                    fontSize: '9px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ opacity: 1, x: flip(2, -2) }}
              onClick={onViewProfile}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontSize: '11px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--accent-gold)',
                opacity: 0.75,
                fontFamily: 'var(--font-body), sans-serif',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {t('vendeurs.view_profile')}
              <span>{flip('›', '‹')}</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-serif), serif',
              fontStyle: 'italic',
              fontSize: '13px',
              color: 'var(--text-muted)',
              lineHeight: 1.7,
            }}>
              {t('vendeurs.hover_to_discover')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Region Dropdown ─────────────────────────────────────────────────────────

function RegionDropdown({ activeRegion, onChange, placeholder, flip, regions }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const options = [{ value: '', label: placeholder }, ...regions.map(r => ({ value: r, label: r }))]
  const selected = options.find(o => o.value === (activeRegion ?? '')) ?? options[0]

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          background: open ? 'var(--accent-gold-bg)' : 'var(--bg-surface)',
          border: open ? '0.5px solid var(--accent-gold-border)' : '0.5px solid var(--border-subtle)',
          borderRadius: '3px',
          color: activeRegion ? 'var(--accent-gold)' : 'var(--text-muted)',
          fontSize: '11px',
          fontFamily: 'var(--font-body), sans-serif',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background 0.15s, border-color 0.15s, color 0.15s',
        }}
      >
        {selected.label}
        <span style={{
          fontSize: '9px',
          color: activeRegion ? 'var(--accent-gold)' : 'var(--text-muted)',
          opacity: 0.7,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.18s',
          display: 'inline-block',
        }}>▾</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.92 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 5px)',
              [flip('right', 'left')]: 0,
              minWidth: '150px',
              background: 'var(--bg-elevated)',
              border: '0.5px solid var(--accent-gold-border-lo)',
              borderRadius: '4px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.06)',
              zIndex: 100,
              overflow: 'hidden',
              transformOrigin: 'top',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === (activeRegion ?? '')
              return (
                <button
                  key={opt.value || '__all'}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 14px',
                    textAlign: flip('left', 'right'),
                    background: isSelected ? 'var(--accent-gold-bg)' : 'transparent',
                    borderBottom: i < options.length - 1 ? '0.5px solid var(--border-subtle)' : 'none',
                    color: isSelected ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body), sans-serif',
                    fontWeight: isSelected ? 600 : 400,
                    letterSpacing: '0.3px',
                    cursor: 'pointer',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
                >
                  {opt.label}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Directory Header ─────────────────────────────────────────────────────────

function DirectoryHeader({ activeTab, setActiveTab, activeRegion, setActiveRegion, search, setSearch, onFilterChange, t, TABS, flip, regions }) {
  const handleTabClick = (id) => { setActiveTab(id); onFilterChange() }
  const handleRegionChange = (val) => { setActiveRegion(val || null); onFilterChange() }
  const handleSearchChange = (e) => { setSearch(e.target.value); onFilterChange() }

  return (
    <div style={{
      padding: '20px 24px 14px',
      borderBottom: '0.5px solid var(--border-subtle)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Search — underline style */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '7px',
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px', flexShrink: 0 }}>⌕</span>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder={t('vendeurs.search_placeholder')}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        {search && (
          <button
            onClick={() => { setSearch(''); onFilterChange() }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', padding: 0, flexShrink: 0 }}
          >✕</button>
        )}
      </div>

      {/* Tabs + Region select row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
        {/* Specialty tabs */}
        <div style={{ display: 'flex', gap: '4px', flex: 1, overflowX: 'auto' }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-body), sans-serif',
                  fontWeight: 600,
                  fontSize: '10px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  background: isActive ? 'var(--accent-gold-bg)' : 'transparent',
                  border: isActive ? '0.5px solid var(--accent-gold-border)' : '0.5px solid var(--border-subtle)',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Region dropdown */}
        <RegionDropdown
          activeRegion={activeRegion}
          onChange={(val) => { handleRegionChange(val); }}
          placeholder={t('vendeurs.filter_region_placeholder')}
          flip={flip}
          regions={regions}
        />
      </div>
    </div>
  )
}

// ─── Directory Row ────────────────────────────────────────────────────────────

function DirectoryRow({ artisan, isActive, onHover, onClick, productsLabel, flip, isNarrow }) {
  const specialtyColor = '#d4af37' // Default gold color for all vendors

  return (
    <div
      onMouseEnter={() => onHover(artisan.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(artisan)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        height: isNarrow ? '62px' : '52px',
        padding: '0 24px',
        cursor: 'pointer',
        borderBottom: '0.5px solid var(--border-subtle)',
        [flip('borderLeft', 'borderRight')]: isActive ? '1.5px solid var(--accent-gold)' : '1.5px solid transparent',
        background: isActive ? 'var(--accent-gold-bg)' : 'transparent',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        flexShrink: 0,
        background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))',
        border: '0.5px solid var(--accent-gold-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-body), sans-serif',
        fontWeight: 700,
        fontSize: '10px',
        letterSpacing: '0.5px',
        color: 'var(--accent-gold)',
      }}>
        {artisan.initials}
      </div>

      {/* Name + Region */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 600,
          fontSize: '13px',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3,
        }}>
          {artisan.name}
        </p>
        <p style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '0.5px',
          marginTop: '1px',
        }}>
          {artisan.region}{isNarrow ? ` · ${artisan.specialtyLabel}` : ''}
        </p>
      </div>

      {/* Specialty dot + label (desktop only) */}
      {!isNarrow && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          <div style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: specialtyColor,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            {artisan.specialtyLabel}
          </span>
        </div>
      )}

      {/* Product count */}
      <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>
        {productsLabel}
      </span>

      {/* Arrow */}
      <span style={{
        color: 'var(--accent-gold)',
        fontSize: '14px',
        opacity: isActive ? 0.9 : 0.4,
        flexShrink: 0,
        transition: 'opacity 0.15s',
      }}>
        {flip('›', '‹')}
      </span>
    </div>
  )
}

// ─── Directory Panel (right) ──────────────────────────────────────────────────

function AtelierDirectoryPanel({ filtered, activeTab, setActiveTab, activeRegion, setActiveRegion, search, setSearch, hoveredArtisan, setHoveredArtisan, onRowClick, isNarrow, t, flip, regions }) {
  const TABS = [
    { id: 'all', label: t('vendeurs.tabs.all') },
    { id: 'Alimentation', label: t('vendeurs.tabs.food') },
    { id: 'Huiles', label: t('vendeurs.tabs.oils') },
    { id: 'Cosmétiques', label: t('vendeurs.tabs.beauty') },
    { id: 'Épices', label: t('vendeurs.tabs.spices') },
  ]

  const resetHovered = () => setHoveredArtisan(null)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <DirectoryHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        search={search}
        setSearch={setSearch}
        onFilterChange={resetHovered}
        t={t}
        TABS={TABS}
        flip={flip}
        regions={regions}
      />

      {/* Count label */}
      <div style={{ padding: '8px 24px 4px', flexShrink: 0 }}>
        <p style={{
          fontSize: '10px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}>
          {t('vendeurs.artisan_count', { count: filtered.length })}
          {activeRegion ? ` · ${activeRegion}` : ''}
        </p>
      </div>

      {/* Directory list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            fontFamily: 'var(--font-serif), serif',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--text-muted)',
          }}>
            {t('vendeurs.empty')}
          </div>
        ) : (
          filtered.map((artisan) => (
            <DirectoryRow
              key={artisan.id}
              artisan={artisan}
              isActive={hoveredArtisan === artisan.id}
              onHover={setHoveredArtisan}
              onClick={onRowClick}
              productsLabel={t('vendeurs.products_count', { count: artisan.productCount })}
              flip={flip}
              isNarrow={isNarrow}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Root Modal ───────────────────────────────────────────────────────────────

export default function VendeurModal() {
  const { activeModal, setActiveModal } = useModal()
  const { t } = useTranslation('modals')
  const { flip, dir } = useDirection()
  const router = useRouter()
  const isNarrow = useIsNarrow()

  const [activeTab, setActiveTab] = useState('all')
  const [activeRegion, setActiveRegion] = useState(null)
  const [search, setSearch] = useState('')
  const [hoveredArtisan, setHoveredArtisan] = useState(null)
  const [vendors, setVendors] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(false)

  const isOpen = activeModal === 'vendeurs'

  useEffect(() => {
    if (isOpen && vendors.length === 0) {
      fetchVendors()
    }
  }, [isOpen])

  async function fetchVendors() {
    try {
      setLoading(true)
      const response = await fetch('/api/vendors')
      const data = await response.json()
      
      if (data.success) {
        // Transform vendor data to match expected artisan structure
        const transformedVendors = data.data.map(vendor => ({
          id: vendor.id,
          name: vendor.storeName,
          region: vendor.storeAddress || 'Morocco',
          story: `${vendor.storeName} is a trusted vendor providing quality Moroccan products.`,
          specialtyLabel: 'Produits Authentiques',
          specialty: 'all', // Default specialty for filtering
          initials: vendor.storeName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase(),
          productCount: vendor.products?.length || 0,
          memberSince: new Date(vendor.createdAt).getFullYear()
        }))
        
        setVendors(transformedVendors)
        
        // Extract unique regions
        const uniqueRegions = [...new Set(transformedVendors.map(v => v.region))]
        setRegions(uniqueRegions)
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const close = () => {
    setActiveModal(null)
    setSearch('')
    setActiveTab('all')
    setActiveRegion(null)
    setHoveredArtisan(null)
  }

  const filtered = vendors.filter(a => {
    const matchTab = activeTab === 'all' || a.specialty === activeTab
    const matchRegion = !activeRegion || a.region === activeRegion
    const q = search.toLowerCase()
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.region.toLowerCase().includes(q) || a.specialtyLabel.toLowerCase().includes(q)
    return matchTab && matchRegion && matchSearch
  })

  const featuredArtisan = hoveredArtisan
    ? (vendors.find(a => a.id === hoveredArtisan) ?? filtered[0] ?? null)
    : (filtered[0] ?? null)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'var(--bg-overlay)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            dir={dir}
            style={{
              width: 'min(96vw, 900px)',
              height: 'min(88vh, 680px)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-elevated)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '0.5px solid var(--accent-gold-border-lo)',
              borderRadius: '4px',
              boxShadow: 'var(--shadow-heavy)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '18px 28px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '0.5px solid var(--border-subtle)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  letterSpacing: '3px',
                }}>
                  {t('vendeurs.heading')}
                </span>
                <span style={{
                  fontFamily: 'var(--font-serif), serif',
                  fontStyle: 'italic',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.3px',
                }}>
                  {t('vendeurs.artisan_count', { count: vendors.length })}
                </span>
              </div>
              <motion.button
                whileHover={{ background: 'var(--destructive-bg)', color: 'var(--destructive)' }}
                onClick={close}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: 'var(--bg-surface)',
                  border: '0.5px solid var(--accent-gold-border-lo)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >✕</motion.button>
            </div>

            {/* Body: feature panel + directory */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              {!isNarrow && (
                <AtelierFeaturePanel
                  artisan={featuredArtisan}
                  onViewProfile={() => { if (featuredArtisan) { router.push(`/vendeurs/${featuredArtisan.id}`); close() } }}
                  t={t}
                  flip={flip}
                />
              )}
              <AtelierDirectoryPanel
                filtered={filtered}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeRegion={activeRegion}
                setActiveRegion={setActiveRegion}
                search={search}
                setSearch={setSearch}
                hoveredArtisan={hoveredArtisan}
                setHoveredArtisan={setHoveredArtisan}
                onRowClick={(artisan) => { router.push(`/vendeurs/${artisan.id}`); close() }}
                isNarrow={isNarrow}
                t={t}
                flip={flip}
                regions={regions}
              />
            </div>

            {/* Footer */}
            <div style={{
              padding: '14px 28px 20px',
              borderTop: '0.5px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <motion.button
                whileHover={{ opacity: 0.75 }}
                onClick={() => { router.push('/vendeurs'); close() }}
                style={{
                  fontSize: '12px', color: 'var(--accent-gold)', fontWeight: 600,
                  letterSpacing: '0.5px', cursor: 'pointer', background: 'none', border: 'none',
                }}
              >
                {t('vendeurs.see_all')}
              </motion.button>
              <motion.button
                whileHover={{ borderColor: 'var(--accent-gold-border)', color: 'var(--text-secondary)' }}
                onClick={() => { router.push('/signin'); close() }}
                style={{
                  fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500,
                  cursor: 'pointer', background: 'none',
                  border: '0.5px solid var(--border-subtle)',
                  borderRadius: '3px',
                  padding: '5px 12px',
                  letterSpacing: '0.5px',
                  fontFamily: 'var(--font-body), sans-serif',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                {t('vendeurs.become_partner')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
