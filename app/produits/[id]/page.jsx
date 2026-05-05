'use client'

import { useState, useEffect } from 'react'
import { useIsNarrow } from '@/hooks/useIsNarrow.js'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useModal } from '@/context/ModalContext.jsx'
import { useTheme } from '@/context/ThemeContext.jsx'
import { useDirection } from '@/hooks/useDirection.js'
import { translateProduct, translateArtisan } from '@/utils/translateProduct.js'

const EASE = [0.22, 1, 0.36, 1]

/* -- helpers ------------------------------------------------------------- */

function AvatarCircle({ initials, size = 72 }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))',
      border: '2px solid var(--accent-gold-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontWeight: 700,
      fontSize: `${Math.round(size * 0.28)}px`, letterSpacing: '2px', color: 'var(--accent-gold)',
    }}>
      {initials}
    </div>
  )
}

const TrustIcon = ({ d }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
)
const ICON_TRUCK = "M3 7h11v8H3zM14 10h4l3 3v2h-7zM6 18a2 2 0 1 0 0-1 2 2 0 0 0 0 1zM17 18a2 2 0 1 0 0-1 2 2 0 0 0 0 1z"
const ICON_COIN  = "M12 3v18M5 7c0-1.5 3-3 7-3s7 1.5 7 3M5 12c0 1.5 3 3 7 3s7-1.5 7-3M5 7v10c0 1.5 3 3 7 3s7-1.5 7-3V7"
const ICON_LEAF  = "M4 20c0-9 6-15 16-16-1 10-7 16-16 16zM4 20c4-4 8-8 12-12"

function firstSentence(text) {
  if (!text) return ''
  const m = text.match(/^[^.!?]*[.!?]/)
  return m ? m[0] : text
}

function withFallbacks(product, artisan, defaultComposition) {
  return {
    tagline: product.tagline || artisan.specialtyLabel,
    description: product.description || firstSentence(artisan.story),
    longDescription: product.longDescription || artisan.story,
    composition: product.composition?.length ? product.composition : [defaultComposition],
    origin: product.origin || artisan.region,
    weight: product.weight || null,
    stock: typeof product.stock === 'number' ? product.stock : null,
  }
}

