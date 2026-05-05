'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow'
import { useDirection } from '@/hooks/useDirection.js'

/* ── Framer Motion variants ───────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ── Featured products metadata (non-translatable) ── */
const PRODUCTS_META = [
  { price: "500 DHs", badgeKey: "popular" },
  { price: "320 DHs", badgeKey: "new"     },
  { price: "85 DHs",  badgeKey: null      },
  { price: "180 DHs", badgeKey: "organic" },
  { price: "95 DHs",  badgeKey: null      },
  { price: "260 DHs", badgeKey: "new"     },
]

/* ── Featured carousel ───────────────────────────── */
const CARD_W = 300
const CARD_H = 420
const SLOTS = [-2, -1, 0, 1, 2]
const STRIDE = CARD_W + 24
const SPRING = { type: 'spring', stiffness: 260, damping: 28 }

function cardProps(offset) {
  const dist = Math.abs(offset)
  const scale = Math.max(0.62, 1 - dist * 0.18)
  const opacity = Math.max(0.35, 1 - dist * 0.28)
  const blur = dist === 0 ? 0 : dist * 2.5
  const z = 10 - dist * 3
  return { scale, opacity, blur, z }
}

function FeaturedCarousel({ isNarrow, t }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  async function fetchFeaturedProducts() {
    try {
      setLoading(true)
      const response = await fetch('/api/products?limit=6&featured=true')
      const data = await response.json()
      
      if (data.success) {
        // Transform API products to match expected structure
        const transformedProducts = data.data.products.map((product) => ({
          name: product.name,
          vendor: product.vendor?.storeName || 'Vendor',
          price: `${product.price} DHs`,
          badgeKey: product.bioCertified ? 'organic' : null
        }))
        setProducts(transformedProducts)
      } else {
        // Fallback to i18n data if API fails
        const carouselItems = t('carousel_items', { returnObjects: true, ns: 'home' })
        const fallbackProducts = PRODUCTS_META.map((meta, i) => ({
          ...meta,
          name: Array.isArray(carouselItems) ? (carouselItems[i]?.name ?? '') : '',
          vendor: Array.isArray(carouselItems) ? (carouselItems[i]?.vendor ?? '') : '',
        }))
        setProducts(fallbackProducts)
      }
    } catch (error) {
      console.error('Failed to fetch featured products:', error)
      // Fallback to i18n data
      const carouselItems = t('carousel_items', { returnObjects: true, ns: 'home' })
      const fallbackProducts = PRODUCTS_META.map((meta, i) => ({
        ...meta,
        name: Array.isArray(carouselItems) ? (carouselItems[i]?.name ?? '') : '',
        vendor: Array.isArray(carouselItems) ? (carouselItems[i]?.vendor ?? '') : '',
      }))
      setProducts(fallbackProducts)
    } finally {
      setLoading(false)
    }
  }

  const n = products.length
  const [centerIdx, setCenterIdx] = useState(0)
  const [direction, setDirection] = useState(1)
  const pausedRef = useRef(false)
  const autoRef = useRef(null)
  const dragStartX = useRef(0)
  const dragging = useRef(false)

  useEffect(() => {
    function tick() {
      if (!pausedRef.current) {
        setDirection(1)
        setCenterIdx(prev => (prev + 1 + n) % n)
      }
    }
    autoRef.current = setInterval(tick, 3200)
    return () => clearInterval(autoRef.current)
  }, [n])

  function advance(dir) {
    setDirection(dir)
    setCenterIdx(prev => (prev + dir + n) % n)
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setDirection(1)
        setCenterIdx(prev => (prev + 1 + n) % n)
      }
    }, 3200)
  }

  function onDragStart(e) {
    dragging.current = false
    dragStartX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  }
  function onDragEnd(e) {
    const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX
    const delta = dragStartX.current - endX
    if (Math.abs(delta) > 40) {
      dragging.current = true
      advance(delta > 0 ? 1 : -1)
    }
  }

  return (
    <section style={{ padding: isNarrow ? '64px 0' : '120px 0', width: '100%' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        style={{ textAlign: 'center', marginBottom: isNarrow ? '40px' : '64px', padding: isNarrow ? '0 16px' : '0 48px' }}
      >
        <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '18px', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '20px' }}>
          {t('featured.label')}
        </p>
        <h2 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
          {t('featured.heading')}
        </h2>
      </motion.div>

      {/* Stage */}
      <div
        style={{ position: 'relative', padding: '40px 0 60px', userSelect: 'none' }}
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        

        {/* Cards row */}
        <div style={{
          position: 'relative',
          height: `${CARD_H + 80}px`,
          overflow: 'hidden',
        }}>
          <AnimatePresence initial={false}>
          {products.length === 0 ? (
            <div style={{ 
              position: 'absolute', 
              left: '50%', 
              top: '50%', 
              transform: 'translate(-50%, -50%)', 
              color: 'var(--text-muted)', 
              textAlign: 'center' 
            }}>
              {loading ? 'Loading products...' : 'No featured products available'}
            </div>
          ) : SLOTS.map(offset => {
            const prodIdx = (centerIdx + offset + n * 100) % n
            const p = products[prodIdx]
            if (!p) return null
            const { scale, opacity, blur, z } = cardProps(offset)
            const isCenter = offset === 0

            return (
              <motion.div
                key={prodIdx}
                initial={{
                  x: (offset + direction) * STRIDE,
                  scale,
                  opacity: 0,
                  y: isCenter ? -14 : 0,
                }}
                animate={{
                  x: offset * STRIDE,
                  scale,
                  opacity,
                  y: isCenter ? -14 : 0,
                  filter: blur > 0 ? `blur(${blur}px)` : 'blur(0px)',
                }}
                exit={{
                  x: (offset - direction) * STRIDE,
                  opacity: 0,
                  scale,
                }}
                transition={SPRING}
                onClick={() => { if (!dragging.current && offset !== 0) advance(offset > 0 ? 1 : -1) }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${CARD_W / 2}px`,
                  marginTop: `-${CARD_H / 2}px`,
                  width: `${CARD_W}px`, height: `${CARD_H}px`,
                  borderRadius: '20px', overflow: 'hidden',
                  border: isCenter
                    ? '1px solid var(--accent-gold-border)'
                    : '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  boxShadow: isCenter ? 'var(--shadow-heavy)' : 'none',
                  cursor: offset !== 0 ? 'pointer' : 'default',
                  zIndex: z,
                }}
              >
                {/* Image area */}
                <div style={{
                  height: '58%', position: 'relative', overflow: 'hidden',
                  background: 'var(--bg-surface)',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 30% 40%, rgba(212,175,55,0.07), transparent 60%)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 50%, var(--bg-surface))',
                  }} />
                  {p.badgeKey && (
                    <span style={{
                      position: 'absolute', top: '14px', left: '14px',
                      padding: '4px 10px', borderRadius: '20px',
                      background: 'var(--accent-gold-bg-strong)',
                      border: '1px solid var(--accent-gold-border)',
                      fontSize: '9px', fontWeight: 700,
                      color: 'var(--accent-gold)', letterSpacing: '1.8px', textTransform: 'uppercase',
                    }}>{t(`badge.${p.badgeKey}`)}</span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '20px 22px 22px' }}>
                  <p style={{
                    fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)',
                    marginBottom: '6px', whiteSpace: 'nowrap',
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{p.name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '18px', letterSpacing: '0.3px' }}>{p.vendor}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '-0.5px' }}>{p.price}</span>
                    <motion.button
                      whileHover={{ background: 'var(--accent-gold)', color: 'var(--bg-base)', scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      transition={SPRING}
                      onClick={e => e.stopPropagation()}
                      style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        border: '1px solid var(--accent-gold-border)',
                        background: 'var(--accent-gold-bg)',
                        color: 'var(--accent-gold)', fontSize: '22px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >+</motion.button>
                  </div>
                </div>
              </motion.div>
            )
          })}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: isNarrow ? '0 16px' : '0 48px' }}>
        <motion.button
          whileHover={{ background: 'var(--accent-gold-bg)', borderColor: 'var(--accent-gold-border)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => advance(-1)}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-hover)', color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </motion.button>

        <div style={{ display: 'flex', gap: '8px' }}>
          {products.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setDirection(i > centerIdx ? 1 : -1); setCenterIdx(i) }}
              animate={{ width: i === centerIdx ? '24px' : '8px', background: i === centerIdx ? '#d4af37' : 'rgba(212,175,55,0.25)' }}
              transition={SPRING}
              style={{ height: '8px', borderRadius: '4px', border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ background: 'var(--accent-gold-bg)', borderColor: 'var(--accent-gold)' }}
          whileTap={{ scale: 0.92 }}
          onClick={() => advance(1)}
          style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-hover)', color: 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </motion.button>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '48px', padding: isNarrow ? '0 16px' : '0 48px' }}>
        <motion.div whileHover={{ borderColor: 'var(--accent-gold)', background: 'var(--accent-gold-bg)' }} style={{ display: 'inline-block', borderRadius: '50px', border: '1.5px solid var(--border-subtle)' }}>
          <Link href="/produits" style={{
            padding: '16px 40px', borderRadius: '50px',
            border: 'none', background: 'transparent', backdropFilter: 'blur(8px)',
            fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)', display: 'inline-block',
          }}>{t('featured.see_all')}</Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Cooperative metadata (ids only — text via i18n) ─ */
const COOPS_META = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
  { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 },
  { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
  { id: 16 }, { id: 17 }, { id: 18 }, { id: 19 }, { id: 20 },
]

// Intentionally cinematic dark gradients — always dark regardless of theme
const BG_GRADIENTS = [
  'linear-gradient(135deg, #051a07 0%, #0d3515 50%, #071205 100%)',
  'linear-gradient(135deg, #0a1a05 0%, #1a3a08 50%, #051205 100%)',
  'linear-gradient(140deg, #050f0a 0%, #0c2a1a 50%, #030d07 100%)',
  'linear-gradient(130deg, #0d1505 0%, #1e3505 50%, #080f03 100%)',
  'linear-gradient(145deg, #07100a 0%, #112a14 50%, #040c06 100%)',
]

/* ── Progress ring ───────────────────────────────── */
function ProgressRing({ duration, active, onComplete }) {
  const R = 10
  const C = 2 * Math.PI * R
  const [progress, setProgress] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!active) { setProgress(0); return }
    startRef.current = performance.now()
    function tick(now) {
      const elapsed = now - startRef.current
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else onComplete()
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, duration])

  return (
    <svg width="26" height="26" style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%) rotate(-90deg)', flexShrink: 0 }}>
      <circle cx="13" cy="13" r={R} fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="2" />
      <circle cx="13" cy="13" r={R} fill="none" stroke="#d4af37" strokeWidth="2"
        strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
    </svg>
  )
}

/* ── Cooperative Spotlight ───────────────────────── */
function CooperativeSpotlight({ isNarrow, t }) {
  const [cooperatives, setCooperatives] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    fetchCooperatives()
  }, [])

  async function fetchCooperatives() {
    try {
      setLoading(true)
      const response = await fetch('/api/vendors?limit=20')
      const data = await response.json()
      
      if (data.success) {
        // Transform vendors to cooperative format
        const transformedCooperatives = data.data.map((vendor, i) => ({
          id: vendor.id,
          name: vendor.storeName,
          region: vendor.storeAddress || 'Morocco',
          bio: `${vendor.storeName} is a trusted partner providing authentic Moroccan products with quality and tradition.`,
          badge: 'Premium Partner',
          bestseller: vendor.products?.[0]?.name || 'Quality Products'
        }))
        setCooperatives(transformedCooperatives)
      } else {
        // Fallback to i18n data
        const coopItems = t('cooperatives_items', { returnObjects: true, ns: 'home' })
        const fallbackCooperatives = COOPS_META.map((meta, i) => ({
          ...meta,
          ...(Array.isArray(coopItems) ? (coopItems[i] ?? {}) : {}),
        }))
        setCooperatives(fallbackCooperatives)
      }
    } catch (error) {
      console.error('Failed to fetch cooperatives:', error)
      // Fallback to i18n data
      const coopItems = t('cooperatives_items', { returnObjects: true, ns: 'home' })
      const fallbackCooperatives = COOPS_META.map((meta, i) => ({
        ...meta,
        ...(Array.isArray(coopItems) ? (coopItems[i] ?? {}) : {}),
      }))
      setCooperatives(fallbackCooperatives)
    } finally {
      setLoading(false)
    }
  }
  const pausedRef = useRef(false)
  const sidebarRef = useRef(null)
  const DURATION = 8000

  const coop = cooperatives[activeIdx] || {}
  const bg = BG_GRADIENTS[activeIdx % BG_GRADIENTS.length]

  if (cooperatives.length === 0) {
    return (
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', padding: '40px' }}>
          {loading ? 'Loading cooperatives...' : 'No cooperatives available'}
        </div>
      </section>
    )
  }

  function goTo(idx) {
    setActiveIdx(idx)
    if (sidebarRef.current) {
      const item = sidebarRef.current.children[idx]
      if (item) {
        const container = sidebarRef.current
        const itemTop = item.offsetTop
        const itemBottom = itemTop + item.offsetHeight
        const containerTop = container.scrollTop
        const containerBottom = containerTop + container.clientHeight
        if (itemTop < containerTop + 48) {
          container.scrollTo({ top: itemTop - 48, behavior: 'smooth' })
        } else if (itemBottom > containerBottom - 48) {
          container.scrollTo({ top: itemBottom - container.clientHeight + 48, behavior: 'smooth' })
        }
      }
    }
  }

  function onRingComplete() {
    if (!pausedRef.current) {
      goTo((activeIdx + 1) % cooperatives.length)
    }
  }

  const STAGGER_SPRING = { type: 'spring', stiffness: 280, damping: 26 }
  const textVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { ...STAGGER_SPRING, delay: i * 0.1 } }),
    exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
  }

  return (
    <section style={{ padding: '80px 0', width: '100%', position: 'relative' }}>
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: isNarrow ? '32px' : '48px', padding: isNarrow ? '0 16px' : '0 48px' }}
      >
        <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '18px', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '16px' }}>
          {t('cooperatives.label')}
        </p>
        <h2 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(36px, 4.5vw, 64px)', color: 'var(--text-primary)', textTransform: 'uppercase', lineHeight: 1 }}>
          {t('cooperatives.heading')}
        </h2>
      </motion.div>

      {/* Main stage */}
      <div style={{ position: 'relative', margin: isNarrow ? '0 16px' : '0 48px' }}>
      <div style={{
        position: 'relative',
        borderRadius: isNarrow ? '20px' : '28px', overflow: 'hidden',
        border: '1px solid var(--accent-gold-border-lo)',
        height: isNarrow ? 'auto' : '560px', minHeight: isNarrow ? '320px' : undefined, display: 'flex',
        marginRight: isNarrow ? '0' : '296px',
      }}>

        {/* Cinematic background — intentionally always dark */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'absolute', inset: 0, background: bg, zIndex: 0 }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 35% 50%, rgba(212,175,55,0.06), transparent 70%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 28%)' }} />
          </motion.div>
        </AnimatePresence>

        {/* Left content panel — text is always on dark bg, keep white */}
        <div style={{
          position: 'relative', zIndex: 2,
          flex: '1', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: isNarrow ? '32px 20px' : '52px 48px',
          maxWidth: isNarrow ? '100%' : '620px',
        }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <motion.span
                custom={0} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                style={{
                  display: 'inline-block', alignSelf: 'flex-start',
                  padding: '4px 12px', borderRadius: '20px', marginBottom: '16px',
                  background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
                  fontSize: '10px', fontWeight: 700, color: '#d4af37',
                  letterSpacing: '2px', textTransform: 'uppercase',
                }}
              >{coop.badge}</motion.span>

              <motion.h3
                custom={1} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                style={{
                  fontFamily: "'Anton SC', sans-serif",
                  fontSize: 'clamp(28px, 3.5vw, 52px)',
                  color: '#faf9f6', textTransform: 'uppercase',
                  lineHeight: 1, marginBottom: '10px',
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                }}
              >{coop.name}</motion.h3>

              <motion.p
                custom={2} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '16px', color: '#d4af37', letterSpacing: '1px', marginBottom: '20px' }}
              >📍 {coop.region}</motion.p>

              <motion.p
                custom={3} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)', maxWidth: '480px', marginBottom: '24px' }}
              >{coop.bio}</motion.p>

              <motion.div
                custom={4} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}
              >
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{t('cooperatives.bestseller_label')}</span>
                <span style={{ width: '24px', height: '1px', background: 'rgba(212,175,55,0.4)' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#d4af37' }}>{coop.bestseller}</span>
              </motion.div>

              <motion.div custom={5} variants={textVariants} initial="hidden" animate="visible" exit="exit">
                <motion.button
                  whileHover={{ background: '#d4af37', color: '#061108', y: -2, boxShadow: '0 8px 32px rgba(212,175,55,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '14px 28px', borderRadius: '50px',
                    border: '1px solid rgba(212,175,55,0.45)',
                    background: 'rgba(212,175,55,0.1)',
                    color: '#faf9f6', fontWeight: 600, fontSize: '14px',
                    cursor: 'pointer', letterSpacing: '0.3px',
                  }}
                >
                  {t('cooperatives.visit_btn')}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>{/* end inner stage card */}

        {/* Sidebar index — desktop: absolute overlay, mobile: horizontal scroll strip */}
        {!isNarrow && (
        <div
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0,
            zIndex: 10, width: '280px',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            background: 'var(--bg-nav)',
            borderRadius: '0 28px 0px 28px',
            overflow: 'hidden',
            border: '1px solid var(--accent-gold-border-lo)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{
            padding: '20px 16px 10px',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: '9px', letterSpacing: '2.5px',
            color: 'var(--text-muted)', textTransform: 'uppercase',
          }}>
            {t('cooperatives.count', { count: cooperatives.length })}
          </div>

          {/* Scrollable list with fade mask */}
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '48px',
              background: 'linear-gradient(to bottom, var(--bg-nav), transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px',
              background: 'linear-gradient(to top, var(--bg-nav), transparent)',
              zIndex: 2, pointerEvents: 'none',
            }} />
          <div
            ref={sidebarRef}
            style={{
              height: '100%', overflowY: 'auto', padding: '8px 0',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
            }}
          >
            {cooperatives.map((c, i) => {
              const isActive = i === activeIdx
              return (
                <motion.div
                  key={c.id}
                  onClick={() => { pausedRef.current = true; goTo(i) }}
                  animate={{ background: isActive ? 'var(--accent-gold-bg)' : 'transparent' }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'relative',
                    padding: '11px 16px 11px 44px',
                    cursor: 'pointer',
                    borderLeft: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                    transition: 'border-color 0.3s',
                  }}
                >
                  {isActive && (
                    <ProgressRing
                      duration={DURATION}
                      active={!pausedRef.current}
                      onComplete={onRingComplete}
                      key={`ring-${activeIdx}`}
                    />
                  )}
                  {!isActive && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '20px',
                      transform: 'translateY(-50%)',
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: 'var(--text-muted)',
                    }} />
                  )}

                  <p style={{
                    fontSize: '12px', fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    transition: 'color 0.3s', marginBottom: '2px',
                    lineHeight: 1.3,
                  }}>{c.name}</p>
                  <p style={{
                    fontSize: '10px',
                    color: isActive ? 'rgba(212,175,55,0.7)' : 'var(--text-muted)',
                    transition: 'color 0.3s',
                  }}>{c.region}</p>
                </motion.div>
              )
            })}
          </div>
          </div>
        </div>
        )}

        {/* Mobile horizontal cooperative strip */}
        {isNarrow && (
          <div style={{
            display: 'flex', overflowX: 'auto', gap: '8px',
            padding: '12px 0', marginTop: '12px',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}>
            {cooperatives.map((c, i) => {
              const isActive = i === activeIdx
              return (
                <motion.button
                  key={c.id}
                  onClick={() => goTo(i)}
                  animate={{ background: isActive ? 'var(--accent-gold-bg)' : 'var(--bg-surface)', borderColor: isActive ? 'var(--accent-gold-border)' : 'var(--border-subtle)' }}
                  transition={{ duration: 0.25 }}
                  style={{
                    flexShrink: 0, padding: '8px 14px', borderRadius: '20px',
                    border: '1px solid var(--border-subtle)', cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)' }}>{c.name}</span>
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Stat card ───────────────────────────────────── */
function StatCard({ num, label, delay = 0 }) {
  const ref = useRef(null)

  function onMouseMove(e) {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    el.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.03)`
  }

  function onMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        padding: '22px 24px', borderRadius: '18px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent-gold-border-lo)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.15s ease, border-color 0.25s, background 0.25s',
        willChange: 'transform',
      }}
    >
      <div style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '38px', color: 'var(--accent-gold)' }}>{num}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.5px' }}>{label}</div>
    </motion.div>
  )
}

