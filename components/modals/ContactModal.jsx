'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDirection } from '../../hooks/useDirection.js'
import { useModal } from '../../context/ModalContext.jsx'

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l1.27-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
  </svg>
)

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

export default function ContactModal() {
  const { activeModal, setActiveModal } = useModal()
  const { t } = useTranslation('modals')
  const { flip } = useDirection()
  const [activeTab, setActiveTab] = useState(0)
  const isOpen = activeModal === 'contact'
  const close = () => setActiveModal(null)

  const TABS = [
    t('contact.tabs.message'),
    t('contact.tabs.order'),
    t('contact.tabs.partnership'),
  ]

  const CONTACT_METHODS = [
    { label: t('contact.phone_label'), value: t('contact.phone_value'), icon: <PhoneIcon /> },
    { label: t('contact.email_label'), value: t('contact.email_value'), icon: <MailIcon /> },
    { label: t('contact.whatsapp_label'), value: t('contact.whatsapp_status'), icon: <ChatIcon /> },
  ]

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg-input)',
    border: '0.5px solid var(--border-subtle)',
    borderRadius: '3px',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'var(--font-body), sans-serif',
    transition: 'border-color 0.2s, background 0.2s',
    textAlign: flip('left', 'right'),
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    fontFamily: 'var(--font-body), sans-serif',
  }

  const tabButtonStyle = (isActive) => ({
    padding: '16px 14px 12px',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
    color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    fontFamily: 'var(--font-body), sans-serif',
    transition: 'color 0.2s, border-color 0.2s',
    marginBottom: '-0.5px',
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-overlay)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 'min(96vw, 680px)', maxHeight: '85vh', display: 'flex', flexDirection: 'row', background: 'var(--bg-elevated)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '0.5px solid var(--accent-gold-border-lo)', borderRadius: '4px', boxShadow: 'var(--shadow-heavy)', overflow: 'hidden' }}
          >

            {/* Left sidebar */}
            <div style={{ width: '220px', flexShrink: 0, [flip('borderRight', 'borderLeft')]: '0.5px solid var(--border-subtle)', background: 'var(--accent-gold-bg)', padding: '28px 22px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-gold)', display: 'block', marginBottom: '6px', fontFamily: 'var(--font-body), sans-serif' }}>
                {t('contact.label')}
              </span>
              <p style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '20px', color: 'var(--text-primary)', letterSpacing: '2.5px', lineHeight: 1.2, marginBottom: '8px' }}>
                {t('contact.heading')}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, fontFamily: 'var(--font-body), sans-serif' }}>
                {t('contact.description')}
              </p>

              <div style={{ height: '0.5px', background: 'var(--border-subtle)', margin: '20px 0' }} />

              {CONTACT_METHODS.map(({ label, value, icon }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }}>
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px', fontFamily: 'var(--font-body), sans-serif' }}>
                      {label}
                    </p>
                    <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-body), sans-serif' }}>
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

              {/* Tab bar with close button */}
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '0.5px solid var(--border-subtle)', padding: '0 24px', flexShrink: 0 }}>
                {TABS.map((tab, i) => (
                  <button key={tab} onClick={() => setActiveTab(i)} style={tabButtonStyle(i === activeTab)}>
                    {tab}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <motion.button
                  whileHover={{ background: 'var(--destructive-bg)', color: 'var(--destructive)' }}
                  onClick={close}
                  style={{ width: '28px', height: '28px', borderRadius: '3px', background: 'var(--bg-surface)', border: '0.5px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s, color 0.2s' }}
                >✕</motion.button>
              </div>

              {/* Form body */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px 16px' }}>
                <form onSubmit={e => e.preventDefault()}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={labelStyle}>{t('contact.form.name')}</label>
                      <input type="text" placeholder={t('contact.form.name_placeholder')} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t('contact.form.email')}</label>
                      <input type="email" placeholder={t('contact.form.email_placeholder')} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={labelStyle}>{t('contact.form.subject')}</label>
                    <input type="text" placeholder={t('contact.form.subject_placeholder')} style={inputStyle} />
                  </div>

                  <div style={{ marginBottom: '6px' }}>
                    <label style={labelStyle}>{t('contact.form.message')}</label>
                    <textarea
                      placeholder={t('contact.form.message_placeholder')}
                      rows={5}
                      style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                    />
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div style={{ flexShrink: 0, borderTop: '0.5px solid var(--border-subtle)', padding: '14px 24px 20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <motion.button
                  whileHover={{ background: 'var(--bg-surface-hover)', color: 'var(--text-primary)' }}
                  onClick={close}
                  style={{ padding: '9px 16px', borderRadius: '3px', background: 'transparent', border: '0.5px solid var(--border-subtle)', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-body), sans-serif', letterSpacing: '0.5px', transition: 'background 0.2s, color 0.2s' }}
                >
                  {t('contact.cancel')}
                </motion.button>
                <motion.button
                  whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(212,175,55,0.35)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: '9px 20px', borderRadius: '3px', background: 'var(--accent-gold)', border: 'none', color: '#1a1a1a', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-body), sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}
                >
                  {t('contact.submit')}
                </motion.button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
