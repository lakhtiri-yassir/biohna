'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow'
import { useDirection } from '@/hooks/useDirection.js'
import { useAuth } from '@/context/AuthContext.jsx'

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Meknès', 'Agadir',
  'Tanger', 'Oujda', 'Tétouan', 'Safi', 'El Jadida', 'Khouribga',
  'Beni Mellal', 'Nador', 'Settat', 'Kénitra', 'Laâyoune', 'Dakhla',
  'Essaouira', 'Ifrane',
]

// Cart items loaded from localStorage

const panelVariants = {
  enter: (dir) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: (dir) => ({ x: dir * -60, opacity: 0, transition: { duration: 0.25 } }),
}

const inputBase = {
  width: '100%',
  padding: '11px 14px',
  background: 'var(--bg-input)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

function iStyle(hasError) {
  return { ...inputBase, border: `1px solid ${hasError ? 'var(--destructive)' : 'var(--accent-gold-border-lo)'}` }
}

function FieldLabel({ children }) {
  return (
    <label style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
      {children}
    </label>
  )
}

function FieldError({ msg }) {
  if (!msg) return null
  return <span style={{ fontSize: '11px', color: 'var(--destructive)', display: 'block', marginTop: '4px' }}>{msg}</span>
}

function BackButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: -2, borderColor: 'var(--accent-gold-border)' }}
      style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, background: 'var(--bg-surface)', border: '1px solid var(--accent-gold-border-lo)', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >←</motion.button>
  )
}

function CartItem({ item, onQty, onRemove, byVendor }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto', gap: '16px', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div style={{ width: '72px', height: '72px', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--accent-gold-border-lo)', flexShrink: 0 }}>
        <img src="https://www.figma.com/api/mcp/asset/fd23ca0c-b6a0-4827-886e-e101deaa9068" alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--accent-gold)', marginBottom: '3px' }}>{item.category}</p>
        <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>{byVendor}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[-1, null, 1].map((delta, i) => delta === null
            ? <span key={i} style={{ minWidth: '28px', textAlign: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.qty}</span>
            : <motion.button key={i} whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold-border)' }} onClick={() => onQty(item.id, delta)}
                style={{ width: '24px', height: '24px', borderRadius: '7px', background: 'var(--bg-surface)', border: '1px solid var(--accent-gold-border-lo)', color: 'var(--text-primary)', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >{delta > 0 ? '+' : '−'}</motion.button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        {item.oldPrice && <span style={{ fontSize: '11px', color: 'var(--destructive)', textDecoration: 'line-through' }}>MAD {item.oldPrice}</span>}
        <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--accent-gold)', whiteSpace: 'nowrap' }}>MAD {item.price * item.qty}</span>
        <motion.button
          whileHover={{ background: 'var(--destructive-hover-bg)', color: 'var(--destructive)' }}
          onClick={() => onRemove(item.id)}
          style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'var(--destructive-bg)', border: '1px solid var(--destructive-bg)', color: 'var(--destructive)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >🗑</motion.button>
      </div>
    </motion.div>
  )
}

