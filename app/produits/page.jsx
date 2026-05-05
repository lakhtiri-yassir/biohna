'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import SortDropdown from '@/components/SortDropdown.jsx'
import { useModal } from '@/context/ModalContext.jsx'
import { useTheme } from '@/context/ThemeContext.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow.js'
import { useDirection } from '@/hooks/useDirection.js'

function FilterCards({ activeCategory, setActiveCategory, categories, t, flip }) {
  return (
    <>
      <div style={{ padding:'24px 20px', borderRadius:'20px', background:'var(--bg-surface)', backdropFilter:'blur(16px)', border:'1px solid var(--accent-gold-border-lo)' }}>
        <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'14px' }}>{t('filters.categories')}</p>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'3px' }}>
          {categories.map(cat => (
            <li key={cat.id}>
              <button onClick={() => setActiveCategory(cat.slug)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderRadius:'10px', color: activeCategory===cat.slug ? 'var(--accent-gold)' : 'var(--text-secondary)', background: activeCategory===cat.slug ? 'var(--accent-gold-bg)' : 'transparent', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'background 0.2s, color 0.2s', textAlign: flip('left', 'right') }}>
                <span>{cat.name}</span>
                <span style={{ fontSize:'11px', color:'var(--text-muted)', background:'var(--bg-surface)', padding:'2px 8px', borderRadius:'20px' }}>0</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding:'24px 20px', borderRadius:'20px', background:'var(--bg-surface)', backdropFilter:'blur(16px)', border:'1px solid var(--accent-gold-border-lo)' }}>
        <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'12px' }}>{t('filters.price')}</p>
        <input type="range" min={0} max={2000} defaultValue={1000} style={{ width:'100%', accentColor:'var(--accent-gold)', margin:'6px 0' }} />
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:'var(--text-muted)' }}>
          <span>0 DHs</span><span>2 000 DHs</span>
        </div>
      </div>

      <div style={{ padding:'24px 20px', borderRadius:'20px', background:'var(--bg-surface)', backdropFilter:'blur(16px)', border:'1px solid var(--accent-gold-border-lo)' }}>
        <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'12px' }}>{t('filters.region')}</p>
        <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'2px' }}>
          {['Souss-Massa','Marrakech-Safi','Fès-Meknès','Essaouira','Taroudant'].map(r => (
            <li key={r}>
              <button style={{ width:'100%', textAlign: flip('left', 'right'), padding:'8px 12px', borderRadius:'9px', color:'var(--text-secondary)', fontSize:'13px', cursor:'pointer', transition:'background 0.2s, color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--accent-gold-bg)'; e.currentTarget.style.color='var(--accent-gold)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-secondary)'; }}>
                {r}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function ProductCard({ product, delay, isNarrow, addCartLabel, flip }) {
  const { setActiveModal } = useModal()
  const { isDark } = useTheme()
  const router = useRouter()
  const { t: tc } = useTranslation('common')

  return (
    <motion.div
      initial={{ opacity:0, y:28 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, delay, ease:[0.22,1,0.36,1] }}
      whileHover={{ y:-7, boxShadow: isDark ? '0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(212,175,55,0.2)' : '0 16px 50px rgba(44,44,44,0.12), 0 0 0 1px rgba(212,175,55,0.2)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(`/produits/${product.id}`)}
      style={{
        borderRadius:'22px', overflow:'hidden',
        background:'var(--bg-surface)',
        backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        border:'1px solid var(--accent-gold-border-lo)',
        boxShadow:'var(--shadow-card)',
        cursor:'pointer',
      }}
    >
      <div style={{ height: isNarrow ? '150px' : '230px', overflow:'hidden', position:'relative', background:'var(--bg-surface)' }}>
        <img
          src="https://www.figma.com/api/mcp/asset/fd23ca0c-b6a0-4827-886e-e101deaa9068"
          alt={product.name}
          style={{ width:'100%', height:'100%', objectFit:'cover', transition: isNarrow ? 'none' : 'transform 0.5s cubic-bezier(0.23,1,0.32,1)' }}
          {...(!isNarrow && {
            onMouseEnter: e => { e.currentTarget.style.transform = 'scale(1.07)' },
            onMouseLeave: e => { e.currentTarget.style.transform = 'scale(1)' },
          })}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3))' }} />
        {product.badgeKey && (
          <span style={{ position:'absolute', top:'12px', [flip('left','right')]:'12px', padding:'4px 12px', borderRadius:'20px', background:'var(--accent-gold-bg-strong)', backdropFilter:'blur(8px)', border:'1px solid var(--accent-gold-border)', fontSize:'10px', fontWeight:700, color:'var(--accent-amber)', letterSpacing:'1.5px', textTransform:'uppercase' }}>
            {tc(`badge.${product.badgeKey}`)}
          </span>
        )}
        <motion.button
          whileHover={{ background:'rgba(255,60,80,0.3)', color:'#ff8888' }}
          onClick={e => e.stopPropagation()}
          style={{ position:'absolute', top:'12px', [flip('right','left')]:'12px', width:'32px', height:'32px', borderRadius:'50%', background:'rgba(0,0,0,0.25)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)', fontSize:'14px' }}
        >♡</motion.button>
      </div>
      <div style={{ padding: isNarrow ? '12px 14px' : '18px 20px' }}>
        <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--accent-gold)', marginBottom:'5px' }}>{product.category?.name}</p>
        <p style={{ fontWeight:700, fontSize: isNarrow ? '13px' : '16px', color:'var(--text-primary)', marginBottom:'3px', lineHeight:1.3 }}>{product.name}</p>
        <p style={{ fontSize: isNarrow ? '11px' : '12px', color:'var(--text-muted)', marginBottom: isNarrow ? '10px' : '14px' }}>{product.vendor?.storeName || product.vendor}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            {product.oldPrice && <span style={{ fontSize:'12px', color:'var(--destructive)', textDecoration:'line-through', [flip('marginRight','marginLeft')]:'6px' }}>{product.oldPrice}</span>}
            <span style={{ fontSize: isNarrow ? '15px' : '19px', fontWeight:700, color:'var(--accent-gold)' }}>{product.price}</span>
          </div>
          <motion.button
            whileHover={{ background:'var(--accent-gold)', color:'var(--bg-base)', scale:1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={e => { e.stopPropagation(); setActiveModal('panier') }}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', padding: isNarrow ? '8px 12px' : '8px 16px', borderRadius:'18px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', color:'var(--accent-gold)', fontSize: isNarrow ? '14px' : '12px', fontWeight:700, cursor:'pointer', backdropFilter:'blur(8px)' }}
          >
            {isNarrow ? '+' : addCartLabel}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Produits() {
  const { t } = useTranslation('products')
  const { t: tc } = useTranslation('common')
  const { flip } = useDirection()
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isNarrow = useIsNarrow()

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesData.success) {
          // Flatten categories and add "all" option
          const flatCategories = [{ id: 'all', name: t('filters.all'), slug: 'all' }]
          categoriesData.data.forEach(cat => {
            flatCategories.push(cat)
            if (cat.children) {
              flatCategories.push(...cat.children)
            }
          })
          setCategories(flatCategories)
        }

        // Fetch products
        const productsResponse = await fetch('/api/products?limit=50')
        const productsData = await productsResponse.json()
        
        if (productsData.success) {
          setProducts(productsData.data.products || [])
        } else {
          setError(productsData.error)
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [t])

  const SORT_OPTIONS = [
    { label: t('sort.label') + t('sort.popularity'), value: 'popular' },
    { label: t('sort.price_asc'),  value: 'price_asc' },
    { label: t('sort.price_desc'), value: 'price_desc' },
    { label: t('sort.newest'),     value: 'new' },
  ]

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [filtersOpen])

  return (
    <PageWrapper>
      <NavBar />

      <header style={{ padding: isNarrow ? '96px 20px 40px' : '120px 48px 60px', textAlign:'center' }}>
        <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
          style={{ fontFamily:"'Cormorant Garamond', var(--font-serif), serif", fontStyle:'italic', fontSize:'20px', color:'var(--accent-gold)', letterSpacing:'2px', marginBottom:'20px' }}>
          {t('page.subtitle')}
        </motion.p>
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.2 }}
          style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'clamp(48px, 7vw, 88px)', lineHeight:1.05, textTransform:'uppercase', color:'var(--text-primary)' }}>
          {t('page.heading')}
        </motion.h1>
      </header>

      <div style={{ display:'grid', gridTemplateColumns: isNarrow ? '1fr' : '260px 1fr', gap: isNarrow ? '0' : '28px', padding: isNarrow ? '0 16px 80px' : '0 48px 100px', maxWidth:'1500px', margin:'0 auto' }}>

        {/* Sidebar — desktop only */}
        {!isNarrow && (
          <aside style={{ position:'sticky', top:'88px', height:'fit-content', display:'flex', flexDirection:'column', gap:'14px' }}>
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.3 }}>
              <FilterCards activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} t={t} flip={flip} />
            </motion.div>
          </aside>
        )}

        {/* Main */}
        <main>
          {/* Toolbar */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
            style={{ marginBottom:'24px' }}>
            {isNarrow ? (
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
                  <motion.button
                    whileTap={{ scale:0.97 }}
                    onClick={() => setFiltersOpen(true)}
                    style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', borderRadius:'18px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', color:'var(--accent-gold)', fontSize:'12px', fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="4" y1="6" x2="20" y2="6"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                      <line x1="11" y1="18" x2="13" y2="18"/>
                    </svg>
                    {t('page.filters_btn')}
                  </motion.button>
                  <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} compact />
                </div>
                <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>{t('page.results', { count: products.length })}</p>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <p style={{ fontSize:'13px', color:'var(--text-muted)' }}>{t('page.results', { count: products.length })}</p>
                <SortDropdown options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
              </div>
            )}
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns: isNarrow ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(290px, 1fr))', gap: isNarrow ? '12px' : '22px' }}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }, (_, i) => (
                <div key={i} style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: '20px',
                  height: '420px',
                  border: '1px solid var(--border-subtle)',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              ))
            ) : error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>{t('page.no_products')}</p>
              </div>
            ) : (
              products
                .filter(p => activeCategory === 'all' || p.category?.slug === activeCategory)
                .map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={{
                      ...p,
                      price: `${p.price} DHs`,
                      vendor: p.vendor?.storeName || '',
                      badgeKey: p.bioCertified ? 'bio' : null
                    }}
                    delay={i * 0.06}
                    isNarrow={isNarrow}
                    addCartLabel={t('page.add_cart')}
                    flip={flip}
                  />
                ))
            )}
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:'8px', paddingTop:'48px' }}>
            {[1,2,3,'→'].map((n, i) => (
              <motion.button key={i}
                whileHover={{ background:'var(--accent-gold-active)', color:'var(--accent-gold)', borderColor:'var(--accent-gold-border)' }}
                style={{ width:'40px', height:'40px', borderRadius:'11px', background: i===0 ? 'var(--accent-gold-active)' : 'var(--bg-surface)', border: i===0 ? '1px solid var(--accent-gold-border)' : '1px solid var(--border-subtle)', color: i===0 ? 'var(--accent-gold)' : 'var(--text-secondary)', fontSize:'14px', fontWeight:600, cursor:'pointer', backdropFilter:'blur(8px)' }}
              >{n}</motion.button>
            ))}
          </div>
        </main>
      </div>

      {/* Bottom-sheet filters — mobile only */}
      <AnimatePresence>
        {filtersOpen && isNarrow && (
          <>
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setFiltersOpen(false)}
              style={{ position:'fixed', inset:0, background:'var(--bg-overlay, rgba(0,0,0,0.5))', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', zIndex:1500 }}
            />
            <motion.div
              initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
              transition={{ type:'spring', damping:32, stiffness:320 }}
              style={{ position:'fixed', left:0, right:0, bottom:0, zIndex:1501, maxHeight:'82vh', overflowY:'auto', borderTopLeftRadius:'22px', borderTopRightRadius:'22px', background:'var(--bg-nav)', border:'0.5px solid var(--accent-gold-border)', padding:'12px 20px 32px' }}
            >
              <div style={{ width:'40px', height:'4px', borderRadius:'2px', background:'var(--border-subtle)', margin:'0 auto 20px' }} />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
                <p style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'18px', letterSpacing:'2px', color:'var(--text-primary)' }}>{t('page.filters_header')}</p>
                <motion.button
                  whileTap={{ scale:0.9 }}
                  onClick={() => setFiltersOpen(false)}
                  style={{ width:'34px', height:'34px', borderRadius:'50%', border:'1px solid var(--border-subtle)', background:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}
                >×</motion.button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'14px', marginBottom:'24px' }}>
                <FilterCards activeCategory={activeCategory} setActiveCategory={setActiveCategory} categories={categories} t={t} flip={flip} />
              </div>
              <motion.button
                whileTap={{ scale:0.98 }}
                onClick={() => setFiltersOpen(false)}
                style={{ width:'100%', padding:'14px', borderRadius:'999px', background:'var(--accent-gold)', color:'#061108', border:'none', fontFamily:"'Anek Latin', var(--font-body), sans-serif", fontSize:'13px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', cursor:'pointer' }}
              >{tc('btn.apply')}</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
