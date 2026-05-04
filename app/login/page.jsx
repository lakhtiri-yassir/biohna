'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import PageWrapper from '@/components/PageWrapper.jsx'
import { useAuth } from '@/context/AuthContext.jsx'
import { useIsNarrow } from '@/hooks/useIsNarrow'
import { useDirection } from '@/hooks/useDirection.js'

function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 3 + 1
      Object.assign(p.style, {
        position: 'absolute',
        width: size + 'px', height: size + 'px',
        borderRadius: '50%',
        background: 'rgba(212,175,55,0.3)',
        left: Math.random() * 100 + '%',
        animation: `particleDrift ${Math.random() * 14 + 10}s linear ${Math.random() * 14}s infinite`,
      })
      el.appendChild(p)
    }
    return () => { el.innerHTML = '' }
  }, [])
  return <div ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }} />
}

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const { t } = useTranslation('auth')
  const { flip } = useDirection()
  const router = useRouter()
  const isNarrow = useIsNarrow()

  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated])

  function handleSubmit(e) {
    e.preventDefault()
    login('client')
    router.push('/')
  }

  const inputStyle = {
    width: '100%', padding: flip('14px 14px 14px 44px', '14px 44px 14px 14px'),
    background: 'var(--bg-input)',
    border: '1px solid var(--accent-gold-border-lo)',
    borderRadius: '13px', color: 'var(--text-primary)',
    fontSize: '14px',
    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
    textAlign: flip('left', 'right'),
  }

  return (
    <PageWrapper>
      <style>{`
        @keyframes particleDrift {
          0%   { transform: translateY(100vh); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-80px); opacity: 0; }
        }
        .login-input:focus {
          border-color: rgba(212,175,55,0.5) !important;
          background: var(--bg-input-focus) !important;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.1) !important;
        }
      `}</style>

      <Particles />

      {/* Page body */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth: isNarrow ? '480px' : '1100px', display:'grid', gridTemplateColumns: isNarrow ? '1fr' : '1fr 1fr', gap: isNarrow ? '0' : '80px', alignItems:'center' }}>

          {/* Brand side — hidden on mobile */}
          {!isNarrow && (
          <motion.div
            initial={{ opacity:0, x:-30 }}
            animate={{ opacity:1, x:0 }}
            transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
            style={{ textAlign:'center' }}
          >
            <Link href="/" style={{ textDecoration:'none', display:'inline-block' }}>
              <motion.h1
                animate={{ textShadow: ['0 0 60px rgba(212,175,55,0.15)', '0 0 120px rgba(212,175,55,0.35)', '0 0 60px rgba(212,175,55,0.15)'] }}
                whileHover={{ scale:1.03 }}
                transition={{ duration:4, repeat:Infinity }}
                style={{ fontFamily:"'Anton SC', sans-serif", fontSize:'clamp(56px, 7vw, 110px)', lineHeight:0.9, letterSpacing:'6px', color:'var(--text-primary)', cursor:'pointer', direction:'ltr' }}
              >
                BI<img src="/assets/81694cb7-7918-41a9-a93c-a54c8323bdac.png" alt="" style={{ height: '0.75em', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block' }} />HNA
              </motion.h1>
            </Link>
            <p style={{ fontFamily:"'Cormorant Garamond', var(--font-serif), serif", fontStyle:'italic', fontSize:'18px', color:'var(--text-secondary)', marginTop:'20px', lineHeight:1.6, maxWidth:'340px', margin:'20px auto 0' }}>
              {t('login.brand_tagline')}
            </p>
            <div style={{ marginTop:'36px', display:'flex', justifyContent:'center', gap:'10px' }}>
              {[0, 0.3, 0.6].map((delay, i) => (
                <motion.span key={i}
                  animate={{ scale:[1, 1.6, 1], opacity:[0.4, 1, 0.4], background:['rgba(212,175,55,0.3)', '#d4af37', 'rgba(212,175,55,0.3)'] }}
                  transition={{ duration:2, delay, repeat:Infinity }}
                  style={{ display:'inline-block', width:'8px', height:'8px', borderRadius:'50%', background:'rgba(212,175,55,0.3)' }}
                />
              ))}
            </div>
          </motion.div>
          )}

          {/* Logo above card — mobile only */}
          {isNarrow && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', marginBottom: '24px' }}
            >
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
                <span style={{
                  fontFamily: "'Anton SC', var(--font-display), sans-serif",
                  fontSize: '32px', letterSpacing: '5px',
                  color: 'var(--text-primary)',
                  display: 'inline-flex', alignItems: 'center',
                  direction: 'ltr',
                }}>
                  BI<img
                    src="/assets/81694cb7-7918-41a9-a93c-a54c8323bdac.png"
                    alt=""
                    style={{ height: '0.75em', objectFit: 'contain', verticalAlign: 'middle', display: 'inline-block', margin: '0 1px' }}
                  />HNA
                </span>
              </Link>
            </motion.div>
          )}

          {/* Card */}
          <motion.div
            initial={{ opacity:0, y:32 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
            style={{
              background:'var(--bg-surface)',
              backdropFilter:'blur(28px)', WebkitBackdropFilter:'blur(28px)',
              border:'1px solid var(--accent-gold-border-lo)',
              borderRadius:'32px', padding: isNarrow ? '32px 20px' : '48px 44px',
              boxShadow:'var(--shadow-heavy)',
            }}
          >
            <h2 style={{ fontFamily:"'Anton SC', var(--font-display), sans-serif", fontSize:'30px', color:'var(--text-primary)', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'2px' }}>{t('login.heading')}</h2>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'32px', lineHeight:1.5 }}>
              {t('login.subheading')}
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:'18px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'9px' }}>{t('login.email_label')}</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', [flip('left','right')]:'15px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'15px', pointerEvents:'none' }}>✉</span>
                  <input className="login-input" type="email" placeholder={t('login.email_placeholder')} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom:'20px' }}>
                <label style={{ display:'block', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'9px' }}>{t('login.password_label')}</label>
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', [flip('left','right')]:'15px', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'15px', pointerEvents:'none' }}>⚿</span>
                  <input className="login-input" type="password" placeholder={t('login.password_placeholder')} style={inputStyle} />
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'28px', fontSize:'13px' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'8px', color:'var(--text-muted)', cursor:'pointer' }}>
                  <input type="checkbox" style={{ accentColor:'var(--accent-gold)' }} /> {t('login.remember_me')}
                </label>
                <a href="#" style={{ color:'var(--accent-gold)', transition:'opacity 0.2s' }}>{t('login.forgot_password')}</a>
              </div>

              <motion.button
                whileHover={{ y:-2, boxShadow:'0 8px 36px rgba(212,175,55,0.4)', filter:'brightness(1.06)' }}
                whileTap={{ scale:0.98 }}
                type="submit"
                style={{ width:'100%', padding:'16px', background:'linear-gradient(135deg, var(--accent-gold), var(--accent-amber))', border:'none', borderRadius:'14px', fontWeight:700, fontSize:'16px', color:'var(--bg-base)', cursor:'pointer', boxShadow:'0 4px 24px rgba(212,175,55,0.3)' }}
              >{t('login.submit')}</motion.button>
            </form>

            <div style={{ display:'flex', alignItems:'center', gap:'14px', margin:'24px 0', color:'var(--text-muted)', fontSize:'12px' }}>
              <div style={{ flex:1, height:'1px', background:'var(--border-subtle)' }} />
              <span>{t('login.or')}</span>
              <div style={{ flex:1, height:'1px', background:'var(--border-subtle)' }} />
            </div>

            <p style={{ textAlign:'center', fontSize:'14px', color:'var(--text-muted)' }}>
              {t('login.no_account_prefix')}{' '}
              <Link href="/signin" style={{ color:'var(--accent-gold)', fontWeight:600 }}>{t('login.no_account_link')}</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
