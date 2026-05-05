'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import { useDirection } from '@/hooks/useDirection.js'

function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 3 + 1
      Object.assign(p.style, {
        position: 'absolute', width: size + 'px', height: size + 'px',
        borderRadius: '50%', background: 'rgba(212,175,55,0.28)',
        left: Math.random() * 100 + '%',
        animation: `particleDrift ${Math.random() * 14 + 10}s linear ${Math.random() * 14}s infinite`,
      })
      el.appendChild(p)
    }
    return () => { el.innerHTML = '' }
  }, [])
  return <div ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }} />
}

function Stepper({ steps, currentStep }) {
  const { isRTL } = useDirection()
  return (
    <div style={{ display:'flex', alignItems:'center', marginBottom:'28px' }}>
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isDone = stepNum < currentStep
        const isActive = stepNum === currentStep
        return (
          <div key={label} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'5px', position:'relative' }}>
            {i < steps.length - 1 && (
              <div style={{
                position:'absolute', top:'13px',
                [isRTL ? 'right' : 'left']: 'calc(50% + 14px)',
                width:'calc(100% - 28px)', height:'1px',
                background: isDone ? 'var(--accent-gold-border)' : 'var(--border-subtle)',
                zIndex:0,
              }} />
            )}
            <div style={{
              width:'28px', height:'28px', borderRadius:'50%', zIndex:1,
              display:'flex', alignItems:'center', justifyContent:'center',
              border: isDone || isActive ? '1.5px solid var(--accent-gold)' : '1.5px solid var(--border-subtle)',
              background: isDone ? 'var(--accent-gold)' : isActive ? 'var(--accent-gold-bg)' : 'var(--bg-surface)',
              color: isDone ? 'var(--bg-base)' : isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
              fontSize:'11px', fontWeight:700,
            }}>
              {isDone ? '✓' : stepNum}
            </div>
            <span style={{
              fontSize:'10px', letterSpacing:'0.5px', textAlign:'center',
              color: isActive ? 'var(--accent-gold)' : isDone ? 'var(--accent-gold)' : 'var(--text-muted)',
            }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}

function StepRole({ role, setRole, onNext }) {
  const { t } = useTranslation('auth')
  const roleCards = [
    {
      value: 'client',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
      title: t('signin.client_role'),
      sub: t('signin.client_desc'),
    },
    {
      value: 'vendor',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l1-4h16l1 4"/><path d="M3 9h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/>
          <path d="M9 9v12M15 9v12"/>
        </svg>
      ),
      title: t('signin.vendor_role'),
      sub: t('signin.vendor_desc'),
    },
  ]

  return (
    <motion.div
      key="step-role"
      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
    >
      <p style={{ fontSize:'13px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'18px' }}>
        {t('signin.role_label')}
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'28px' }}>
        {roleCards.map(card => {
          const isActive = role === card.value
          return (
            <motion.button
              key={card.value}
              onClick={() => setRole(card.value)}
              whileHover={{ borderColor:'var(--accent-gold-border)', background:'var(--accent-gold-bg)' }}
              style={{
                padding:'22px 16px', borderRadius:'16px', cursor:'pointer',
                border: isActive ? '1.5px solid var(--accent-gold)' : '1px solid var(--accent-gold-border-lo)',
                background: isActive ? 'var(--accent-gold-bg)' : 'var(--bg-surface)',
                display:'flex', flexDirection:'column', alignItems:'center', gap:'10px',
                color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                transition:'border-color 0.2s, background 0.2s, color 0.2s',
                position:'relative',
              }}
            >
              {isActive && (
                <span style={{
                  position:'absolute', top:'10px', right:'10px',
                  width:'16px', height:'16px', borderRadius:'50%',
                  background:'var(--accent-gold)', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'9px', color:'var(--bg-base)', fontWeight:700,
                }}>✓</span>
              )}
              {card.icon}
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:'13px', fontWeight:700, letterSpacing:'0.5px', marginBottom:'4px', color: isActive ? 'var(--accent-gold)' : 'var(--text-primary)' }}>{card.title}</p>
                <p style={{ fontSize:'11px', color:'var(--text-muted)', lineHeight:1.4 }}>{card.sub}</p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <motion.button
        onClick={onNext}
        disabled={!role}
        whileHover={role ? { y:-2, boxShadow:'0 8px 36px rgba(212,175,55,0.4)' } : {}}
        whileTap={role ? { scale:0.98 } : {}}
        style={{
          width:'100%', padding:'16px',
          background: role ? 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))' : 'var(--bg-surface)',
          border:'none', borderRadius:'14px', fontWeight:700, fontSize:'16px',
          color: role ? 'var(--bg-base)' : 'var(--text-muted)',
          cursor: role ? 'pointer' : 'not-allowed',
          boxShadow: role ? '0 4px 24px rgba(212,175,55,0.3)' : 'none',
          transition:'all 0.25s',
          fontFamily:"'Anek Latin', var(--font-body), sans-serif",
        }}
      >
        {t('signin.continue')}
      </motion.button>
    </motion.div>
  )
}

