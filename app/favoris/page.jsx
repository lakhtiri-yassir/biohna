'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import SortDropdown from '@/components/SortDropdown.jsx'
import { useModal } from '@/context/ModalContext.jsx'
import { useTheme } from '@/context/ThemeContext.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow'
import { useDirection } from '@/hooks/useDirection.js'

const ALL_FAVORITES = [
  { id:1, name:"Miel Sidr du Yémen", vendor:"Lalla Fatima — Meknès", price:"500 DHs", oldPrice:"650 DHs", category:"Alimentation", lastBought:"2 jours", timesOrdered:4, badgeKey:"popular" },
  { id:2, name:"Huile d'Argan Pure", vendor:"Coopérative Aït Baha", price:"320 DHs", category:"Huiles", lastBought:"1 semaine", timesOrdered:2, badgeKey:"new" },
  { id:3, name:"Savon Beldi Eucalyptus", vendor:"Khadija — Essaouira", price:"85 DHs", category:"Cosmétiques", lastBought:"2 semaines", timesOrdered:6 },
  { id:4, name:"Amlou Artisanal aux Amandes", vendor:"Nadia — Taroudant", price:"180 DHs", category:"Alimentation", lastBought:"3 semaines", timesOrdered:3, badgeKey:"bio" },
  { id:5, name:"Ras el Hanout Maison 27 épices", vendor:"Touria — Fès", price:"60 DHs", category:"Épices", lastBought:"1 mois", timesOrdered:8 },
  { id:6, name:"Smen Traditionnel", vendor:"Aicha — Meknès", price:"240 DHs", category:"Alimentation", lastBought:"1 mois", timesOrdered:1, badgeKey:"limited" },
  { id:7, name:"Beurre de Karité Pur", vendor:"Coopérative Ouarzazate", price:"150 DHs", category:"Cosmétiques", lastBought:"2 mois", timesOrdered:2, badgeKey:"bio" },
  { id:8, name:"Couscous Berbère Artisanal", vendor:"Zahra — Béni Mellal", price:"120 DHs", category:"Alimentation", lastBought:"2 mois", timesOrdered:5 },
]