/* ── Main component ──────────────────────────────── */
export default function Home() {
  const isNarrow = useIsNarrow()
  const { t } = useTranslation('home')
  const { flip, isRTL } = useDirection()
  return (
    <PageWrapper>
      <NavBar />

      {/* ── HERO ───────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isNarrow ? '96px 16px 60px' : '120px 48px 80px', textAlign: 'center', position: 'relative',
        overflow: 'hidden',
        background: '#040d05',
      }}>
        {/* Background video */}
        <video
          autoPlay muted loop playsInline
          fetchPriority="high"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            opacity: 0.18,
            zIndex: 0,
          }}
        >
          <source src="/assets/Moroccan_Market_Extreme.webm" type="video/webm" />
        </video>
        {/* Overlay — kept dark for video readability in both modes */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(4,11,5,0.55) 0%, rgba(4,11,5,0.2) 50%, rgba(4,11,5,0.75) 100%)',
          zIndex: 1,
        }} />
        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.p
          {...fadeUp(0.3)}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic', fontSize: '22px',
            color: '#d4af37', letterSpacing: '2px', marginBottom: '24px',
          }}
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.h1
          {...fadeUp(0.5)}
          style={{
            fontFamily: "'Anton SC', sans-serif",
            fontSize: 'clamp(80px, 10vw, 160px)',
            lineHeight: 0.9, letterSpacing: '6px', color: '#faf9f6',
            textShadow: '0 0 80px rgba(212,175,55,0.2), 0 4px 20px rgba(0,0,0,0.6)',
            direction: 'ltr',
          }}
        >
          BI<img src="/assets/81694cb7-7918-41a9-a93c-a54c8323bdac.png" alt="" style={{ height: '0.75em', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block' }} />HNA
        </motion.h1>

        <motion.p
          {...fadeUp(0.8)}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic', fontSize: 'clamp(18px, 2.5vw, 28px)',
            color: 'rgba(255,255,255,0.6)',
            marginTop: '24px', maxWidth: '620px', lineHeight: 1.5,
          }}
        >
          {t('hero.description')}
        </motion.p>

        {/* Search */}
        <motion.div
          {...fadeUp(1.0)}
          style={{
            marginTop: '48px',
            display: 'flex', alignItems: 'center',
            width: 'min(560px, 90vw)', borderRadius: '60px',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(212,175,55,0.14)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
          }}
        >
          <input
            type="text"
            placeholder={t('hero.search_placeholder')}
            style={{
              flex: 1, padding: '18px 24px',
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', color: '#faf9f6',
            }}
          />
          <motion.button
            whileHover={{ background: '#e6c229', scale: 1.04 }}
            style={{
              margin: '7px', padding: '12px 24px', borderRadius: '50px',
              background: '#d4af37', border: 'none', cursor: 'pointer',
              fontFamily: "'Anek Latin', sans-serif", fontWeight: 700,
              fontSize: '14px', color: '#061108', whiteSpace: 'nowrap',
            }}
          >{t('hero.search_btn')}</motion.button>
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(1.2)} style={{ marginTop: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <motion.div
            whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(212,175,55,0.4)' }}
            style={{ borderRadius: '50px', display: 'inline-block' }}
          >
            <Link href="/produits" style={{
              padding: '16px 40px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #d4af37, #e6c229)',
              fontWeight: 700, fontSize: '15px', color: '#061108',
              display: 'inline-block', boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
            }}>{t('hero.cta_products')}</Link>
          </motion.div>
          <motion.div
            whileHover={{ y: -3, borderColor: '#d4af37', background: 'rgba(212,175,55,0.08)' }}
            style={{ borderRadius: '50px', border: '1.5px solid rgba(255,255,255,0.22)', display: 'inline-block' }}
          >
            <Link href="/signin" style={{
              padding: '16px 40px', borderRadius: '50px',
              border: 'none',
              background: 'transparent', backdropFilter: 'blur(8px)',
              fontWeight: 600, fontSize: '15px', color: '#faf9f6',
              display: 'inline-block', transition: 'all 0.25s',
            }}>{t('hero.cta_join')}</Link>
          </motion.div>
        </motion.div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: '32px', left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 2,
        }}>
        <motion.div
          {...fadeUp(1.6)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            color: 'rgba(255,255,255,0.3)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
          }}
        >
          <motion.div
            animate={{ scaleY: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, #d4af37, transparent)' }}
          />
          <span>{t('hero.scroll')}</span>
        </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ────────────────────────────────── */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--accent-gold-bg)', padding: '26px 0' }}>
        <div style={{ display: 'flex', gap: '60px', animation: `${isRTL ? 'marquee-rtl' : 'marquee'} 30s linear infinite`, whiteSpace: 'nowrap' }}>
          {['Miel Beldi','◆','Huile d\'Argan','◆','Savon Beldi','◆','Couscous Maison','◆','Ghee Artisanal','◆','Amlou','◆','Msemen','◆','Ras el Hanout','◆','Miel Beldi','◆','Huile d\'Argan','◆','Savon Beldi','◆','Couscous Maison','◆','Ghee Artisanal','◆','Amlou','◆','Msemen','◆','Ras el Hanout','◆'].map((item, i) => (
            <span key={i} style={{
              fontFamily: "'Anton SC', sans-serif",
              fontSize: item === '◆' ? '20px' : '17px', letterSpacing: '4px',
              color: item === '◆' ? 'var(--accent-gold)' : 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ──────────────────────── */}
      <FeaturedCarousel isNarrow={isNarrow} t={t} />

      {/* ── COOPERATIVE SPOTLIGHT ─────────────────── */}
      <CooperativeSpotlight isNarrow={isNarrow} t={t} />

      {/* ── ABOUT ──────────────────────────────────── */}
      <section style={{ padding: isNarrow ? '48px 16px 64px' : '80px 48px 120px', maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))', gap: isNarrow ? '40px' : '80px', alignItems: 'center' }}>
        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'relative', borderRadius: '32px', height: isNarrow ? '320px' : '480px',
            background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))',
            border: '1px solid var(--accent-gold-border-lo)', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '28px',
            background: 'var(--bg-elevated)',
            backdropFilter: 'blur(16px)', borderTop: '1px solid var(--accent-gold-border-lo)',
          }}>
            <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '20px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t('about.quote')}
            </p>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '18px', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '16px' }}>{t('about.label')}</p>
          <h2 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(36px, 4.5vw, 64px)', lineHeight: 1, color: 'var(--text-primary)', textTransform: 'uppercase' }}>
            {t('about.heading')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, marginTop: '20px' }}>
            {t('about.text')}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, marginTop: '16px' }}>
            {t('about.mission')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '36px' }}>
            <StatCard num={t('stats.artisans_val')} label={t('stats.artisans')} delay={0.1} />
            <StatCard num={t('stats.regions_val')} label={t('stats.regions')} delay={0.2} />
            <StatCard num={t('stats.natural_val')} label={t('stats.natural')} delay={0.3} />
            <StatCard num={t('stats.clients_val')} label={t('stats.clients')} delay={0.4} />
          </div>
        </motion.div>
      </section>

      {/* ── FAMILY CTA ─────────────────────────────── */}
      <section style={{ padding: isNarrow ? '40px 16px 0' : '40px 48px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '18px', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '20px' }}>
              {t('family.label')}
            </p>
            <h2 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(40px, 5vw, 80px)', lineHeight: 1.1, color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '20px' }}>
              {t('family.heading')}
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '22px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              {t('family.subheading')}
            </p>
          </motion.div>

          {/* Map card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.15 }}
            style={{
              borderRadius: '28px', overflow: 'hidden',
              border: '1px solid var(--accent-gold-border-lo)',
              boxShadow: 'var(--shadow-heavy)',
              height: isNarrow ? '280px' : '460px',
            }}
          >
            <iframe
              title="Morocco Map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3612345!2d-7.0926!3d31.7917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sma!4v1712600000000!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg) saturate(0.6) brightness(0.85)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          {/* CTA below the card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ marginTop: '36px', marginBottom: '100px' }}
          >
            <motion.div
              whileHover={{ y: -4, boxShadow: '0 16px 60px rgba(212,175,55,0.15)' }}
              style={{ display: 'inline-block', borderRadius: '60px' }}
            >
              <Link href="/signin" style={{
                display: 'inline-flex', alignItems: 'center', gap: isNarrow ? '14px' : '20px',
                padding: isNarrow ? '18px 24px' : '24px 40px', borderRadius: '60px',
                background: 'var(--bg-surface)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--accent-gold-border)',
                boxShadow: 'var(--shadow-card)',
              }}>
                <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {t('family.join_btn')}
                </span>
                <motion.div
                  whileHover={{ x: 4 }}
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'var(--accent-gold)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--bg-base)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: isNarrow ? '32px' : '60px',
          padding: isNarrow ? '48px 16px 40px' : '80px 64px 60px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <p style={{
              fontFamily: "'Anton SC', sans-serif",
              fontSize: '26px', letterSpacing: '4px',
              color: 'var(--text-primary)', marginBottom: '20px',
            }}>BIOHNA.</p>
            <p style={{
              fontSize: '13px', lineHeight: 1.8,
              color: 'var(--text-muted)', maxWidth: '240px',
            }}>
              {t('footer.brand_desc')}
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '28px' }}>
              {[t('footer.instagram'), t('footer.pinterest'), t('footer.vimeo')].map(s => (
                <span key={s} style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  cursor: 'pointer', letterSpacing: '0.5px',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >{s}</span>
              ))}
            </div>
          </div>

          {/* La Maison column */}
          <div>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px',
              textTransform: 'uppercase', color: 'var(--text-secondary)',
              marginBottom: '24px',
            }}>{t('footer.company_label')}</p>
            {[[t('footer.our_story'), '/'], [t('footer.artisans'), '/vendeurs'], [t('footer.sustainability'), '/'], [t('footer.press'), '/']].map(([label, to]) => (
              <Link key={label} href={to} style={{
                display: 'block', fontSize: '13px',
                color: 'var(--text-muted)',
                marginBottom: '14px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>

          {/* Boutique column */}
          <div>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px',
              textTransform: 'uppercase', color: 'var(--text-secondary)',
              marginBottom: '24px',
            }}>{t('footer.shop_label')}</p>
            {[[t('footer.all_products'), '/produits'], [t('footer.cosmetics'), '/produits'], [t('footer.epicerie'), '/produits'], [t('footer.cart'), '/cart']].map(([label, to]) => (
              <Link key={label} href={to} style={{
                display: 'block', fontSize: '13px',
                color: 'var(--text-muted)',
                marginBottom: '14px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>

          {/* Contact column */}
          <div>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px',
              textTransform: 'uppercase', color: 'var(--text-secondary)',
              marginBottom: '24px',
            }}>{t('footer.support_label')}</p>
            {[[t('footer.service'), '/'], [t('footer.delivery'), '/'], [t('footer.privacy'), '/'], [t('footer.sell'), '/vendeurs']].map(([label, to]) => (
              <Link key={label} href={to} style={{
                display: 'block', fontSize: '13px',
                color: 'var(--text-muted)',
                marginBottom: '14px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: isNarrow ? '20px 16px' : '20px 64px', flexWrap: 'wrap', gap: '12px',
          borderTop: '1px solid var(--border-subtle)',
          maxWidth: '1400px', margin: '0 auto',
        }}>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {t('footer.copyright')}
          </p>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {t('footer.tagline')}
          </p>
        </div>
      </footer>
    </PageWrapper>
  )
}