function StepAccount({ role, onNext, formData, setFormData, loading, error }) {
  const { t } = useTranslation('auth')
  const { flip } = useDirection()
  const strength = formData.password.length === 0 ? 0 : formData.password.length < 5 ? 1 : formData.password.length < 9 ? 2 : formData.password.length < 13 ? 3 : 4
  const strengthColor = strength <= 1 ? '#ff6b6b' : strength === 2 ? '#ffa94d' : 'var(--accent-gold)'
  const isVendor = role === 'vendor'

  function updateFormData(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const inputStyle = {
    width: '100%', padding: flip('13px 14px 13px 42px', '13px 42px 13px 14px'),
    background: 'var(--bg-input)',
    border: '1px solid var(--accent-gold-border-lo)',
    borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px',
    fontFamily: "'Anek Latin', var(--font-body), sans-serif",
    textAlign: flip('left', 'right'),
    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
    outline: 'none',
  }

  const iconPos = { position:'absolute', [flip('left','right')]:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }

  return (
    <motion.div
      key="step-account"
      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
    >
      <form onSubmit={e => { e.preventDefault(); onNext() }}>
        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.full_name')}</label>
          <div style={{ position:'relative' }}>
            <span style={iconPos}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </span>
            <input 
              className="si-input" 
              type="text" 
              placeholder="Your full name"
              value={formData.fullName}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              required
              style={inputStyle} 
            />
          </div>
        </div>


        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.email')}</label>
          <div style={{ position:'relative' }}>
            <span style={iconPos}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8l10 6 10-6"/></svg>
            </span>
            <input 
              className="si-input" 
              type="email" 
              placeholder="exemple@gmail.com"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ marginBottom:'6px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.password')}</label>
          <div style={{ position:'relative' }}>
            <span style={iconPos}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </span>
            <input 
              className="si-input" 
              type="password" 
              placeholder="••••••••••••"
              value={formData.password}
              onChange={e => updateFormData('password', e.target.value)}
              required
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ marginBottom:'6px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.confirm_password')}</label>
          <div style={{ position:'relative' }}>
            <span style={iconPos}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </span>
            <input 
              className="si-input" 
              type="password" 
              placeholder="••••••••••••"
              value={formData.confirmPassword}
              onChange={e => updateFormData('confirmPassword', e.target.value)}
              required
              style={inputStyle} 
            />
          </div>
        </div>

        <div style={{ display:'flex', gap:'4px', marginBottom:'22px' }}>
          {[1,2,3,4].map(n => (
            <div key={n} style={{ flex:1, height:'3px', borderRadius:'2px', background: n<=strength ? strengthColor : 'var(--border-subtle)', transition:'background 0.3s' }} />
          ))}
        </div>

{error && (
          <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--destructive-bg)', border: '1px solid var(--destructive)', borderRadius: '8px', color: 'var(--destructive)', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <div style={{ display:'flex', alignItems:'flex-start', gap:'10px', marginBottom:'26px', fontSize:'13px', color:'var(--text-muted)' }}>
          <input type="checkbox" style={{ accentColor:'var(--accent-gold)', marginTop:'2px', flexShrink:0 }} />
          <span>{t('signin.terms')}</span>
        </div>

        <motion.button
          whileHover={{ y:-2, boxShadow:'0 8px 36px rgba(212,175,55,0.4)' }}
          whileTap={{ scale:0.98 }}
          type="submit"
          disabled={loading || !formData.email || !formData.password || !formData.fullName}
          style={{ 
            width:'100%', 
            padding:'16px', 
            background: loading ? 'var(--border-subtle)' : 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', 
            border:'none', 
            borderRadius:'14px', 
            fontWeight:700, 
            fontSize:'16px', 
            color:'var(--bg-base)', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            boxShadow:'0 4px 24px rgba(212,175,55,0.3)', 
            fontFamily:"'Anek Latin', var(--font-body), sans-serif",
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? (isVendor ? 'Creating...' : 'Creating account...') : (isVendor ? t('signin.continue') : t('signin.create_account'))}
        </motion.button>
      </form>
    </motion.div>
  )
}

