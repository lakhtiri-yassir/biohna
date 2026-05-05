'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import NavBar from '@/components/NavBar.jsx'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import { useDirection } from '@/hooks/useDirection.js'

const ease = [0.22, 1, 0.36, 1]

// Constants for vendor specialties and regions
const SPECIALTIES = [
  'Céramique', 'Maroquinerie', 'Textile', 'Tapis', 'Bijoux',
  'Cosmétiques', 'Huiles', 'Miel', 'Épices', 'Alimentation'
]

const REGIONS = [
  'Souss-Massa', 'Marrakech-Safi', 'Fès-Meknès', 'Rabat-Salé-Kénitra',
  'Casablanca-Settat', 'Tanger-Tétouan-Al Hoceïma', 'Oriental', 
  'Essaouira', 'Taroudant', 'Agadir'
]

function ProfileInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  const [focused, setFocused] = useState(false)
  const { flip } = useDirection()
  const inputStyle = {
    width: '100%', padding: '13px 14px',
    background: focused ? 'var(--bg-input-focus)' : 'var(--bg-input)',
    border: focused ? '1px solid rgba(212,175,55,0.5)' : '1px solid var(--accent-gold-border-lo)',
    borderRadius: '12px', color: 'var(--text-primary)',
    fontSize: '14px', fontFamily: "'Anek Latin', var(--font-body), sans-serif",
    textAlign: flip('left', 'right'),
    outline: 'none', transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none',
  }
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      />
    </div>
  )
}

function ProfileSelect({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false)
  const { t } = useTranslation('profile')
  const inputStyle = {
    width: '100%', padding: '13px 14px',
    background: focused ? 'var(--bg-input-focus)' : 'var(--bg-input)',
    border: focused ? '1px solid rgba(212,175,55,0.5)' : '1px solid var(--accent-gold-border-lo)',
    borderRadius: '12px', color: 'var(--text-primary)',
    fontSize: '14px', fontFamily: "'Anek Latin', var(--font-body), sans-serif",
    outline: 'none', transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(212,175,55,0.1)' : 'none',
    appearance: 'none', WebkitAppearance: 'none',
    cursor: 'pointer',
  }
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle}
      >
        <option value="" className="profile-select-opt">{t('vendor_info.select_placeholder')}</option>
        {options.map(o => (
          <option key={o} value={o} className="profile-select-opt">{o}</option>
        ))}
      </select>
    </div>
  )
}

function PasswordStrength({ password }) {
  let strength = 0
  if (password.length >= 5) strength = 1
  if (password.length >= 9) strength = 2
  if (password.length >= 13) strength = 3
  if (password.length >= 16) strength = 4
  const colors = ['transparent', '#ff4d4d', '#ff9900', '#d4af37', '#d4af37']
  return (
    <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{
          flex: 1, height: '3px', borderRadius: '2px',
          background: i <= strength ? colors[strength] : 'var(--border-subtle)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}

function SectionHeader({ title, editing, onEdit, onCancel }) {
  const { t } = useTranslation('profile')
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
      <h3 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
        {title}
      </h3>
      {editing ? (
        <motion.button
          whileHover={{ color: 'var(--text-secondary)' }}
          onClick={onCancel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', var(--font-body), sans-serif" }}
        >
          {t('actions.cancel')}
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ color: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }}
          onClick={onEdit}
          style={{ background: 'none', border: '1px solid var(--accent-gold-border)', borderRadius: '8px', padding: '5px 14px', cursor: 'pointer', fontSize: '12px', color: 'rgba(212,175,55,0.7)', fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontWeight: 600, letterSpacing: '0.5px', transition: 'color 0.2s, border-color 0.2s' }}
        >
          {t('actions.edit')}
        </motion.button>
      )}
    </div>
  )
}

function SaveButton({ onClick, label }) {
  const { t } = useTranslation('profile')
  const btnLabel = label ?? t('actions.save')
  return (
    <motion.button
      whileHover={{ y: -1, boxShadow: '0 6px 24px rgba(212,175,55,0.4)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{ padding: '12px 28px', background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '13px', color: 'var(--bg-base)', cursor: 'pointer', letterSpacing: '0.5px' }}
    >
      {btnLabel}
    </motion.button>
  )
}

function FieldRow({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '5px' }}>{label}</p>
      <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontFamily: "'Anek Latin', sans-serif" }}>{value || '—'}</p>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: '42px', height: '24px', borderRadius: '12px', flexShrink: 0,
        background: checked ? 'var(--accent-gold-hover-bg)' : 'var(--bg-surface-hover)',
        border: checked ? '1px solid var(--accent-gold-border)' : '1px solid var(--border-subtle)',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.25s, border-color 0.25s',
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          position: 'absolute', top: '3px',
          width: '16px', height: '16px', borderRadius: '50%',
          background: checked ? 'var(--accent-gold)' : 'var(--text-muted)',
          boxShadow: checked ? '0 0 6px rgba(212,175,55,0.5)' : 'none',
        }}
      />
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange, last = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '14px 0', borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Anek Latin', sans-serif", marginBottom: '3px' }}>{label}</p>
        {description && <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', sans-serif", lineHeight: 1.4 }}>{description}</p>}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  )
}

