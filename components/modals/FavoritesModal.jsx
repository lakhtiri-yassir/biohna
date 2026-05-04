'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useModal } from '../../context/ModalContext.jsx'

const RECENT_PURCHASES = [
  { id:1, name:"Miel Sidr du Yémen", vendor:"Lalla Fatima — Meknès", price:"500 DHs", lastBought:"Il y a 2 jours" },
  { id:2, name:"Huile d'Argan Pure", vendor:"Coopérative Aït Baha", price:"320 DHs", lastBought:"Il y a 1 semaine" },
  { id:3, name:"Savon Beldi Eucalyptus", vendor:"Khadija — Essaouira", price:"85 DHs", lastBought:"Il y a 2 semaines" },
  { id:4, name:"Amlou Artisanal", vendor:"Nadia — Taroudant", price:"180 DHs", lastBought:"Il y a 3 semaines" },
]

function FavoriteItem({ item, delay }) {
  const { setActiveModal } = useModal()
  const { t } = useTranslation('modals')
  return (
    <motion.div
      initial={{ opacity:0, x:-12 }}
      animate={{ opacity:1, x:0 }}
      transition={{ duration:0.38, delay, ease:[0.22,1,0.36,1] }}
      style={{ display:'flex', alignItems:'center', gap:'14px', padding:'14px 16px', borderRadius:'16px', background:'var(--bg-surface)', border:'1px solid var(--border-subtle)' }}
    >
      <div style={{ width:'52px', height:'52px', borderRadius:'12px', background:'var(--bg-surface)', border:'1px solid var(--accent-gold-border)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text-primary)', marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.name}</p>
        <p style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'4px' }}>{item.vendor}</p>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'11px', fontWeight:600, color:'var(--accent-gold)' }}>{item.price}</span>
          <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>·</span>
          <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>{item.lastBought}</span>
        </div>
      </div>
      <motion.button
        whileHover={{ background:'var(--accent-gold)', color:'var(--bg-base)', scale:1.04 }}
        onClick={() => setActiveModal('panier')}
        style={{ padding:'7px 14px', borderRadius:'14px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', color:'var(--accent-gold)', fontSize:'11px', fontWeight:700, cursor:'pointer', letterSpacing:'0.5px', flexShrink:0, whiteSpace:'nowrap' }}
      >
        {t('favorites.rebuy')}
      </motion.button>
    </motion.div>
  )
}

export default function FavoritesModal() {
  const { activeModal, setActiveModal } = useModal()
  const { t } = useTranslation('modals')
  const router = useRouter()
  const isOpen = activeModal === 'favorites'
  const close = () => setActiveModal(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.25 }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
          style={{ position:'fixed', inset:0, zIndex:2000, background:'var(--bg-overlay)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          <motion.div
            initial={{ opacity:0, y:26, scale:0.96 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:18, scale:0.97 }}
            transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
            style={{ width:'min(90vw, 480px)', maxHeight:'88vh', display:'flex', flexDirection:'column', background:'var(--bg-elevated)', backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)', border:'1px solid var(--accent-gold-border-lo)', borderRadius:'34px', boxShadow:'var(--shadow-heavy)', overflow:'hidden' }}
          >
            {/* Header */}
            <div style={{ padding:'26px 28px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border-subtle)', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-gold)" stroke="var(--accent-gold)" fillOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'18px', color:'var(--text-primary)', letterSpacing:'2px', display:'block', lineHeight:1 }}>{t('favorites.heading')}</span>
                  <span style={{ fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.5px' }}>{t('favorites.subheading')}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ background:'var(--destructive-bg)', color:'var(--destructive)' }}
                onClick={close}
                style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--bg-surface)', border:'1px solid var(--accent-gold-border-lo)', color:'var(--text-muted)', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center' }}
              >✕</motion.button>
            </div>

            {/* Subtitle */}
            <div style={{ padding:'14px 24px 10px', flexShrink:0 }}>
              <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-muted)' }}>
                {t('favorites.list_header', { count: RECENT_PURCHASES.length })}
              </p>
            </div>

            {/* List */}
            <div style={{ flex:1, overflowY:'auto', padding:'6px 20px 16px', display:'flex', flexDirection:'column', gap:'8px' }}>
              {RECENT_PURCHASES.map((item, i) => (
                <FavoriteItem key={item.id} item={item} delay={i * 0.06} />
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding:'14px 24px 22px', borderTop:'1px solid var(--border-subtle)', textAlign:'center', flexShrink:0 }}>
              <motion.button
                whileHover={{ opacity:0.75 }}
                onClick={() => { close(); router.push('/favoris') }}
                style={{ fontSize:'13px', color:'var(--accent-gold)', fontWeight:600, cursor:'pointer', background:'none', border:'none' }}
              >
                {t('favorites.see_all')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