function CustomSelect({ value, onChange, options, hasError, flip }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onOutside(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        whileHover={{ borderColor: 'var(--accent-gold-border)' }}
        style={{ ...inputBase, border: `1px solid ${hasError ? 'var(--destructive)' : open ? 'var(--accent-gold-border)' : 'var(--accent-gold-border-lo)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
      >
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>{value || '—'}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0, [flip('marginLeft', 'marginRight')]: '8px' }}>▾</motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200, background: 'var(--bg-dropdown)', border: '1px solid var(--accent-gold-border-lo)', borderRadius: '14px', backdropFilter: 'blur(24px)', boxShadow: 'var(--shadow-heavy)', maxHeight: '224px', overflowY: 'auto' }}
          >
            {options.map(opt => (
              <motion.button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false) }}
                whileHover={{ background: 'var(--accent-gold-bg)' }}
                style={{ width: '100%', padding: '10px 14px', textAlign: flip('left', 'right'), fontSize: '14px', color: opt === value ? 'var(--accent-gold)' : 'var(--text-primary)', background: opt === value ? 'var(--accent-gold-bg-strong)' : 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >{opt}</motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DeliveryPanel({ delivery, onChange, errors, t, flip, isNarrow, onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <BackButton onClick={onBack} />
        <h2 style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '2px', margin: 0 }}>{t('delivery.heading')}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '16px' }}>
        <div>
          <FieldLabel>{t('delivery.first_name')}</FieldLabel>
          <input value={delivery.firstName} onChange={e => onChange('firstName', e.target.value)} style={iStyle(errors.firstName)} />
          <FieldError msg={errors.firstName} />
        </div>
        <div>
          <FieldLabel>{t('delivery.last_name')}</FieldLabel>
          <input value={delivery.lastName} onChange={e => onChange('lastName', e.target.value)} style={iStyle(errors.lastName)} />
          <FieldError msg={errors.lastName} />
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FieldLabel>{t('delivery.phone')}</FieldLabel>
        <input type="tel" dir="ltr" value={delivery.phone} onChange={e => onChange('phone', e.target.value)}
          placeholder={t('delivery.phone_placeholder')} style={iStyle(errors.phone)} />
        <FieldError msg={errors.phone} />
        {!errors.phone && <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>{t('delivery.phone_hint')}</span>}
      </div>

      <div style={{ marginTop: '16px' }}>
        <FieldLabel>{t('delivery.address')}</FieldLabel>
        <input value={delivery.address} onChange={e => onChange('address', e.target.value)} style={iStyle(errors.address)} />
        <FieldError msg={errors.address} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div>
          <FieldLabel>{t('delivery.city')}</FieldLabel>
          <CustomSelect
            value={delivery.city}
            onChange={val => onChange('city', val)}
            options={MOROCCAN_CITIES}
            hasError={!!errors.city}
            flip={flip}
          />
          <FieldError msg={errors.city} />
        </div>
        <div>
          <FieldLabel>{t('delivery.postal')}</FieldLabel>
          <input value={delivery.postal} onChange={e => onChange('postal', e.target.value.replace(/\D/g, '').slice(0, 5))}
            maxLength={5} placeholder="—" style={iStyle(errors.postal)} />
          <FieldError msg={errors.postal} />
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <FieldLabel>{t('delivery.note')}</FieldLabel>
        <textarea value={delivery.note} onChange={e => onChange('note', e.target.value)}
          placeholder={t('delivery.note_placeholder')} rows={3}
          style={{ ...iStyle(false), resize: 'none', lineHeight: '1.6' }} />
      </div>

      <div style={{ marginTop: '28px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>{t('delivery.shipping_method')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'standard', label: t('delivery.standard'), desc: t('delivery.standard_desc'), price: t('delivery.standard_price') },
            { id: 'express', label: t('delivery.express'), desc: t('delivery.express_desc'), price: t('delivery.express_price') },
          ].map(method => (
            <motion.button key={method.id}
              onClick={() => onChange('shipping', method.id)}
              whileHover={{ borderColor: 'var(--accent-gold-border)' }}
              style={{
                display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '12px',
                padding: '14px 16px', borderRadius: '14px', cursor: 'pointer',
                background: delivery.shipping === method.id ? 'var(--accent-gold-bg)' : 'var(--bg-surface)',
                border: `1px solid ${delivery.shipping === method.id ? 'var(--accent-gold-border)' : 'var(--accent-gold-border-lo)'}`,
                textAlign: flip('left', 'right'),
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 2px' }}>{method.label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{method.desc}</p>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: delivery.shipping === method.id ? 'var(--accent-gold)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{method.price}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentPanel({ paymentMethod, setPaymentMethod, cardInfo, setCardInfo, confirmed, orderId, checkoutError, t, flip, isNarrow, onBack }) {
  const cardInput = { ...inputBase, border: '1px solid var(--accent-gold-border-lo)' }

  if (confirmed) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '48px 16px' }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px', color: 'var(--bg-base)' }}
        >✓</motion.div>
        <h2 style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '24px', color: 'var(--accent-gold)', letterSpacing: '2px', marginBottom: '12px' }}>{t('payment.confirmed_heading')}</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{t('payment.confirmed_desc')}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '32px' }}>
          #{orderId ? orderId.slice(0, 8).toUpperCase() : ''}
        </p>
        <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', borderRadius: '12px', color: 'var(--accent-gold)', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
          {t('payment.back_home')}
        </Link>
      </motion.div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <BackButton onClick={onBack} />
        <h2 style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '2px', margin: 0 }}>{t('payment.heading')}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Cash on delivery — default, most prominent */}
        <motion.button onClick={() => setPaymentMethod('cod')} whileHover={{ borderColor: 'var(--accent-gold-border)' }}
          style={{ padding: '16px', borderRadius: '14px', cursor: 'pointer', width: '100%', background: paymentMethod === 'cod' ? 'var(--accent-gold-bg)' : 'var(--bg-surface)', border: `1px solid ${paymentMethod === 'cod' ? 'var(--accent-gold-border)' : 'var(--accent-gold-border-lo)'}`, textAlign: flip('left', 'right') }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '18px' }}>💵</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{t('payment.cod')}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{t('payment.cod_desc')}</p>
            </div>
            <span style={{ padding: '3px 10px', borderRadius: '20px', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', fontSize: '10px', fontWeight: 700, color: 'var(--accent-gold)', whiteSpace: 'nowrap', flexShrink: 0 }}>{t('payment.cod_badge')}</span>
          </div>
        </motion.button>

        {/* Card */}
        <motion.button onClick={() => setPaymentMethod('card')} whileHover={{ borderColor: 'var(--accent-gold-border)' }}
          style={{ padding: '16px', borderRadius: '14px', cursor: 'pointer', width: '100%', background: paymentMethod === 'card' ? 'var(--accent-gold-bg)' : 'var(--bg-surface)', border: `1px solid ${paymentMethod === 'card' ? 'var(--accent-gold-border)' : 'var(--accent-gold-border-lo)'}`, textAlign: flip('left', 'right') }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '18px' }}>💳</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{t('payment.card')}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{t('payment.card_desc')}</p>
        </motion.button>

        <AnimatePresence>
          {paymentMethod === 'card' && (
            <motion.div key="card-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '4px 4px 8px', display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FieldLabel>{t('payment.card_number')}</FieldLabel>
                  <input value={cardInfo.number}
                    onChange={e => setCardInfo(p => ({ ...p, number: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                    placeholder="0000 0000 0000 0000" style={cardInput} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <FieldLabel>{t('payment.card_name')}</FieldLabel>
                  <input value={cardInfo.name} onChange={e => setCardInfo(p => ({ ...p, name: e.target.value }))} style={cardInput} />
                </div>
                <div>
                  <FieldLabel>{t('payment.card_expiry')}</FieldLabel>
                  <input value={cardInfo.expiry} onChange={e => setCardInfo(p => ({ ...p, expiry: e.target.value }))} placeholder="MM/AA" maxLength={5} style={cardInput} />
                </div>
                <div>
                  <FieldLabel>{t('payment.card_cvv')}</FieldLabel>
                  <input type="password" value={cardInfo.cvv} onChange={e => setCardInfo(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))} placeholder="•••" style={cardInput} />
                </div>
                <p style={{ gridColumn: '1 / -1', fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{t('payment.card_security')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bank transfer */}
        <motion.button onClick={() => setPaymentMethod('transfer')} whileHover={{ borderColor: 'var(--accent-gold-border)' }}
          style={{ padding: '16px', borderRadius: '14px', cursor: 'pointer', width: '100%', background: paymentMethod === 'transfer' ? 'var(--accent-gold-bg)' : 'var(--bg-surface)', border: `1px solid ${paymentMethod === 'transfer' ? 'var(--accent-gold-border)' : 'var(--accent-gold-border-lo)'}`, textAlign: flip('left', 'right') }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '18px' }}>🏦</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{t('payment.transfer')}</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{t('payment.transfer_desc')}</p>
        </motion.button>

        <AnimatePresence>
          {paymentMethod === 'transfer' && (
            <motion.div key="transfer-info"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--accent-gold-border-lo)', margin: '0 4px 4px' }}>
                {[['Banque', 'CIH Bank'], ['RIB', '230 780 0000 0000 0000 0000 12'], ['Référence', `#${orderId}`]].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '5px 0' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'monospace', fontSize: '12px' }}>{val}</span>
                  </div>
                ))}
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', marginBottom: 0 }}>{t('payment.transfer_note')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px', textAlign: 'center', lineHeight: '1.6' }}>{t('payment.legal')}</p>
    </div>
  )
}