function readImageFile(file, onSuccess, onError, errorMsg) {
  if (file.size > 2 * 1024 * 1024) {
    onError(errorMsg)
    return
  }
  const reader = new FileReader()
  reader.onload = () => onSuccess(reader.result)
  reader.readAsDataURL(file)
}

function AvatarUpload({ user, onUpload }) {
  const [hovered, setHovered] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const { t } = useTranslation('profile')
  const initials = user.initials ?? 
    (user.fullName ? 
      user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 
      '??')

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    readImageFile(file, onUpload, setError, t('image_error'))
    e.target.value = ''
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => fileRef.current.click()}
        style={{ width: '110px', height: '110px', borderRadius: '50%', cursor: 'pointer', position: 'relative', border: '3px solid var(--accent-gold-border)', background: 'var(--bg-base)', overflow: 'hidden', flexShrink: 0 }}
      >
        {user.picture ? (
          <img src={user.picture} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent-gold-bg-strong), var(--accent-gold-bg))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anek Latin', sans-serif", fontWeight: 700, fontSize: '28px', letterSpacing: '2px', color: 'var(--accent-gold)' }}>
            {initials}
          </div>
        )}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      {error && <p style={{ position: 'absolute', top: '115px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '11px', color: 'var(--destructive)', marginTop: '6px' }}>{error}</p>}
    </div>
  )
}

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile, updateAvatar, updateBanner, updateSettings } = useAuth()
  const router = useRouter()
  const { t } = useTranslation('profile')
  const { t: tc } = useTranslation('common')
  const { flip } = useDirection()

  const s = user?.settings ?? {
    language: 'fr',
    currency: 'MAD',
    notifications: {
      email: true,
      push: false,
      marketing: false
    },
    privacy: {
      profilePublic: false,
      showEmail: false,
      showPhone: false
    }
  }
  const [editingAddress, setEditingAddress] = useState(false)
  const [addressForm, setAddressForm] = useState({ street: '', city: '', postal: '', country: 'Maroc' })
  const [addressSaved, setAddressSaved] = useState(false)

  const [editingInfo, setEditingInfo] = useState(false)
  const [infoForm, setInfoForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [infoSaved, setInfoSaved] = useState(false)

  const [editingPwd, setEditingPwd] = useState(false)
  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [pwdSaved, setPwdSaved] = useState(false)
  const [pwdError, setPwdError] = useState('')

  const [editingVendor, setEditingVendor] = useState(false)
  const [vendorForm, setVendorForm] = useState({ cooperativeName: '', region: '', specialty: '', description: '' })

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [bannerError, setBannerError] = useState('')
  const bannerFileRef = useRef(null)

  if (!isAuthenticated || !user) {
    return (
      <PageWrapper>
        <NavBar />
        <div style={{ padding: '160px 48px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '28px', color: 'var(--text-primary)', marginBottom: '16px' }}>
            {t('access_denied')}
          </p>
          <motion.button
            whileHover={{ color: 'var(--accent-gold)' }}
            onClick={() => router.push('/login')}
            style={{ fontSize: '14px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {t('login_redirect')}
          </motion.button>
        </div>
      </PageWrapper>
    )
  }

  const roleBadge = tc('profile_menu.client') // Default to client since role field doesn't exist in schema

  function startEditInfo() {
    setInfoForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone })
    setInfoSaved(false)
    setEditingInfo(true)
  }
  function saveInfo() {
    updateProfile(infoForm)
    setEditingInfo(false)
    setInfoSaved(true)
    setTimeout(() => setInfoSaved(false), 3000)
  }

  function startEditPwd() {
    setPwdForm({ current: '', next: '', confirm: '' })
    setPwdError('')
    setPwdSaved(false)
    setEditingPwd(true)
  }
  function savePwd() {
    if (pwdForm.next.length < 8) { setPwdError(t('password.error_length')); return }
    if (pwdForm.next !== pwdForm.confirm) { setPwdError(t('password.error_match')); return }
    setPwdError('')
    setPwdForm({ current: '', next: '', confirm: '' })
    setEditingPwd(false)
    setPwdSaved(true)
    setTimeout(() => setPwdSaved(false), 3000)
  }

  function startEditVendor() {
    setVendorForm({
      cooperativeName: user.cooperativeName ?? '',
      region: user.region ?? '',
      specialty: user.specialty ?? '',
      description: user.description ?? '',
    })
    setEditingVendor(true)
  }
  function saveVendor() {
    updateProfile(vendorForm)
    setEditingVendor(false)
  }

  function handleBannerFile(e) {
    const file = e.target.files[0]
    if (!file) return
    readImageFile(file, updateBanner, setBannerError, t('image_error'))
    e.target.value = ''
  }

  function startEditAddress() {
    setAddressForm(s.address ?? { street: '', city: '', postal: '', country: 'Maroc' })
    setAddressSaved(false)
    setEditingAddress(true)
  }
  function saveAddress() {
    updateSettings({ address: addressForm })
    setEditingAddress(false)
    setAddressSaved(true)
    setTimeout(() => setAddressSaved(false), 3000)
  }

  function confirmDelete() {
    logout()
    router.push('/')
  }

  return (
    <PageWrapper>
      <NavBar />
      <style>{`
        .profile-select-opt { background: var(--bg-elevated); color: var(--text-primary); }
      `}</style>

      <div style={{ padding: '100px 48px 120px', maxWidth: '900px', margin: '0 auto' }}>

        {/* ── Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          style={{ borderRadius: '24px', height: '280px', position: 'relative', overflow: 'hidden', marginBottom: '0' }}
        >
          {user.banner ? (
            <img src={user.banner} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent-gold-bg-strong) 0%, var(--accent-gold-bg) 50%, var(--bg-base) 100%)' }} />
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 100%)' }} />

          <motion.button
            whileHover={{ background: 'var(--accent-gold-hover-bg)', borderColor: 'var(--accent-gold)' }}
            onClick={() => bannerFileRef.current.click()}
            style={{ position: 'absolute', top: '16px', right: '16px', width: '38px', height: '38px', borderRadius: '50%', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent-gold)' }}
            title="Changer la bannière"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </motion.button>
          <input ref={bannerFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerFile} />
          {bannerError && (
            <p style={{ position: 'absolute', bottom: '8px', right: '16px', fontSize: '11px', color: 'var(--destructive)' }}>{bannerError}</p>
          )}
        </motion.div>

        {/* ── Avatar overlapping banner ── */}
        <div style={{ position: 'relative', marginTop: '-55px', paddingLeft: '48px', marginBottom: '20px', zIndex: 2 }}>
          <AvatarUpload user={user} onUpload={updateAvatar} />
        </div>

        {/* ── User identity ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          style={{ paddingLeft: '4px', marginBottom: '48px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ fontFamily: "'Anton SC', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', color: 'var(--text-primary)', letterSpacing: '2px', lineHeight: 1 }}>
              {user.firstName} {user.lastName}
            </h1>
            <span style={{ padding: '5px 14px', borderRadius: '14px', background: 'var(--accent-gold-bg)', border: '1px solid var(--accent-gold-border)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Anek Latin', sans-serif" }}>
              {roleBadge}
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', letterSpacing: '0.3px' }}>{user.email}</p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
            {[
              { label: t('member_since'), value: user.memberSince },
              // Vendor fields removed since role field doesn't exist in schema
            ].map(stat => (
              <div key={stat.label} style={{ padding: '7px 14px', borderRadius: '10px', background: 'var(--bg-surface-hover)', border: '1px solid var(--accent-gold-border-lo)' }}>
                <p style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '3px' }}>{stat.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-gold)' }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Settings Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          style={{ borderRadius: '28px', background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--accent-gold-border-lo)', boxShadow: 'var(--shadow-heavy)' }}
        >

          {/* ── Personal info section ── */}
          <div style={{ padding: '36px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
            <SectionHeader title={t('personal_info')} editing={editingInfo} onEdit={startEditInfo} onCancel={() => setEditingInfo(false)} />

            <AnimatePresence mode="wait">
              {editingInfo ? (
                <motion.div key="edit" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <ProfileInput label={t('fields.first_name')} value={infoForm.firstName} onChange={v => setInfoForm(f => ({ ...f, firstName: v }))} />
                    <ProfileInput label={t('fields.last_name')} value={infoForm.lastName} onChange={v => setInfoForm(f => ({ ...f, lastName: v }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <ProfileInput label={t('fields.email')} value={infoForm.email} onChange={v => setInfoForm(f => ({ ...f, email: v }))} type="email" />
                    <ProfileInput label={t('fields.phone')} value={infoForm.phone} onChange={v => setInfoForm(f => ({ ...f, phone: v }))} placeholder={t('fields.phone_placeholder')} />
                  </div>
                  <SaveButton onClick={saveInfo} />
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <FieldRow label={t('fields.first_name')} value={user.firstName} />
                    <FieldRow label={t('fields.last_name')} value={user.lastName} />
                    <FieldRow label={t('fields.email')} value={user.email} />
                    <FieldRow label={t('fields.phone')} value={user.phone} />
                  </div>
                  {infoSaved && (
                    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: '12px', color: '#10b981', marginTop: '14px' }}>
                      {t('actions.saved')}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Password section ── */}
          <div style={{ padding: '36px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
            <SectionHeader title={t('password.section')} editing={editingPwd} onEdit={startEditPwd} onCancel={() => setEditingPwd(false)} />

            <AnimatePresence mode="wait">
              {editingPwd ? (
                <motion.div key="edit" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px' }}>
                    <ProfileInput label={t('password.current')} value={pwdForm.current} onChange={v => setPwdForm(f => ({ ...f, current: v }))} type="password" placeholder="••••••••" />
                    <div>
                      <ProfileInput label={t('password.new')} value={pwdForm.next} onChange={v => setPwdForm(f => ({ ...f, next: v }))} type="password" placeholder="••••••••" />
                      <PasswordStrength password={pwdForm.next} />
                    </div>
                    <ProfileInput label={t('password.confirm')} value={pwdForm.confirm} onChange={v => setPwdForm(f => ({ ...f, confirm: v }))} type="password" placeholder="••••••••" />
                  </div>
                  {pwdError && <p style={{ fontSize: '12px', color: 'var(--destructive)', marginBottom: '16px' }}>{pwdError}</p>}
                  <div style={{ marginTop: '8px' }}>
                    <SaveButton onClick={savePwd} label={t('actions.update')} />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', sans-serif", letterSpacing: '4px' }}>••••••••••••</p>
                  {pwdSaved && (
                    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '12px', color: '#10b981', marginTop: '10px' }}>
                      {t('actions.updated')}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Vendor section temporarily disabled since role field doesn't exist in schema */}

          {/* ── Danger zone ── */}
          <div style={{ padding: '36px 40px' }}>
            <h3 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '16px', color: 'var(--destructive)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
              {t('danger.section')}
            </h3>

            <AnimatePresence mode="wait">
              {showDeleteConfirm ? (
                <motion.div key="confirm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '18px', fontFamily: "'Anek Latin', sans-serif" }}>
                    {t('danger.irreversible')}
                  </p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <motion.button
                      whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(255,80,80,0.3)' }}
                      onClick={confirmDelete}
                      style={{ padding: '10px 22px', background: 'var(--destructive-bg)', border: '1px solid var(--destructive)', borderRadius: '10px', color: 'var(--destructive)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Latin', sans-serif" }}
                    >
                      {t('danger.confirm_delete')}
                    </motion.button>
                    <motion.button
                      whileHover={{ borderColor: 'var(--accent-gold-border)' }}
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{ padding: '10px 22px', background: 'none', border: '1px solid var(--accent-gold-border-lo)', borderRadius: '10px', color: 'rgba(212,175,55,0.6)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Latin', sans-serif" }}
                    >
                      {t('danger.cancel')}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', fontFamily: "'Anek Latin', sans-serif", lineHeight: 1.6 }}>
                    {t('danger.delete_description')}
                  </p>
                  <motion.button
                    whileHover={{ background: 'var(--destructive-hover-bg)', borderColor: 'var(--destructive)', color: 'var(--destructive)' }}
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{ padding: '10px 22px', background: 'none', border: '1px solid var(--destructive-bg)', borderRadius: '10px', color: 'var(--destructive)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Anek Latin', sans-serif", transition: 'all 0.2s' }}
                  >
                    {t('danger.delete_btn')}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>

        {/* ── Preferences / Settings Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          style={{ marginTop: '24px', borderRadius: '28px', background: 'var(--bg-surface)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--accent-gold-border-lo)', boxShadow: 'var(--shadow-heavy)' }}
        >

          {/* ── Notifications ── */}
          <div style={{ padding: '36px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('notifications.section')}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', var(--font-body), sans-serif", marginBottom: '20px' }}>
              {t('notifications.description')}
            </p>
            <ToggleRow label={t('notifications.orders')} description={t('notifications.orders_desc')} checked={s.notifOrders} onChange={v => updateSettings({ notifOrders: v })} />
            <ToggleRow label={t('notifications.offers')} description={t('notifications.offers_desc')} checked={s.notifPromotions} onChange={v => updateSettings({ notifPromotions: v })} />
            <ToggleRow label={t('notifications.newsletter')} description={t('notifications.newsletter_desc')} checked={s.notifNewsletter} onChange={v => updateSettings({ notifNewsletter: v })} />
            <ToggleRow label={t('notifications.new_artisans')} description={t('notifications.new_artisans_desc')} checked={s.notifArtisans} onChange={v => updateSettings({ notifArtisans: v })} last />
          </div>

          {/* ── Privacy ── */}
          <div style={{ padding: '36px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('privacy.section')}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', var(--font-body), sans-serif", marginBottom: '20px' }}>
              {t('privacy.description')}
            </p>
            <ToggleRow label={t('privacy.public_profile')} description={t('privacy.public_profile_desc')} checked={s.profilePublic} onChange={v => updateSettings({ profilePublic: v })} />
            <ToggleRow label={t('privacy.show_email')} description={t('privacy.show_email_desc')} checked={s.showEmail} onChange={v => updateSettings({ showEmail: v })} last />
          </div>

          {/* ── Currency ── */}
          <div style={{ padding: '36px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontFamily: "'Anton SC', var(--font-display), sans-serif", fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('currency.section')}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', var(--font-body), sans-serif", marginBottom: '20px' }}>
              {t('currency.description')}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { code: 'MAD', label: t('currency.mad') },
                { code: 'EUR', label: t('currency.eur') },
                { code: 'USD', label: t('currency.usd') },
              ].map(cur => (
                <motion.button
                  key={cur.code}
                  whileHover={{ borderColor: 'var(--accent-gold-border)' }}
                  onClick={() => updateSettings({ currency: cur.code })}
                  style={{
                    padding: '11px 20px', borderRadius: '11px',
                    background: s.currency === cur.code ? 'var(--accent-gold-bg)' : 'var(--bg-surface-hover)',
                    border: s.currency === cur.code ? '1px solid var(--accent-gold-border)' : '1px solid var(--border-subtle)',
                    color: s.currency === cur.code ? 'var(--accent-gold)' : 'var(--text-muted)',
                    fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                    fontFamily: "'Anek Latin', sans-serif",
                    transition: 'all 0.2s',
                  }}
                >
                  {cur.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ── Delivery address ── */}
          <div style={{ padding: '36px 40px' }}>
            <SectionHeader
              title={t('address.section')}
              editing={editingAddress}
              onEdit={startEditAddress}
              onCancel={() => setEditingAddress(false)}
            />

            <AnimatePresence mode="wait">
              {editingAddress ? (
                <motion.div key="edit" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25, ease }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    <ProfileInput label={t('address.street')} value={addressForm.street} onChange={v => setAddressForm(f => ({ ...f, street: v }))} placeholder={t('address.street_placeholder')} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <ProfileInput label={t('address.city')} value={addressForm.city} onChange={v => setAddressForm(f => ({ ...f, city: v }))} placeholder={t('address.city_placeholder')} />
                      <ProfileInput label={t('address.zip')} value={addressForm.postal} onChange={v => setAddressForm(f => ({ ...f, postal: v }))} placeholder={t('address.zip_placeholder')} />
                    </div>
                    <ProfileInput label={t('address.country')} value={addressForm.country} onChange={v => setAddressForm(f => ({ ...f, country: v }))} placeholder={t('address.country_placeholder')} />
                  </div>
                  <SaveButton onClick={saveAddress} />
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {s.address?.street ? (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, marginTop: '2px', color: 'var(--accent-gold-border)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontFamily: "'Anek Latin', sans-serif", lineHeight: 1.6 }}>
                          {s.address.street}
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', sans-serif" }}>
                          {[s.address.postal, s.address.city, s.address.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: "'Anek Latin', var(--font-body), sans-serif", fontStyle: 'italic' }}>
                      {t('address.empty')}
                    </p>
                  )}
                  {addressSaved && (
                    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: '12px', color: '#10b981', marginTop: '12px' }}>
                      {t('address.saved')}
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </PageWrapper>
  )
}