function MiniProductCard({ product, delay, onClick, isMobile, flip }) {
  const { isDark } = useTheme()
  const { t: tc } = useTranslation('common')
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      whileHover={{ y: -6, boxShadow: isDark
        ? '0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.2)'
        : '0 16px 50px rgba(44,44,44,0.12), 0 0 0 1px rgba(212,175,55,0.2)' }}
      onClick={onClick}
      style={{
        borderRadius: '22px', overflow: 'hidden',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--accent-gold-border-lo)',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
      }}
    >
      <div style={{ height: isMobile ? '130px' : '180px', overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, var(--accent-gold-bg), var(--bg-surface-hover))' }}>
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.25))' }} />
        {product.badgeKey && (
          <span style={{ position: 'absolute', top: '12px', [flip('left', 'right')]: '12px',
            padding: '4px 12px', borderRadius: '20px',
            background: 'var(--accent-gold-bg-strong)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--accent-gold-border)',
            fontSize: '10px', fontWeight: 700, color: 'var(--accent-amber)',
            letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {tc(`badge.${product.badgeKey}`)}
          </span>
        )}
      </div>
      <div style={{ padding: '16px 20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '5px' }}>{product.category}</p>
        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)',
          marginBottom: '10px', lineHeight: 1.3 }}>{product.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {product.oldPrice && (
            <span style={{ fontSize: '11px', color: 'var(--destructive)',
              textDecoration: 'line-through', [flip('marginRight', 'marginLeft')]: '6px' }}>{product.oldPrice}</span>
          )}
          <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent-gold)' }}>{product.price}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* -- main ---------------------------------------------------------------- */

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { setActiveModal } = useModal()
  const { t } = useTranslation('products')
  const { t: tc } = useTranslation('common')
  const { flip } = useDirection()

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [isFavorite, setIsFavorite] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const isNarrow = useIsNarrow(900)
  const isMobile = useIsNarrow(768)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/products/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.data)
          
          // Fetch related products from same vendor
          const relatedResponse = await fetch(`/api/products?vendor=${data.data.vendor.id}&limit=4`)
          const relatedData = await relatedResponse.json()
          
          if (relatedData.success) {
            // Filter out current product
            const filtered = relatedData.data.products?.filter(p => p.id !== data.data.id) || []
            setRelatedProducts(filtered.slice(0, 3))
          }
        } else {
          setError(data.error)
        }
      } catch (err) {
        console.error('Failed to fetch product:', err)
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
      setQuantity(1)
      setActiveTab('description')
      setIsFavorite(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [id])

  if (loading) {
    return (
      <PageWrapper>
        <NavBar />
        <div style={{ padding: isMobile ? '120px 20px' : '160px 48px', textAlign: 'center' }}>
          <div style={{ 
            display: 'inline-block',
            width: '40px', 
            height: '40px', 
            border: '4px solid var(--accent-gold-border)',
            borderTop: '4px solid var(--accent-gold)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading...</p>
        </div>
      </PageWrapper>
    )
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <NavBar />
        <div style={{ padding: isMobile ? '120px 20px' : '160px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '32px',
            color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '2px' }}>
            {t('detail.not_found')}
          </p>
          <motion.button
            whileHover={{ color: 'var(--accent-gold)' }}
            onClick={() => router.push('/produits')}
            style={{ fontSize: '14px', color: 'var(--text-muted)',
              background: 'none', border: 'none', cursor: 'pointer' }}
          >{t('detail.back_catalog')}</motion.button>
        </div>
      </PageWrapper>
    )
  }

  // Transform API product data to match expected structure
  const artisan = product.vendor
  const f = withFallbacks(product, artisan, t('detail.default_composition'))
  const specialtyColor = '#d4af37' // Default gold color for now

  // Use fetched related products
  const related = relatedProducts

  const backLabel = t('detail.back_catalog')
  const backTarget = '/produits'

  const TABS = [
    { id: 'description', label: t('detail.tab_desc') },
    { id: 'composition', label: t('detail.tab_composition') },
    { id: 'origine',     label: t('detail.tab_origin') },
    { id: 'livraison',   label: t('detail.tab_delivery') },
  ]

  const TRUST_ITEMS = [
    { d: ICON_TRUCK, label: t('detail.trust_delivery') },
    { d: ICON_COIN,  label: t('detail.trust_payment') },
    { d: ICON_LEAF,  label: t('detail.trust_certified') },
  ]

  const bodyStyle = {
    fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
    fontSize: '17px', lineHeight: 1.75, color: 'var(--text-secondary)',
    maxWidth: '720px', whiteSpace: 'pre-line',
  }

  const renderTab = () => {
    if (activeTab === 'description') return <p style={bodyStyle}>{f.longDescription}</p>
    if (activeTab === 'composition') return (
      <ul style={{ ...bodyStyle, listStyle: 'none', padding: 0 }}>
        {f.composition.map((c, i) => (
          <li key={i} style={{ display: 'flex', gap: '14px', marginBottom: '10px', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '14px', letterSpacing: '2px' }}>—</span>
            <span>{c}</span>
          </li>
        ))}
      </ul>
    )
    if (activeTab === 'origine') return (
      <p style={bodyStyle}>
        {f.origin}.{' '}
        {artisan.type === 'coopérative'
          ? t('detail.origin_coop', { name: artisan.name, year: artisan.memberSince })
          : t('detail.origin_artisan', { name: artisan.name, region: artisan.region })}
      </p>
    )
    if (activeTab === 'livraison') return <p style={bodyStyle}>{t('detail.delivery_text')}</p>
    return null
  }

  return (
    <PageWrapper>
      <NavBar />

      <div style={{ padding: isMobile ? '90px 16px 0' : '100px 48px 0', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: flip(-12, 12) }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ color: 'var(--accent-gold)', x: flip(-2, 2) }}
          onClick={() => router.push(backTarget)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px',
            color: 'var(--text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', marginBottom: '40px',
            fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontWeight: 600,
            letterSpacing: '0.5px', transition: 'color 0.2s' }}
        >
          {backLabel}
        </motion.button>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: isNarrow ? '1fr' : '1.1fr 1fr',
          gap: isMobile ? '32px' : '56px',
          marginBottom: isMobile ? '50px' : '100px',
          alignItems: 'start',
        }}>
          {/* LEFT — visual stack */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
          >
            <div style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              borderRadius: '28px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--bg-surface) 55%, var(--accent-gold-bg) 100%)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '0.5px solid var(--accent-gold-border)',
              boxShadow: 'var(--shadow-heavy)',
            }}>
              <div style={{ position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 30% 25%, rgba(212,175,55,0.18), transparent 60%)' }} />

              {product.badgeKey && (
                <span style={{
                  position: 'absolute', top: '20px', [flip('left', 'right')]: '20px',
                  padding: '6px 14px', borderRadius: '20px',
                  background: 'var(--accent-gold-bg-strong)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--accent-gold-border)',
                  fontSize: '10px', fontWeight: 700, color: 'var(--accent-amber)',
                  letterSpacing: '2px', textTransform: 'uppercase',
                }}>{tc(`badge.${product.badgeKey}`)}</span>
              )}

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setIsFavorite(v => !v)}
                aria-label={t('detail.add_favorites')}
                style={{
                  position: 'absolute', top: '20px', [flip('right', 'left')]: '20px',
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: isFavorite ? '#ff8888' : 'rgba(255,255,255,0.7)',
                  fontSize: '16px',
                }}
              >{isFavorite ? '♥' : '♡'}</motion.button>
            </div>

            {/* Thumbnail strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px', marginTop: '18px' }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '14px',
                  background: i === 0
                    ? 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--bg-surface))'
                    : 'var(--bg-surface)',
                  border: i === 0
                    ? '1px solid var(--accent-gold-border)'
                    : '0.5px solid var(--border-subtle)',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }} />
              ))}
            </div>
          </motion.div>

          {/* RIGHT — buy panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease: EASE }}
            style={{ paddingTop: isNarrow ? 0 : '8px' }}
          >
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px',
              textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '14px',
            }}>{product.category}</p>

            <h1 style={{
              fontFamily: "'Anton SC', var(--font-display), sans-serif",
              fontSize: 'clamp(30px, 4.2vw, 52px)',
              lineHeight: 1.05,
              letterSpacing: '1.5px',
              color: 'var(--text-primary)',
              marginBottom: '14px',
            }}>{product.name}</h1>

            {/* Artisan byline */}
            <p style={{ fontSize: '13px', color: 'var(--text-muted)',
              marginBottom: '20px', letterSpacing: '0.3px' }}>
              {t('detail.by_prefix')}{' '}
              <Link href={`/vendeurs/${artisan.id}`} style={{
                color: 'var(--text-secondary)', fontWeight: 600,
                textDecoration: 'none', borderBottom: '1px solid var(--accent-gold-border)',
                paddingBottom: '1px', transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >{artisan.name}</Link>
              {' · '}{artisan.region}
              {' · '}
              <span style={{
                fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                textTransform: 'uppercase', color: '#061108',
                background: specialtyColor, padding: '3px 10px', borderRadius: '14px',
                [flip('marginLeft', 'marginRight')]: '4px',
              }}>{artisan.specialtyLabel}</span>
            </p>

            {/* Tagline */}
            <p style={{
              fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
              fontSize: '20px', lineHeight: 1.4, color: 'var(--text-secondary)',
              marginBottom: '28px', maxWidth: '480px',
            }}>{f.tagline}</p>

            {/* Short description */}
            <p style={{
              fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)',
              marginBottom: '32px', maxWidth: '500px',
            }}>{f.description}</p>

            {/* Price block */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '14px',
              paddingBottom: '28px', marginBottom: '28px',
              borderBottom: '0.5px solid var(--border-subtle)',
            }}>
              <span style={{
                fontSize: '36px', fontWeight: 700, color: 'var(--accent-gold)',
                letterSpacing: '0.5px',
              }}>{product.price}</span>
              {product.oldPrice && (
                <>
                  <span style={{
                    fontSize: '16px', color: 'var(--destructive)',
                    textDecoration: 'line-through',
                  }}>{product.oldPrice}</span>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px',
                    textTransform: 'uppercase', color: '#061108',
                    background: 'var(--accent-amber)', padding: '4px 10px',
                    borderRadius: '14px',
                  }}>{tc('badge.promo')}</span>
                </>
              )}
              {f.weight && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)',
                  marginLeft: 'auto' }}>{f.weight}</span>
              )}
            </div>

            {/* Quantity + CTA row */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'stretch', marginBottom: '14px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '4px', borderRadius: '999px',
                background: 'var(--bg-surface)',
                backdropFilter: 'blur(12px)',
                border: '0.5px solid var(--accent-gold-border-lo)',
              }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-secondary)', fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >−</button>
                <span style={{
                  minWidth: '28px', textAlign: 'center',
                  color: 'var(--text-primary)', fontWeight: 700, fontSize: '15px',
                }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-secondary)', fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >+</button>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveModal('panier')}
                style={{
                  flex: 1,
                  padding: '0 28px',
                  borderRadius: '999px',
                  background: 'var(--accent-gold)',
                  color: '#061108',
                  border: '0.5px solid var(--accent-gold-border)',
                  fontFamily: "'Anek Latin', var(--font-body), sans-serif",
                  fontSize: '13px', fontWeight: 700,
                  letterSpacing: '2px', textTransform: 'uppercase',
                  cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(212,175,55,0.18)',
                }}
              >{t('detail.add_cart')}</motion.button>
            </div>

            <motion.button
              whileHover={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '999px',
                background: 'transparent',
                border: '0.5px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontFamily: "'Anek Latin', var(--font-body), sans-serif",
                fontSize: '12px', fontWeight: 600,
                letterSpacing: '1.8px', textTransform: 'uppercase',
                cursor: 'pointer', marginBottom: '32px',
              }}
            >{t('detail.buy_now')}</motion.button>

            {/* Trust strip */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '12px',
              paddingTop: '24px', borderTop: '0.5px solid var(--border-subtle)',
            }}>
              {TRUST_ITEMS.map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  color: 'var(--text-muted)', fontSize: '12px', letterSpacing: '0.3px',
                }}>
                  <span style={{ color: 'var(--accent-gold)' }}>
                    <TrustIcon d={item.d} />
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── TABS ─────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
          style={{ marginBottom: '100px' }}
        >
          <div style={{
            display: 'flex', gap: '36px', flexWrap: 'wrap',
            borderBottom: '0.5px solid var(--border-subtle)',
            marginBottom: '36px',
          }}>
            {TABS.map(tab => {
              const active = tab.id === activeTab
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    position: 'relative',
                    padding: '14px 0',
                    background: 'none', border: 'none',
                    fontFamily: "'Anek Latin', var(--font-body), sans-serif",
                    fontSize: '12px', fontWeight: 700,
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: active ? 'var(--accent-gold)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'color 0.2s',
                  }}
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="product-tab-underline"
                      style={{
                        position: 'absolute', left: 0, right: 0, bottom: '-0.5px',
                        height: '2px', background: 'var(--accent-gold)',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <div style={{ minHeight: '140px' }}>{renderTab()}</div>
        </motion.section>

        {/* ── ARTISAN STRIP ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4, ease: EASE }}
          style={{
            borderRadius: '28px',
            padding: isMobile ? '32px 20px' : '44px 48px',
            background: 'var(--bg-surface)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            border: '0.5px solid var(--accent-gold-border-lo)',
            boxShadow: 'var(--shadow-card)',
            marginBottom: isMobile ? '50px' : '100px',
          }}
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
            fontSize: '16px', color: 'var(--accent-gold)',
            letterSpacing: '1.5px', marginBottom: '24px', textAlign: 'center',
          }}>{t('detail.meet_artisan')}</p>

          <div style={{
            display: 'flex', gap: '32px',
            alignItems: 'center',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <AvatarCircle initials={artisan.initials} size={84} />
            <div style={{ flex: 1, minWidth: '260px', maxWidth: '640px' }}>
              <h3 style={{
                fontFamily: "'Anton SC', var(--font-display), sans-serif",
                fontSize: 'clamp(22px, 2.6vw, 32px)',
                color: 'var(--text-primary)',
                letterSpacing: '1.5px', marginBottom: '6px',
              }}>{artisan.name}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)',
                letterSpacing: '0.4px', marginBottom: '14px' }}>
                {artisan.region}
                {artisan.type === 'coopérative' && ` · ${t('detail.cooperative')}`}
                {' · '}{t('detail.member_since')}{' '}{artisan.memberSince}
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
                fontSize: '16px', lineHeight: 1.7, color: 'var(--text-secondary)',
                marginBottom: '18px',
              }}>
                {artisan.story.length > 200
                  ? artisan.story.slice(0, 200).trimEnd() + '…'
                  : artisan.story}
              </p>
              <Link href={`/vendeurs/${artisan.id}`} style={{
                display: 'inline-block',
                fontSize: '11px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--accent-gold)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--accent-gold-border)',
                paddingBottom: '2px', transition: 'color 0.2s',
              }}>{t('detail.see_workshop')}</Link>
            </div>
          </div>

          {artisan.quote && (
            <div style={{
              marginTop: '36px', paddingTop: '28px',
              borderTop: '0.5px solid var(--border-subtle)',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
                fontSize: 'clamp(17px, 2.2vw, 22px)',
                color: 'var(--accent-gold)', lineHeight: 1.5,
                maxWidth: '640px', margin: '0 auto',
              }}>{artisan.quote}</p>
            </div>
          )}
        </motion.section>

        {/* ── RELATED PRODUCTS ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section style={{ marginBottom: isMobile ? '60px' : '120px' }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ display: 'flex', alignItems: 'baseline',
                gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}
            >
              <h2 style={{
                fontFamily: "'Anton SC', var(--font-display), sans-serif",
                fontSize: 'clamp(24px, 3vw, 38px)',
                color: 'var(--text-primary)', letterSpacing: '2px',
              }}>
                {artisan.products.length > 1
                  ? t('detail.other_creations', { name: artisan.name })
                  : t('detail.same_category')}
              </h2>
              <span style={{
                fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic',
                fontSize: '16px', color: 'var(--text-muted)',
              }}>{t('detail.to_discover')}</span>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: isMobile ? '12px' : '22px',
            }}>
              {related.map((p, i) => (
                <MiniProductCard
                  key={p.id}
                  product={{
                    ...p,
                    price: `${p.price} DHs`,
                    badgeKey: p.bioCertified ? 'bio' : null
                  }}
                  delay={0.5 + i * 0.07}
                  onClick={() => router.push(`/produits/${p.id}`)}
                  isMobile={isMobile}
                  flip={flip}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageWrapper>
  )
}
