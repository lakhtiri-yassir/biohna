'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useModal } from '@/context/ModalContext.jsx'
import { useTheme } from '@/context/ThemeContext.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow'
import { useDirection } from '@/hooks/useDirection.js'

function AvatarCircle({ initials, size = 90 }) {
  return (
    <div style={{
      width: `${size}px`, height: `${size}px`, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))',
      border: '2px solid var(--accent-gold-border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Anek Latin', sans-serif", fontWeight: 700,
      fontSize: `${Math.round(size * 0.28)}px`, letterSpacing: '2px', color: 'var(--accent-gold)',
    }}>
      {initials}
    </div>
  )
}

function ProductCard({ product, delay, addToCartLabel, flip }) {
  const { setActiveModal } = useModal()
  const { isDark } = useTheme()
  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7, boxShadow: isDark ? '0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.2)' : '0 16px 50px rgba(44,44,44,0.12), 0 0 0 1px rgba(212,175,55,0.2)' }}
      onClick={() => router.push(`/produits/${product.id}`)}
      style={{
        borderRadius: '22px', overflow: 'hidden',
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--accent-gold-border-lo)',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
      }}
    >
      <div style={{ height: '200px', overflow: 'hidden', position: 'relative', background: 'var(--bg-surface)' }}>
        <div style={{ width: '100%', height: '100%', background: 'var(--bg-surface)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25))' }} />
        {product.badge && (
          <span style={{ position: 'absolute', top: '12px', [flip('left', 'right')]: '12px', padding: '4px 12px', borderRadius: '20px', background: 'var(--accent-gold-bg-strong)', backdropFilter: 'blur(8px)', border: '1px solid var(--accent-gold-border)', fontSize: '10px', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {product.badge}
          </span>
        )}
      </div>
      <div style={{ padding: '18px 20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '5px' }}>{product.category?.name}</p>
        <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.3 }}>{product.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            {product.oldPrice && <span style={{ fontSize: '12px', color: 'var(--destructive)', textDecoration: 'line-through', [flip('marginRight', 'marginLeft')]: '6px' }}>{product.oldPrice}</span>}
            <span style={{ fontSize: '19px', fontWeight: 700, color: 'var(--accent-gold)' }}>{product.price}</span>
          </div>
          <motion.button
            whileHover={{ background: 'var(--accent-gold)', color: 'var(--bg-base)', scale: 1.04 }}
            onClick={e => { e.stopPropagation(); setActiveModal('panier') }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '18px', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', color: 'var(--accent-gold)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(8px)' }}
          >{addToCartLabel}</motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function VendeurProfile() {
  const { id } = useParams()
  const router = useRouter()
  const isNarrow = useIsNarrow()
  const { t } = useTranslation('vendors')
  const { flip } = useDirection()
  
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchVendor() {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/vendors/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setVendor(data.data)
        } else {
          setError(data.error)
        }
      } catch (err) {
        console.error('Failed to fetch vendor:', err)
        setError('Failed to load vendor')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchVendor()
    }
  }, [id])

  if (loading) {
    return (
      <PageWrapper>
        <NavBar />
        <div style={{ padding: isNarrow ? '120px 16px' : '160px 48px', textAlign: 'center' }}>
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

  if (error || !vendor) {
    return (
      <PageWrapper>
        <NavBar />
        <div style={{ padding: isNarrow ? '120px 16px' : '160px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '32px', color: 'var(--text-primary)', marginBottom: '16px' }}>
            {t('profile.not_found')}
          </p>
          <motion.button
            whileHover={{ color: 'var(--accent-gold)' }}
            onClick={() => router.push('/vendeurs')}
            style={{ fontSize: '14px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >{t('profile.back')}</motion.button>
        </div>
      </PageWrapper>
    )
  }

  // Transform vendor data to match expected artisan structure
  const artisan = {
    id: vendor.id,
    name: vendor.storeName,
    region: vendor.storeAddress || 'Morocco',
    story: `${vendor.storeName} is a trusted vendor providing quality Moroccan products.`,
    quote: `"Quality and authenticity in every product from ${vendor.storeName}."`,
    specialtyLabel: 'Produits Authentiques',
    type: 'vendor',
    memberSince: new Date(vendor.createdAt).getFullYear(),
    initials: vendor.storeName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase(),
    products: vendor.products || [],
    productCount: vendor.products?.length || 0
  }
  const specialtyColor = '#d4af37' // Default gold color for now

  const STATS = [
    { label: t('profile.stat_creations'), value: artisan.productCount },
    { label: t('profile.stat_member'), value: artisan.memberSince },
    { label: t('profile.stat_region'), value: artisan.region },
  ]

  return (
    <PageWrapper>
      <NavBar />

      <div style={{ padding: isNarrow ? '88px 16px 0' : '100px 48px 0', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: flip(-12, 12) }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ color: 'var(--accent-gold)', x: flip(-2, 2) }}
          onClick={() => router.push('/vendeurs')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: isNarrow ? '24px' : '48px', fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontWeight: 600, letterSpacing: '0.5px', transition: 'color 0.2s' }}
        >
          {t('profile.back')}
        </motion.button>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ borderRadius: '28px', padding: isNarrow ? '24px 16px' : '48px', background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', border: '1px solid var(--accent-gold-border-lo)', boxShadow: 'var(--shadow-heavy)', marginBottom: isNarrow ? '40px' : '80px' }}
        >
          <div style={{ display: 'flex', flexDirection: isNarrow ? 'column' : 'row', gap: isNarrow ? '20px' : '40px', alignItems: isNarrow ? 'center' : 'flex-start' }}>

            <AvatarCircle initials={artisan.initials} size={isNarrow ? 72 : 90} />

            <div style={{ flex: 1 }}>
              {/* Name & region */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <h1 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(32px, 5vw, 54px)', color: 'var(--text-primary)', letterSpacing: '2px', lineHeight: 1, marginBottom: '6px' }}>
                    {artisan.name}
                  </h1>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    {artisan.region}
                    {artisan.type === 'coopérative' && ` · ${t('profile.cooperative')}`}
                  </p>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
                  textTransform: 'uppercase', color: '#061108',
                  background: specialtyColor, padding: '6px 16px', borderRadius: '20px', flexShrink: 0,
                }}>
                  {artisan.specialtyLabel}
                </span>
              </div>

              {/* Stats chips */}
              <div style={{ display: 'flex', gap: isNarrow ? '8px' : '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                {STATS.map(stat => (
                  <div key={stat.label} style={{ padding: '8px 16px', borderRadius: '12px', background: 'var(--bg-surface-hover)', border: '1px solid var(--accent-gold-border-lo)' }}>
                    <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>{stat.label}</p>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-gold)' }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Story */}
              <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '17px', lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: '640px' }}>
                {artisan.story}
              </p>
            </div>
          </div>

          {/* Quote */}
          <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: 'clamp(18px, 2.5vw, 24px)', color: 'var(--accent-gold)', lineHeight: 1.5 }}>
              {artisan.quote}
            </p>
          </div>
        </motion.div>

        {/* Products section */}
        <section style={{ marginBottom: isNarrow ? '64px' : '120px' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '32px' }}
          >
            <h2 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--text-primary)', letterSpacing: '2px' }}>
              {t('profile.creations_heading')}
            </h2>
            <span style={{ fontFamily: "'Cormorant Garamond', var(--font-serif), serif", fontStyle: 'italic', fontSize: '18px', color: 'var(--text-muted)' }}>
              {t('profile.products_count', { count: artisan.productCount })}
            </span>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: isNarrow ? '12px' : '22px' }}>
            {artisan.products?.map((p, i) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  price: `${p.price} DHs`,
                  badge: p.bioCertified ? 'Bio' : null
                }}
                delay={0.35 + i * 0.07}
                addToCartLabel={t('profile.add_to_cart')}
                flip={flip}
              />
            )) || (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                {t('profile.no_products')}
              </p>
            )}
          </div>

          {artisan.productCount > (artisan.products?.length || 0) && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ textAlign: 'center', marginTop: '40px' }}
            >
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {t('profile.more_creations', { count: artisan.productCount - (artisan.products?.length || 0) })}
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </PageWrapper>
  )
}
