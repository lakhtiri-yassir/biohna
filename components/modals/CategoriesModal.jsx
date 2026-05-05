'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../context/ModalContext.jsx'

export default function CategoriesModal() {
  const { activeModal, setActiveModal } = useModal()
  const { t } = useTranslation('modals')
  const router = useRouter()
  const isOpen = activeModal === 'categories'
  const close = () => setActiveModal(null)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories()
    }
  }, [isOpen])

  async function fetchCategories() {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Transform API categories into sections format
  const SECTIONS = [
    {
      label: t('categories.sections.featured_label'),
      items: [{ icon:'/assets/star.svg', name: t('categories.items.featured'), count:18, featured:true }],
    },
    {
      label: t('categories.sections.all_categories'),
      items: categories.map(category => ({
        icon: '/assets/category.svg', // Default icon for all categories
        name: category.name,
        count: category.productCount || 0,
        categoryId: category.id
      }))
    }
  ]

  function CatCard({ item, onClose }) {
    const handleClick = () => {
      if (item.featured) {
        router.push('/produits')
      } else if (item.categoryId) {
        router.push(`/produits?category=${item.categoryId}`)
      } else {
        router.push('/produits')
      }
      onClose()
    }

    return (
      <motion.div
        whileHover={{ y:-2, background: item.featured ? 'var(--accent-gold-bg-strong)' : 'var(--accent-gold-bg)', borderColor:'var(--accent-gold-border)' }}
        onClick={handleClick}
        style={{
          display:'flex', alignItems:'center', gap:'12px',
          padding:'14px 16px', borderRadius:'16px', cursor:'pointer',
          background: item.featured ? 'var(--accent-gold-bg)' : 'var(--bg-surface)',
          border: item.featured ? '1px solid var(--accent-gold-border)' : '1px solid var(--border-subtle)',
          gridColumn: item.featured ? 'span 2' : undefined,
          transition: 'background 0.25s, border-color 0.25s',
        }}
      >
        <img src={item.icon} alt="" style={{ width: item.featured?'60px':'58px', height: item.featured?'60px':'58px', objectFit:'contain', flexShrink:0 }} />
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:'14px', fontWeight:600, color:'var(--text-primary)', marginBottom:'2px' }}>{item.name}</p>
          <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>{t('categories.products_count', { count: item.count })}</p>
        </div>
        <span style={{ color:'var(--text-muted)', fontSize:'13px', flexShrink:0 }}>›</span>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.25 }}
          onClick={e => { if (e.target===e.currentTarget) close() }}
          style={{ position:'fixed', inset:0, zIndex:2000, background:'var(--bg-overlay)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <motion.div
            initial={{ opacity:0, y:26, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:18, scale:0.97 }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
            style={{ width:'520px', maxHeight:'88vh', display:'flex', flexDirection:'column', background:'var(--bg-elevated)', backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)', border:'1px solid var(--accent-gold-border-lo)', borderRadius:'34px', boxShadow:'var(--shadow-heavy)', overflow:'hidden' }}
          >
            {/* Header */}
            <div style={{ padding:'26px 28px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border-subtle)', flexShrink:0 }}>
              <span style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'20px', color:'var(--text-primary)', letterSpacing:'2px' }}>{t('categories.heading')}</span>
              <motion.button
                whileHover={{ background:'var(--destructive-bg)', color:'var(--destructive)' }}
                onClick={close}
                style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--bg-surface)', border:'1px solid var(--accent-gold-border-lo)', color:'var(--text-muted)', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}
              >✕</motion.button>
            </div>

            {/* Search */}
            <div style={{ padding:'14px 24px', borderBottom:'1px solid var(--border-subtle)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', background:'var(--bg-input)', border:'1px solid var(--accent-gold-border-lo)', borderRadius:'11px', padding:'10px 14px' }}>
                <span style={{ color:'var(--text-muted)', fontSize:'15px' }}>⌕</span>
                <input type="text" placeholder={t('categories.search_placeholder')} style={{ flex:1, background:'none', border:'none', color:'var(--text-primary)', fontSize:'14px' }} />
              </div>
            </div>

            {/* Sections */}
            <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
              {SECTIONS.map(sec => (
                <div key={sec.label} style={{ marginBottom:'22px' }}>
                  <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-muted)', margin:'0 6px 10px' }}>{sec.label}</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                    {sec.items.map(item => <CatCard key={item.nameKey} item={item} onClose={close} />)}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding:'14px 24px 22px', borderTop:'1px solid var(--border-subtle)', textAlign:'center', flexShrink:0 }}>
              <motion.button
                whileHover={{ opacity:0.75 }}
                onClick={() => { router.push('/produits'); close() }}
                style={{ fontSize:'13px', color:'var(--accent-gold)', fontWeight:600, cursor:'pointer', background:'none', border:'none' }}
              >{t('categories.see_all')}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
