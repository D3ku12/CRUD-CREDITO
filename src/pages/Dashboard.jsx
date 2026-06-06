import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Sidebar from '../components/dashboard/Sidebar'
import Header from '../components/dashboard/Header'
import SectionInicio from '../components/dashboard/SectionInicio'
import SectionMiMarca from '../components/dashboard/SectionMiMarca'
import SectionSuscripcion from '../components/dashboard/SectionSuscripcion'
import SectionMiPlataforma from '../components/dashboard/SectionMiPlataforma'

const COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7']

const s = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  mainArea: {
    flex: 1,
    marginLeft: 240,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '32px',
    maxWidth: 1000,
    width: '100%',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 24,
  },
  successBanner: {
    padding: '16px 24px',
    borderRadius: 12,
    background: 'rgba(29,158,117,0.12)',
    border: '1px solid rgba(29,158,117,0.25)',
    color: 'var(--primary)',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 24,
  },
  savedBanner: {
    padding: '16px 24px',
    borderRadius: 12,
    background: 'rgba(29,158,117,0.12)',
    border: '1px solid rgba(29,158,117,0.25)',
    color: 'var(--primary)',
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 24,
  },
  skeleton: {
    height: 20,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
    marginBottom: 12,
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  errorCard: {
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 40,
    border: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
  },
  errorTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: '#e74c3c', marginBottom: 8 },
  errorText: { fontSize: 14, color: 'var(--muted)', marginBottom: 20 },
  retryBtn: {
    padding: '10px 28px', borderRadius: 12, background: 'rgba(255,255,255,0.06)',
    color: 'var(--text)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer', fontFamily: 'inherit',
  },
}

const SECTION_TITLES = {
  inicio: 'Inicio',
  marca: 'Mi Marca',
  suscripcion: 'Suscripción',
  plataforma: 'Mi Plataforma',
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeSection, setActiveSectionState] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    const valid = ['inicio', 'marca', 'suscripcion', 'plataforma']
    return valid.includes(hash) ? hash : 'inicio'
  })

  const setActiveSection = (section) => {
    setActiveSectionState(section)
    window.location.hash = section
  }
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [subscribing, setSubscribing] = useState(null)
  const [tenant, setTenant] = useState(null)
  const [brandName, setBrandName] = useState('')
  const [brandColor, setBrandColor] = useState(COLORS[0])
  const [brandModality, setBrandModality] = useState('diario')
  const [brandSlogan, setBrandSlogan] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const pagoExitoso = searchParams.get('pago') === 'exitoso'

  const token = localStorage.getItem('cc_token')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payments/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
      const data = await res.json()
      setSubscription(data)
      if (data?.tenantSlug) {
        const tres = await fetch(`/api/tenants/${data.tenantSlug}`)
        if (tres.ok) {
          const t = await tres.json()
          setTenant(t)
          setBrandName(t.name || '')
          setBrandColor(t.color || COLORS[0])
          setBrandModality(t.modality || 'diario')
          setBrandSlogan(t.slogan || '')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleSubscribe = async (planId) => {
    setSubscribing(planId)
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert(data.error || 'Error al crear el pago')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setSubscribing(null)
    }
  }

  const handleSaveBrand = async (e) => {
    e.preventDefault()
    if (!subscription?.tenantSlug) {
      alert('No tienes un tenant asignado. Contacta al administrador.')
      return
    }
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch(`/api/tenants/${subscription.tenantSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: brandName, color: brandColor, modality: brandModality, slogan: brandSlogan }),
      })
      if (res.ok) {
        setSaved(true)
        setTenant({ name: brandName, color: brandColor, modality: brandModality, slogan: brandSlogan })
        setTimeout(() => setSaved(false), 2000)
      } else {
        const d = await res.json()
        alert(d.error || 'Error al guardar')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  const hasPlan = subscription?.plan && subscription?.plan !== 'ninguno' && subscription?.estado === 'activo'
  const businessName = tenant?.name || user?.businessName || ''

  const renderContent = () => {
    if (error) {
      return (
        <div style={s.errorCard}>
          <div style={s.errorTitle}>Error al cargar datos</div>
          <div style={s.errorText}>{error}</div>
          <button style={s.retryBtn} onClick={fetchAll}>Reintentar</button>
        </div>
      )
    }

    if (loading) {
      return (
        <div>
          <div style={s.skeleton} />
          <div style={{ ...s.skeleton, width: '60%' }} />
          <div style={{ ...s.skeleton, width: '40%', marginTop: 24 }} />
          <div style={{ ...s.skeleton, width: '80%' }} />
        </div>
      )
    }

    switch (activeSection) {
      case 'inicio':
        return (
          <SectionInicio
            user={user}
            subscription={subscription}
            loading={loading}
            onSubscribe={handleSubscribe}
            onNavigate={setActiveSection}
          />
        )
      case 'marca':
        return (
          <SectionMiMarca
            brandName={brandName}
            setBrandName={setBrandName}
            brandColor={brandColor}
            setBrandColor={setBrandColor}
            brandModality={brandModality}
            setBrandModality={setBrandModality}
            brandSlogan={brandSlogan}
            setBrandSlogan={setBrandSlogan}
            saved={saved}
            saving={saving}
            subscription={subscription}
            handleSaveBrand={handleSaveBrand}
          />
        )
      case 'suscripcion':
        return (
          <SectionSuscripcion
            subscription={subscription}
            loading={loading}
            onSubscribe={handleSubscribe}
            subscribing={subscribing}
          />
        )
      case 'plataforma':
        return (
          <SectionMiPlataforma
            hasPlan={hasPlan}
            onNavigate={setActiveSection}
          />
        )
      default:
        return null
    }
  }

  return (
    <div style={s.layout}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div style={s.mainArea} className="main-content">
        <Header
          userName={user.name}
          businessName={businessName}
          onLogout={logout}
        />
        <main style={s.content}>
          {pagoExitoso && (
            <div style={s.successBanner}>¡Pago exitoso! Tu suscripción ha sido activada.</div>
          )}
          {saved && (
            <div style={s.savedBanner}>✓ Cambios guardados correctamente</div>
          )}
          {!loading && <h1 style={s.sectionTitle}>{SECTION_TITLES[activeSection]}</h1>}
          {renderContent()}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding-bottom: 70px; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
