'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../context/ModalContext.jsx'
import { useDirection } from '../../hooks/useDirection.js'

// Cart starts empty - no hardcoded sample data

function CartItem({ item, onQty, onRemove }) {
  return (
    <div
      style={{ display:'grid', gridTemplateColumns:'66px 1fr auto', gap:'14px', alignItems:'center', padding:'14px 26px', borderBottom:'1px solid var(--border-subtle)', transition:'background 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.background='var(--bg-surface-hover)'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}
    >
      <div style={{ width:'66px', height:'66px', borderRadius:'12px', overflow:'hidden', background:'var(--bg-surface)', border:'1px solid var(--accent-gold-border-lo)' }}>
        <img src="https://www.figma.com/api/mcp/asset/fd23ca0c-b6a0-4827-886e-e101deaa9068" alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      </div>
      <div style={{ minWidth:0 }}>
        <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--accent-gold)', marginBottom:'2px' }}>{item.category}</p>
        <p style={{ fontSize:'14px', fontWeight:600, color:'var(--text-primary)', marginBottom:'1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</p>
        <p style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'10px' }}>{item.vendor}</p>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          {[-1, null, 1].map((d, i) => d === null
            ? <span key={i} style={{ minWidth:'26px', textAlign:'center', fontSize:'13px', fontWeight:700, color:'var(--text-primary)' }}>{item.qty}</span>
            : <motion.button key={i} whileHover={{ background:'var(--accent-gold-hover-bg)', borderColor:'var(--accent-gold-border)' }} onClick={() => onQty(item.id, d)}
                style={{ width:'22px', height:'22px', borderRadius:'6px', background:'var(--bg-surface)', border:'1px solid var(--accent-gold-border-lo)', color:'var(--text-primary)', fontSize:'12px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
              >{d>0?'+':'−'}</motion.button>
          )}
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'6px' }}>
        {item.oldPrice && <span style={{ fontSize:'11px', color:'var(--destructive)', textDecoration:'line-through' }}>{item.oldPrice}</span>}
        <span style={{ fontSize:'15px', fontWeight:700, color:'var(--accent-gold)' }}>{item.price}</span>
        <motion.button
          whileHover={{ background:'var(--destructive-hover-bg)', color:'var(--destructive)' }}
          onClick={() => onRemove(item.id)}
          style={{ width:'22px', height:'22px', borderRadius:'6px', background:'var(--destructive-bg)', border:'1px solid var(--destructive-bg)', color:'var(--destructive)', fontSize:'11px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
        >🗑</motion.button>
      </div>
    </div>
  )
}

export default function PanierModal() {
  const { activeModal, setActiveModal } = useModal()
  const { t } = useTranslation('modals')
  const { flip } = useDirection()
  const [items, setItems] = useState([])
  const router = useRouter()
  const isOpen = activeModal === 'panier'

  // Sync from localStorage every time the modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('biohna_cart')
      setItems(saved ? JSON.parse(saved) : [])
    }
  }, [isOpen])

  const persist = (next) => {
    setItems(next)
    localStorage.setItem('biohna_cart', JSON.stringify(next))
  }

  const updateQty = (id, delta) =>
    persist(items.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))

  const removeItem = (id) => persist(items.filter(it => it.id !== id))

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.25 }}
          onClick={e => { if (e.target === e.currentTarget) setActiveModal(null) }}
          style={{ position:'fixed', inset:0, zIndex:2000, background:'var(--bg-overlay)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <motion.div
            initial={{ opacity:0, y:28, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:20, scale:0.97 }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
            style={{ width:'min(90vw, 460px)', maxHeight:'88vh', display:'flex', flexDirection:'column', background:'var(--bg-elevated)', backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)', border:'1px solid var(--accent-gold-border-lo)', borderRadius:'34px', boxShadow:'var(--shadow-heavy)', overflow:'hidden' }}
          >
            {/* Header */}
            <div style={{ padding:'26px 28px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border-subtle)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'20px', color:'var(--text-primary)', letterSpacing:'2px' }}>{t('panier.heading')}</span>
                <span style={{ padding:'3px 10px', borderRadius:'12px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', fontSize:'11px', fontWeight:700, color:'var(--accent-gold)' }}>{items.length}</span>
              </div>
              <motion.button
                whileHover={{ background:'var(--destructive-bg)', color:'var(--destructive)' }}
                onClick={() => setActiveModal(null)}
                style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--bg-surface)', border:'1px solid var(--accent-gold-border-lo)', color:'var(--text-muted)', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}
              >✕</motion.button>
            </div>

            {/* Items */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {items.length === 0 ? (
                <div style={{ padding: '60px 26px', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {t('panier.empty')}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Découvrez nos produits et ajoutez-les à votre panier
                  </p>
                </div>
              ) : (
                items.map(it => <CartItem key={it.id} item={it} onQty={updateQty} onRemove={removeItem} />)
              )}
            </div>

            {/* Footer - only show when cart has items */}
            {items.length > 0 && (
              <div style={{ padding:'18px 26px 26px', borderTop:'1px solid var(--border-subtle)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', color:'var(--text-muted)', marginBottom:'6px' }}>
                  <span>{t('panier.subtotal')}</span><span>MAD {subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', color:'var(--text-muted)', marginBottom:'16px' }}>
                  <span>{t('panier.shipping')}</span><span style={{ color:'var(--accent-gold)' }}>{t('panier.shipping_free')}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid var(--border-subtle)', paddingTop:'14px', marginBottom:'18px' }}>
                  <span style={{ fontWeight:700, fontSize:'15px', color:'var(--text-primary)' }}>{t('panier.total')}</span>
                  <span style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'24px', color:'var(--accent-gold)' }}>MAD {subtotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ y:-2, boxShadow:'0 8px 32px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale:0.98 }}
                  onClick={() => { setActiveModal(null); router.push('/cart') }}
                  style={{ width:'100%', padding:'15px', background:'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', border:'none', borderRadius:'14px', fontWeight:700, fontSize:'15px', color:'var(--bg-base)', cursor:'pointer', boxShadow:'0 4px 20px rgba(212,175,55,0.28)' }}
                >{t('panier.checkout_btn')}</motion.button>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{ width:'100%', textAlign:'center', marginTop:'12px', fontSize:'13px', color:'var(--text-muted)', cursor:'pointer', background:'none', border:'none', transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--accent-gold)'}
                  onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
                >{t('panier.continue')}</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