function FavoriteCard({ product, delay, t, tc, flip }) {
  const { setActiveModal } = useModal()
  const { isDark } = useTheme()
  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, delay, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-6, boxShadow: isDark ? '0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.2)' : '0 16px 50px rgba(44,44,44,0.12), 0 0 0 1px rgba(212,175,55,0.2)' }}
      style={{ borderRadius:'22px', overflow:'hidden', background:'var(--bg-surface)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid var(--accent-gold-border-lo)', boxShadow:'var(--shadow-card)', cursor:'pointer' }}
    >
      {/* Image area */}
      <div style={{ height:'220px', overflow:'hidden', position:'relative', background:'var(--bg-surface)' }}>
        <div style={{ width:'100%', height:'100%', background:'var(--bg-surface)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.25">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25))' }} />

        {product.badgeKey && (
          <span style={{ position:'absolute', top:'12px', [flip('left','right')]:'12px', padding:'4px 12px', borderRadius:'20px', background:'var(--accent-gold-bg-strong)', backdropFilter:'blur(8px)', border:'1px solid var(--accent-gold-border)', fontSize:'10px', fontWeight:700, color:'var(--accent-amber)', letterSpacing:'1.5px', textTransform:'uppercase' }}>
            {tc(`badge.${product.badgeKey}`)}
          </span>
        )}

        {/* Favorited heart */}
        <motion.button
          whileHover={{ scale:1.1 }}
          style={{ position:'absolute', top:'12px', [flip('right','left')]:'12px', width:'32px', height:'32px', borderRadius:'50%', background:'var(--accent-gold-bg)', backdropFilter:'blur(8px)', border:'1px solid var(--accent-gold-border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent-gold)" stroke="none" fillOpacity="0.9">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </motion.button>

        {/* Order count badge */}
        <div style={{ position:'absolute', bottom:'12px', [flip('left','right')]:'12px', padding:'3px 10px', borderRadius:'12px', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.08)', fontSize:'10px', color:'rgba(255,255,255,0.55)', letterSpacing:'0.5px' }}>
          {t('favorites.order_badge', { count: product.timesOrdered, timeframe: product.lastBought })}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding:'18px 20px' }}>
        <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--accent-gold)', marginBottom:'5px' }}>{product.category?.name || product.category}</p>
        <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text-primary)', marginBottom:'3px', lineHeight:1.3 }}>{product.name}</p>
        <p style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'14px' }}>{product.vendor}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            {product.oldPrice && <span style={{ fontSize:'12px', color:'var(--destructive)', textDecoration:'line-through', marginRight:'6px' }}>{product.oldPrice}</span>}
            <span style={{ fontSize:'19px', fontWeight:700, color:'var(--accent-gold)' }}>{product.price}</span>
          </div>
          <motion.button
            whileHover={{ background:'var(--accent-gold)', color:'var(--bg-base)', scale:1.04 }}
            onClick={() => setActiveModal('panier')}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'18px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', color:'var(--accent-gold)', fontSize:'12px', fontWeight:700, cursor:'pointer', backdropFilter:'blur(8px)' }}
          >
            {t('favorites.rebuy')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Favoris() {
  const { t } = useTranslation('cart')
  const { t: tc } = useTranslation('common')
  const { flip } = useDirection()
  const isNarrow = useIsNarrow()

  const TABS = [
    { id: 'all', label: t('favorites.tabs.all') },
    { id: 'Alimentation', label: t('favorites.tabs.food') },
    { id: 'Huiles', label: t('favorites.tabs.oils') },
    { id: 'Cosmétiques', label: t('favorites.tabs.beauty') },
    { id: 'Épices', label: t('favorites.tabs.spices') },
  ]

  const SORT_OPTIONS = [
    { label: t('favorites.sort.recent'), value: 'recent' },
    { label: t('favorites.sort.most_ordered'), value: 'orders' },
    { label: t('favorites.sort.price_asc'), value: 'price_asc' },
    { label: t('favorites.sort.price_desc'), value: 'price_desc' },
  ]

  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = activeTab === 'all'
    ? ALL_FAVORITES
    : ALL_FAVORITES.filter(p => p.category === activeTab)

  return (
    <PageWrapper>
      <NavBar />

      {/* Page header */}
      <header style={{ padding: isNarrow ? '96px 16px 40px' : '120px 48px 56px', textAlign:'center' }}>
        <motion.p
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
          style={{ fontFamily:"'Cormorant Garamond', var(--font-serif), serif", fontStyle:'italic', fontSize:'20px', color:'var(--accent-gold)', letterSpacing:'2px', marginBottom:'20px' }}
        >
          {t('favorites.subtitle')}
        </motion.p>
        <motion.h1
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.2 }}
          style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'clamp(48px, 7vw, 88px)', lineHeight:1.05, textTransform:'uppercase', color:'var(--text-primary)', marginBottom:'16px' }}
        >
          {t('favorites.heading')}
        </motion.h1>
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
          style={{ fontSize:'14px', color:'var(--text-muted)', maxWidth:'420px', margin:'0 auto' }}
        >
          {t('favorites.description')}
        </motion.p>
      </header>

      {/* Tabs + Sort bar */}
      <div style={{ padding: isNarrow ? '0 16px' : '0 48px', maxWidth:'1400px', margin:'0 auto 32px' }}>
        <motion.div
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}
        >
          {/* Tabs */}
          <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px', borderRadius:'18px', background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', ...(isNarrow ? { overflowX:'auto', flexWrap:'nowrap', scrollbarWidth:'none', msOverflowStyle:'none' } : {}) }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ padding: isNarrow ? '8px 14px' : '8px 18px', borderRadius:'12px', fontSize:'12px', fontWeight:600, letterSpacing:'0.5px', cursor:'pointer', transition:'all 0.2s', background: activeTab===tab.id ? 'var(--accent-gold-active)' : 'transparent', color: activeTab===tab.id ? 'var(--accent-gold)' : 'var(--text-muted)', border: activeTab===tab.id ? '1px solid var(--accent-gold-border)' : '1px solid transparent', flexShrink:0, whiteSpace:'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>{t('favorites.products_count', { count: filtered.length })}</span>
            <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <div style={{ padding: isNarrow ? '0 16px 80px' : '0 48px 100px', maxWidth:'1400px', margin:'0 auto' }}>
        {filtered.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns: isNarrow ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(290px, 1fr))', gap: isNarrow ? '12px' : '22px' }}>
            {filtered.map((p, i) => <FavoriteCard key={p.id} product={p} delay={i * 0.06} t={t} tc={tc} flip={flip} />)}
          </div>
        ) : (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ textAlign:'center', padding:'80px 0' }}
          >
            <div style={{ fontSize:'48px', marginBottom:'16px', opacity:0.3 }}>♡</div>
            <p style={{ color:'var(--text-muted)', fontSize:'15px' }}>{t('favorites.empty')}</p>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  )
}