function OrderSummary({ items, subtotal, shippingCost, activeStep, promo, setPromo, paymentMethod, onContinue, confirmed, checkoutError, t, isNarrow, flip }) {
  const ctaLabel = [t('summary.checkout'), t('delivery.continue'), t('payment.confirm')][activeStep] ?? t('summary.checkout')
  const total = subtotal + shippingCost

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      style={{ background: 'var(--bg-surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--accent-gold-border-lo)', borderRadius: '28px', padding: isNarrow ? '20px 16px' : '28px', position: isNarrow ? 'static' : 'sticky', top: '96px' }}
    >
      <h3 style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '2px', marginBottom: '20px' }}>{t('summary.heading')}</h3>

      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(it => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{it.qty}× {it.name}</span>
            <span style={{ flexShrink: 0 }}>MAD {it.price * it.qty}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span>{t('summary.subtotal')}</span><span>MAD {subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', marginBottom: activeStep === 2 ? '8px' : '0' }}>
          <span>{t('summary.delivery')}</span>
          <span style={{ color: shippingCost === 0 ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
            {shippingCost === 0 ? t('summary.free') : `MAD ${shippingCost}`}
          </span>
        </div>
        {activeStep === 2 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>{t('payment.method_label')}</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {paymentMethod === 'cod' ? t('payment.cod') : paymentMethod === 'card' ? t('payment.card') : t('payment.transfer')}
            </span>
          </div>
        )}
      </div>

      {activeStep === 0 && (
        <div style={{ display: 'flex', gap: '8px', margin: '18px 0' }}>
          <input type="text" placeholder={t('summary.promo_placeholder')} value={promo} onChange={e => setPromo(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--accent-gold-border-lo)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', textAlign: flip('left', 'right'), outline: 'none' }} />
          <motion.button
            whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold-border)', color: 'var(--accent-gold)' }}
            style={{ padding: '10px 16px', borderRadius: '10px', background: 'var(--bg-surface)', border: '1px solid var(--accent-gold-border-lo)', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}
          >{t('summary.promo_apply')}</motion.button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', margin: '16px 0 20px' }}>
        <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{t('summary.total')}</span>
        <span style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '26px', color: 'var(--accent-gold)' }}>MAD {total}</span>
      </div>

      {!confirmed && (
        <>
          {checkoutError && (
            <p style={{ color: 'var(--destructive)', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{checkoutError}</p>
          )}
          <motion.button
            onClick={onContinue}
            whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(212,175,55,0.4)' }}
            whileTap={{ scale: 0.98 }}
            style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '15px', color: 'var(--bg-base)', cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,55,0.28)' }}
          >{ctaLabel}</motion.button>
        </>
      )}
    </motion.div>
  )
}

export default function CartDetails() {
  const { t } = useTranslation('cart', { useSuspense: false })
  const { flip } = useDirection()
  const isNarrow = useIsNarrow()
  const { user } = useAuth()

  const [items, setItems] = useState([])
  const [promo, setPromo] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const [orderId, setOrderId] = useState(null)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('biohna_cart') || '[]')
      setItems(stored)
    } catch {
      setItems([])
    }
  }, [])
  const [direction, setDirection] = useState(1)

  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', phone: '', address: '',
    city: '', postal: '', note: '', shipping: 'standard',
  })
  const [deliveryErrors, setDeliveryErrors] = useState({})

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [confirmed, setConfirmed] = useState(false)

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)
  const shippingCost = activeStep >= 1
    ? (delivery.shipping === 'express' ? 65 : subtotal >= 500 ? 0 : 35)
    : 0

  const goToStep = (step) => {
    setDirection(step > activeStep ? 1 : -1)
    setActiveStep(step)
  }

  const validateDelivery = () => {
    const errs = {}
    ;['firstName', 'lastName', 'phone', 'address', 'city', 'postal'].forEach(f => {
      if (!delivery[f]?.trim()) errs[f] = t('delivery.required')
    })
    setDeliveryErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleContinue = async () => {
    if (activeStep === 0) {
      goToStep(1)
    } else if (activeStep === 1 && validateDelivery()) {
      goToStep(2)
    } else if (activeStep === 2) {
      try {
        // Map payment method to API enum
        const paymentMethodMap = {
          cod: 'CASH',
          card: 'CARD',
          transfer: 'TRANSFER'
        }

        const orderPayload = {
          userId: user?.id,
          paymentMethod: paymentMethodMap[paymentMethod] || 'CASH',
          cart: items.map(item => ({
            productId: item.id,
            quantity: item.qty,
            pricePerUnit: parseFloat(item.price),
            vendorId: item.vendorId
          })),
          shipping: {
            recipientName: `${delivery.firstName} ${delivery.lastName}`.trim(),
            addressLine1: delivery.address,
            city: delivery.city,
            postalCode: delivery.postal,
            phone: delivery.phone,
            shippingMethod: delivery.shipping === 'express' ? 'EXPRESS' : 'STANDARD'
          }
        }

        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        })

        const orderData = await orderResponse.json()

        if (!orderData.success) {
          console.error('Order creation failed:', orderData.error)
          setCheckoutError(orderData.error || 'La commande a échoué. Veuillez réessayer.')
          return
        }

        // Initiate payment stub
        await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.data.id,
            amount: subtotal + shippingCost,
            paymentMethod: paymentMethodMap[paymentMethod] || 'CASH'
          })
        })

        // Success — clear cart and show confirmation
        setOrderId(orderData.data.id)
        localStorage.removeItem('biohna_cart')
        setItems([])
        setConfirmed(true)

      } catch (error) {
        console.error('Checkout error:', error)
        setCheckoutError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

  const STEPS = [t('steps.cart'), t('steps.delivery'), t('steps.payment')]
  const updateQty = (id, delta) => setItems(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
  const removeItem = (id) => setItems(prev => prev.filter(it => it.id !== id))

  const glassPanel = { background: 'var(--bg-surface)', backdropFilter: 'blur(16px)', border: '1px solid var(--accent-gold-border-lo)', borderRadius: '28px', padding: isNarrow ? '20px 16px' : '28px 32px' }

  return (
    <PageWrapper>
      <NavBar />
      <div style={{ minHeight: '100vh', padding: isNarrow ? '96px 16px 80px' : '120px 48px 80px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Stepper */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '60px' }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  whileHover={i < activeStep ? { scale: 1.08 } : {}}
                  onClick={() => i < activeStep && goToStep(i)}
                  style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i === activeStep ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))' : i < activeStep ? 'var(--accent-gold)' : 'var(--bg-surface)',
                    border: i <= activeStep ? 'none' : '1px solid var(--accent-gold-border-lo)',
                    color: i <= activeStep ? 'var(--bg-base)' : 'var(--text-muted)',
                    fontSize: '13px', fontWeight: 700,
                    cursor: i < activeStep ? 'pointer' : 'default',
                  }}
                >{i < activeStep ? '✓' : i + 1}</motion.div>
                <span style={{ fontSize: '11px', color: i === activeStep ? 'var(--accent-gold)' : 'var(--text-muted)', letterSpacing: '0.5px' }}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: isNarrow ? '40px' : '80px', height: '1px', background: i < activeStep ? 'var(--accent-gold)' : 'var(--border-subtle)', margin: '0 12px 16px' }} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 360px', gap: isNarrow ? '20px' : '32px', alignItems: 'start' }}>

          <AnimatePresence mode="wait" custom={direction}>
            {activeStep === 0 && (
              <motion.div key="step-cart" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit"
                style={glassPanel}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h2 style={{ fontFamily: "'Anton SC', sans-serif", fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '2px' }}>{t('heading')}</h2>
                  <span style={{ padding: '3px 12px', borderRadius: '12px', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-gold)' }}>{items.length}</span>
                </div>
                <div>
                  {items.map(it => (
                    <CartItem key={it.id} item={it} onQty={updateQty} onRemove={removeItem} byVendor={t('by_vendor', { vendor: it.vendor })} />
                  ))}
                </div>
                <div style={{ marginTop: '20px' }}>
                  <Link href="/produits" style={{ fontSize: '13px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-gold)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  >{t('summary.continue')}</Link>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div key="step-delivery" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit"
                style={glassPanel}>
                <DeliveryPanel
                  delivery={delivery}
                  onChange={(field, val) => {
                    setDelivery(prev => ({ ...prev, [field]: val }))
                    if (deliveryErrors[field]) setDeliveryErrors(prev => ({ ...prev, [field]: undefined }))
                  }}
                  errors={deliveryErrors}
                  t={t} flip={flip} isNarrow={isNarrow}
                  onBack={() => goToStep(0)}
                />
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div key="step-payment" custom={direction} variants={panelVariants} initial="enter" animate="center" exit="exit"
                style={glassPanel}>
                <PaymentPanel
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  cardInfo={cardInfo}
                  setCardInfo={setCardInfo}
                  confirmed={confirmed}
                  orderId={orderId}
                  checkoutError={checkoutError}
                  t={t} flip={flip} isNarrow={isNarrow}
                  onBack={() => goToStep(1)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            shippingCost={shippingCost}
            activeStep={activeStep}
            promo={promo}
            setPromo={setPromo}
            paymentMethod={paymentMethod}
            onContinue={handleContinue}
            confirmed={confirmed}
            checkoutError={checkoutError}
            t={t} isNarrow={isNarrow} flip={flip}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