function StepCandidature({ onSubmit, loading, error }) {
  const { t } = useTranslation('auth')
  const { flip } = useDirection()
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)

  function handleFiles(incoming) {
    setFiles(prev => [...prev, ...Array.from(incoming)])
  }

  const inputStyle = {
    width: '100%', padding: flip('13px 14px 13px 42px', '13px 42px 13px 14px'),
    background: 'var(--bg-input)',
    border: '1px solid var(--accent-gold-border-lo)',
    borderRadius: '12px', color: 'var(--text-primary)', fontSize: '14px',
    fontFamily: "'Anek Latin', var(--font-body), sans-serif",
    textAlign: flip('left', 'right'),
    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
    outline: 'none',
  }

  const iconPos = { position:'absolute', [flip('left','right')]:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }

  return (
    <motion.div
      key="step-candidature"
      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
      transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
    >
      <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'22px', lineHeight:1.6 }}>
        {t('signin.vendor_step_desc')}
      </p>

      <form onSubmit={e => { e.preventDefault(); onSubmit() }}>
        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.coop_name')}</label>
          <div style={{ position:'relative' }}>
            <span style={iconPos}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><path d="M3 9l1-4h16l1 4"/><path d="M3 9h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"/></svg>
            </span>
            <input className="si-input" type="text" placeholder={t('signin.coop_name_placeholder')} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.region')}</label>
          <div style={{ position:'relative' }}>
            <span style={iconPos}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            </span>
            <input className="si-input" type="text" placeholder={t('signin.region_placeholder')} style={inputStyle} />
          </div>
        </div>

        <div style={{ marginBottom:'16px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>{t('signin.products_desc')}</label>
          <textarea
            className="si-input"
            placeholder={t('signin.products_desc_placeholder')}
            rows={4}
            style={{ ...inputStyle, padding:'13px 14px', resize:'vertical', minHeight:'100px' }}
          />
        </div>

        {/* File upload zone */}
        <div style={{ marginBottom:'26px' }}>
          <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'8px' }}>
            {t('signin.files_label')}
          </label>
          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            style={{
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:'10px', padding:'28px 20px',
              border: dragOver ? '1.5px dashed var(--accent-gold)' : '1px dashed var(--accent-gold-border)',
              borderRadius:'12px',
              background: dragOver ? 'var(--accent-gold-bg)' : 'var(--bg-input)',
              cursor:'pointer',
              transition:'all 0.2s',
            }}
          >
            <input type="file" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" opacity="0.55">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:'13px', color:'var(--text-secondary)', marginBottom:'3px' }}>
                {t('signin.files_drag')}
              </p>
              <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>{t('signin.files_hint')}</p>
            </div>
          </label>

          {files.length > 0 && (
            <div style={{ marginTop:'10px', display:'flex', flexWrap:'wrap', gap:'6px' }}>
              {files.map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'4px 10px', borderRadius:'8px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)', fontSize:'11px', color:'var(--accent-gold)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {f.name}
                  <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'12px', padding:0, lineHeight:1 }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

{error && (
          <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--destructive-bg)', border: '1px solid var(--destructive)', borderRadius: '8px', color: 'var(--destructive)', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ y:-2, boxShadow:'0 8px 36px rgba(212,175,55,0.4)' }}
          whileTap={{ scale:0.98 }}
          type="submit"
          disabled={loading}
          style={{ 
            width:'100%', 
            padding:'16px', 
            background: loading ? 'var(--border-subtle)' : 'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', 
            border:'none', 
            borderRadius:'14px', 
            fontWeight:700, 
            fontSize:'16px', 
            color:'var(--bg-base)', 
            cursor: loading ? 'not-allowed' : 'pointer', 
            boxShadow:'0 4px 24px rgba(212,175,55,0.3)', 
            fontFamily:"'Anek Latin', var(--font-body), sans-serif",
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Submitting...' : t('signin.submit_application')}
        </motion.button>
      </form>
    </motion.div>
  )
}

function ThankYou() {
  const { t } = useTranslation('auth')
  return (
    <motion.div
      key="thankyou"
      initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
      style={{ textAlign:'center', padding:'8px 0' }}
    >
      <motion.div
        initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
        transition={{ duration:0.45, delay:0.15, ease:[0.22,1,0.36,1] }}
        style={{ marginBottom:'20px' }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M7 12l3 3 7-7"/>
        </svg>
      </motion.div>

      <h2 style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'22px', color:'var(--text-primary)', textTransform:'uppercase', letterSpacing:'2px', marginBottom:'12px' }}>
        {t('signin.success_heading')}
      </h2>
      <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.7, maxWidth:'340px', margin:'0 auto 28px' }}>
        {t('signin.success_message')}
      </p>
      <Link
        href="/"
        style={{ fontSize:'13px', fontWeight:600, letterSpacing:'1px', textTransform:'uppercase', color:'var(--accent-gold)', textDecoration:'none' }}
      >
        {t('signin.back_home')}
      </Link>
    </motion.div>
  )
}

