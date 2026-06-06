import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

console.log('[Dashboard] token:', localStorage.getItem('cc_token'))
try {
  const raw = localStorage.getItem('cc_token')?.split('.')[1] || 'e30='
  console.log('[Dashboard] user:', JSON.parse(atob(raw)))
} catch {}

const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: '89.000',
    amount: 8900000,
    featured: false,
    features: ['Gestión de cartera', 'Cobro manual', 'Reportes básicos', '1 usuario'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '179.000',
    amount: 17900000,
    featured: true,
    features: [
      'Cobro automático WhatsApp',
      'Cartera en tiempo real',
      'Reportes avanzados',
      '5 usuarios',
      'Personalización de marca',
      'Soporte prioritario',
    ],
  },
  {
    id: 'empresarial',
    name: 'Empresarial',
    price: '320.000',
    amount: 32000000,
    featured: false,
    features: [
      'Todo lo de Pro',
      'Usuarios ilimitados',
      'API de integración',
      'Documentos PDF automáticos',
      'Gerente de cuenta dedicado',
      'Onboarding personalizado',
    ],
  },
]

const COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7']

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto 32px' },
  title: { fontSize: 28, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)' },
  logoutBtn: { padding: '8px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', color: 'var(--muted)', fontSize: 14, border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' },
  container: { maxWidth: 1100, margin: '0 auto' },
  card: { background: 'var(--bg2)', borderRadius: 20, padding: 32, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 20 },
  badge: (color) => ({ display: 'inline-block', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${color}20`, color, letterSpacing: '0.5px', textTransform: 'uppercase' }),
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 14 },
  infoLabel: { color: 'var(--muted)' },
  infoValue: { color: 'var(--text)', fontWeight: 500 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' },
  planCard: (feat) => ({ padding: '28px 24px', borderRadius: 20, background: feat ? 'rgba(29,158,117,0.05)' : 'rgba(255,255,255,0.03)', border: feat ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)', position: 'relative' }),
  badgePill: { position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '4px 18px', borderRadius: 20, background: 'var(--primary)', color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  planName: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 4, color: 'var(--text)' },
  price: { fontSize: 36, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--primary)', marginBottom: 4 },
  priceLabel: { fontSize: 14, color: 'var(--muted)', marginBottom: 16 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)' },
  check: { width: 18, height: 18, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)', fontSize: 12, fontWeight: 700 },
  btn: (feat, dis) => ({ width: '100%', padding: '12px 0', borderRadius: 12, background: dis ? 'rgba(255,255,255,0.03)' : (feat ? 'var(--primary)' : 'rgba(255,255,255,0.06)'), color: dis ? 'var(--muted)' : (feat ? '#fff' : 'var(--text)'), fontSize: 15, fontWeight: 600, border: 'none', cursor: dis ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }),
  successBanner: { padding: '16px 24px', borderRadius: 12, background: 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.25)', color: 'var(--primary)', fontSize: 15, fontWeight: 600, textAlign: 'center', marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: 15, outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: 15, outline: 'none', cursor: 'pointer' },
  swatchRow: { display: 'flex', gap: 10, marginTop: 4 },
  swatchBtn: (c, active) => ({ width: 32, height: 32, borderRadius: '50%', border: active ? '3px solid var(--text)' : '3px solid transparent', backgroundColor: c, cursor: 'pointer', transition: 'border-color 0.2s, transform 0.2s', transform: active ? 'scale(1.15)' : 'scale(1)' }),
  saveBtn: { padding: '12px 32px', borderRadius: 12, background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: 8 },
  bigBtn: { display: 'inline-block', padding: '16px 48px', borderRadius: 14, background: 'var(--primary)', color: '#fff', fontSize: 17, fontWeight: 700, border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', fontFamily: "'Outfit', sans-serif" },
  previewCard: { borderRadius: 16, padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 },
  iconCircle: (c) => ({ width: 48, height: 48, borderRadius: '50%', backgroundColor: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }),
  brandName: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 4 },
  brandPill: (c) => ({ display: 'inline-block', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#fff', backgroundColor: c, letterSpacing: '0.3px' }),
  copyBtn: { padding: '8px 20px', borderRadius: 10, background: 'rgba(29,158,117,0.12)', color: 'var(--primary)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(29,158,117,0.25)', cursor: 'pointer', marginLeft: 12 },
  linkBox: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 14, color: 'var(--muted)', wordBreak: 'break-all' },
}

const MODALIDADES = ['diario', 'semanal', 'mensual', 'varios']

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)
  const [tenant, setTenant] = useState(null)
  const [brandName, setBrandName] = useState('')
  const [brandColor, setBrandColor] = useState(COLORS[0])
  const [brandModality, setBrandModality] = useState('diario')
  const [brandSlogan, setBrandSlogan] = useState('')
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const pagoExitoso = searchParams.get('pago') === 'exitoso'

  const token = localStorage.getItem('cc_token')

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        console.log('[Dashboard] subscription data:', data)
        setSubscription(data)
        if (data?.tenantSlug) {
          const tres = await fetch(`/api/tenants/${data.tenantSlug}`)
          if (tres.ok) {
            const t = await tres.json()
            console.log('[Dashboard] tenant data:', t)
            setTenant(t)
            setBrandName(t.name || '')
            setBrandColor(t.color || COLORS[0])
            setBrandModality(t.modality || 'diario')
            setBrandSlogan(t.slogan || '')
          }
        }
      } else {
        console.log('[Dashboard] status responded', res.status)
      }
    } catch (err) {
      console.error('[Dashboard] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchStatus() }, [fetchStatus])

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
    } finally { setSubscribing(null) }
  }

  const handleSaveBrand = async (e) => {
    e.preventDefault()
    if (!subscription?.tenantSlug) {
      alert('No tienes un tenant asignado. Contacta al administrador.')
      return
    }
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
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?tenant=${subscription?.tenantSlug || ''}`
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = link
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!user) {
    console.log('[Dashboard] no user, returning null')
    return null
  }

  const hasPlan = subscription?.plan && subscription?.plan !== 'ninguno' && subscription?.estado === 'activo'
  const initial = brandName ? brandName.trim()[0].toUpperCase() : '?'
  const tenantLink = `${window.location.origin}/?tenant=${subscription?.tenantSlug || ''}`

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Mi Dashboard</h1>
        <button style={s.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={s.container}>
        {pagoExitoso && (
          <div style={s.successBanner}>¡Pago exitoso! Tu suscripción ha sido activada.</div>
        )}

        {saved && (
          <div style={s.successBanner}>✓ Cambios guardados correctamente</div>
        )}

        {/* 1 — BIENVENIDA */}
        <div style={s.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: hasPlan ? 'var(--primary)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)' }}>
                Hola, {user.name || 'Usuario'}
              </div>
              <div style={{ marginTop: 6 }}>
                {hasPlan ? (
                  <span style={s.badge('var(--primary)')}>{subscription.plan}</span>
                ) : (
                  <span style={s.badge('#7AA898')}>Sin plan</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2 — MI SUSCRIPCIÓN */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Mi Suscripción</h2>
          {loading ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando...</p>
          ) : hasPlan ? (
            <>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Plan</span>
                <span style={s.infoValue}>{subscription.plan}</span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Estado</span>
                <span style={{ ...s.infoValue, color: 'var(--primary)' }}>Activo</span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Vencimiento</span>
                <span style={s.infoValue}>{subscription.fechaVencimiento ? new Date(subscription.fechaVencimiento).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</span>
              </div>
              <div style={s.infoRow}>
                <span style={s.infoLabel}>Días restantes</span>
                <span style={s.infoValue}>{subscription.diasRestantes} días</span>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button style={s.btn(false, false)} onClick={() => handleSubscribe(subscription.planId || 'pro')}>Renovar</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
                Aún no tienes un plan activo. Elige el que mejor se adapte a tu negocio.
              </p>
              <div style={s.grid}>
                {PLANS.map((plan) => (
                  <div key={plan.id} style={s.planCard(plan.featured)}>
                    {plan.featured && <div style={s.badgePill}>Más popular</div>}
                    <h3 style={s.planName}>{plan.name}</h3>
                    <div style={s.price}>${plan.price}</div>
                    <div style={s.priceLabel}>/mes</div>
                    <ul style={s.featureList}>
                      {plan.features.map((f, j) => (
                        <li key={j} style={s.featureItem}>
                          <span style={s.check}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button style={s.btn(plan.featured, subscribing === plan.id)} onClick={() => handleSubscribe(plan.id)} disabled={subscribing === plan.id}>
                      {subscribing === plan.id ? 'Procesando...' : 'Suscribirme'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 3 — MI MARCA */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Mi Marca (White Label)</h2>
          {!subscription?.tenantSlug ? (
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              No tienes un tenant asignado. Contacta al administrador para obtener uno.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
              <form onSubmit={handleSaveBrand}>
                <div style={s.field}>
                  <label style={s.label}>Nombre del negocio</label>
                  <input style={s.input} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Ej: Mi Crédito" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Color de marca</label>
                  <div style={s.swatchRow}>
                    {COLORS.map((c) => (
                      <button key={c} type="button" style={s.swatchBtn(c, brandColor === c)} onClick={() => setBrandColor(c)} aria-label={c} />
                    ))}
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Modalidad</label>
                  <select style={s.select} value={brandModality} onChange={(e) => setBrandModality(e.target.value)}>
                    {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Eslogan</label>
                  <input style={s.input} value={brandSlogan} onChange={(e) => setBrandSlogan(e.target.value)} placeholder="Tu eslogan aquí" />
                </div>
                <button type="submit" style={s.saveBtn}>Guardar cambios</button>
              </form>

              <div>
                <p style={{ ...s.label, marginBottom: 12 }}>Vista previa</p>
                <div style={s.previewCard}>
                  <div style={s.iconCircle(brandColor)}>{initial}</div>
                  <div>
                    <div style={s.brandName}>{brandName || 'Tu marca'}</div>
                    <span style={s.brandPill(brandColor)}>{brandModality}</span>
                    {brandSlogan && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{brandSlogan}</p>}
                    <small style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 8, letterSpacing: '0.3px' }}>Powered by Crediconfianza</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 — MI LINK PERSONALIZADO */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Mi Link Personalizado</h2>
          {!subscription?.tenantSlug ? (
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>Asigna un tenant para generar tu link.</p>
          ) : (
            <>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
                Comparte este link para que tus clientes vean tu marca:
              </p>
              <div style={s.linkBox}>
                <span style={{ flex: 1 }}>{tenantLink}</span>
                <button style={s.copyBtn} onClick={handleCopyLink}>{copied ? '✓ Copiado' : 'Copiar'}</button>
              </div>
            </>
          )}
        </div>

        {/* 5 — ACCESO A CREDICONFIANZA */}
        <div style={{ ...s.card, textAlign: 'center' }}>
          <h2 style={s.cardTitle}>Acceso a Crediconfianza</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            Gestiona tu cartera, cobros y reportes desde tu plataforma.
          </p>
          <a href="https://credialiado.digital" target="_blank" rel="noopener noreferrer" style={s.bigBtn}>
            Ir a mi plataforma →
          </a>
        </div>
      </div>
    </div>
  )
}