export default function SignIn() {
  const { t } = useTranslation('auth')
  const { isRTL } = useDirection()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const router = useRouter()
  const { login } = useAuth()

  const clientSteps = [t('signin.steps.profile'), t('signin.steps.account')]
  const vendorSteps = [t('signin.steps.profile'), t('signin.steps.account'), t('signin.steps.application')]
  const steps = role === 'vendor' ? vendorSteps : clientSteps

  function handleStep1Next() { if (role) setStep(2) }
  
  async function handleStep2Next() {
    if (role === 'vendor') {
      setStep(3)
    } else {
      await registerUser()
    }
  }
  
  async function handleStep3Submit() {
    await registerUser()
  }

  async function registerUser() {
    setError('')
    setLoading(true)

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      // Auto-login after registration
      const signInResult = await login(formData.email, formData.password)
      
      if (signInResult?.ok !== false) {
        if (role === 'vendor') {
          setSubmitted(true)
        } else {
          router.push('/')
        }
      } else {
        setError('Compte créé mais connexion échouée. Veuillez vous connecter.')
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }
  
  function goBack() { if (step > 1) setStep(s => s - 1) }

  return (
    <PageWrapper>
      <style>{`
        @keyframes particleDrift {
          0%   { transform: translateY(100vh); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.3; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        .si-input:focus {
          border-color: rgba(212,175,55,0.48) !important;
          background: var(--bg-input-focus) !important;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1) !important;
          outline: none !important;
        }
      `}</style>

      <Particles />

      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 24px' }}>

        {/* Logo */}
        <motion.div
          animate={{ marginBottom: submitted ? '32px' : '24px', width: submitted ? '560px' : 'auto' }}
          transition={{ duration:0.4 }}
          style={{ textAlign:'center', maxWidth:'560px' }}
        >
          <Link href="/" style={{
            fontFamily:"'Anton SC', var(--font-display), sans-serif",
            fontSize: submitted ? 'clamp(52px, 10vw, 96px)' : '32px',
            letterSpacing: submitted ? '8px' : '5px',
            color:'var(--text-primary)', textDecoration:'none',
            transition:'font-size 0.4s ease, letter-spacing 0.4s ease',
            display:'block', width:'100%', textAlign:'center',
            direction: 'ltr',
          }}>
            BI<img src="/assets/81694cb7-7918-41a9-a93c-a54c8323bdac.png" alt="" style={{ height:'0.75em', objectFit:'contain', verticalAlign:'middle', display:'inline-block' }} />HNA
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity:0, y:36 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.85, ease:[0.22,1,0.36,1] }}
          style={{
            width:'100%', maxWidth:'560px',
            background:'var(--bg-surface)',
            backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
            border:'1px solid var(--accent-gold-border-lo)',
            borderRadius:'36px', padding:'52px 44px',
            boxShadow:'var(--shadow-heavy)',
          }}
        >
          {!submitted && (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'18px' }}>
                {step > 1 && (
                  <motion.button
                    onClick={goBack}
                    whileHover={{ x: isRTL ? 3 : -3 }}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:'0', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:'5px', fontSize:'13px', flexShrink:0 }}
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isRTL ? 'scaleX(-1)' : 'none' }}
                    >
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                  </motion.button>
                )}
                <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 16px', borderRadius:'20px', background:'var(--accent-gold-bg)', border:'1px solid var(--accent-gold-border)' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'var(--accent-gold)', display:'inline-block' }} />
                  <span style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--accent-gold)' }}>{t('signin.badge')}</span>
                </div>
              </div>

              <h1 style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'28px', color:'var(--text-primary)', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'2px' }}>
                {t('signin.heading')}
              </h1>
              <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'28px', lineHeight:1.6 }}>
                {t('signin.description')}
              </p>

              <Stepper steps={steps} currentStep={step} />
            </>
          )}

          <AnimatePresence mode="wait">
            {submitted ? (
              <ThankYou />
            ) : step === 1 ? (
              <StepRole role={role} setRole={setRole} onNext={handleStep1Next} />
            ) : step === 2 ? (
              <StepAccount 
                role={role} 
                onNext={handleStep2Next} 
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                error={error}
              />
            ) : (
              <StepCandidature onSubmit={handleStep3Submit} loading={loading} error={error} />
            )}
          </AnimatePresence>

          {!submitted && (
            <p style={{ textAlign:'center', marginTop:'22px', fontSize:'14px', color:'var(--text-muted)' }}>
              {t('signin.already_member')}{' '}
              <Link href="/login" style={{ color:'var(--accent-gold)', fontWeight:600 }}>{t('login.submit')}</Link>
            </p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  )
}
