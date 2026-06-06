import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: '89.000',
    amount: 8900000,
    desc: 'Para negocios que inician su transformación digital',
    featured: false,
    features: ['Gestión de cartera', 'Cobro manual', 'Reportes básicos', '1 usuario'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '179.000',
    amount: 17900000,
    desc: 'La opción más elegida por asesores de crédito',
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
    desc: 'Para organizaciones con múltiples asesores',
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

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1100,
    margin: '0 auto 32px',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
  },
  logoutBtn: {
    padding: '8px 20px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted)',
    fontSize: 14,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  card: {
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 32,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 20,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: 14,
  },
  infoLabel: {
    color: 'var(--muted)',
  },
  infoValue: {
    color: 'var(--text)',
    fontWeight: 500,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    alignItems: 'start',
  },
  planCard: (featured) => ({
    padding: '32px 28px',
    borderRadius: 20,
    background: featured ? 'rgba(29,158,117,0.05)' : 'rgba(255,255,255,0.03)',
    border: featured ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
  }),
  badge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '4px 18px',
    borderRadius: 20,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  planName: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 4,
    color: 'var(--text)',
  },
  price: {
    fontSize: 40,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--primary)',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: 'var(--muted)',
    marginBottom: 20,
  },
  desc: {
    fontSize: 14,
    color: 'var(--muted)',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  featureList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: 'var(--text)',
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: 'rgba(29,158,117,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'var(--primary)',
    fontSize: 12,
    fontWeight: 700,
  },
  btn: (featured, disabled) => ({
    width: '100%',
    padding: '12px 0',
    borderRadius: 12,
    background: disabled ? 'rgba(255,255,255,0.03)' : (featured ? 'var(--primary)' : 'rgba(255,255,255,0.06)'),
    color: disabled ? 'var(--muted)' : (featured ? '#fff' : 'var(--text)'),
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.2s',
  }),
  footnote: {
    textAlign: 'center',
    fontSize: 13,
    color: 'var(--muted)',
    marginTop: 32,
  },
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(null)
  const pagoExitoso = searchParams.get('pago') === 'exitoso'

  const token = localStorage.getItem('cc_token')

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/payments/status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        if (!data) return
        setSubscription(data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const handleSubscribe = async (planId) => {
    setSubscribing(planId)
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

  console.log('[Dashboard] rendering', { subscription })

  if (!user) return null
  const hasPlan = subscription?.plan && subscription?.estado === 'activo'

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mi Dashboard</h1>
        <button style={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={styles.container}>
        {pagoExitoso && (
          <div style={styles.successBanner}>
            ¡Pago exitoso! Tu suscripción ha sido activada.
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 48 }}>
            Cargando...
          </p>
        ) : hasPlan ? (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Resumen de tu suscripción</h2>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Plan</span>
              <span style={styles.infoValue}>{subscription.plan}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Estado</span>
              <span style={{ ...styles.infoValue, color: 'var(--primary)' }}>
                {subscription.estado}
              </span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Vencimiento</span>
              <span style={styles.infoValue}>{subscription.fechaVencimiento}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Días restantes</span>
              <span style={styles.infoValue}>{subscription.diasRestantes} días</span>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ ...styles.cardTitle, textAlign: 'center', marginBottom: 32 }}>
              Suscríbete a un plan
            </h2>
            <div style={styles.grid}>
              {PLANS.map((plan) => (
                <div key={plan.id} style={styles.planCard(plan.featured)}>
                  {plan.featured && <div style={styles.badge}>Más popular</div>}
                  <h3 style={styles.planName}>{plan.name}</h3>
                  <div style={styles.price}>${plan.price}</div>
                  <div style={styles.priceLabel}>/mes</div>
                  <p style={styles.desc}>{plan.desc}</p>
                  <ul style={styles.featureList}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={styles.featureItem}>
                        <span style={styles.check}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    style={styles.btn(plan.featured, subscribing === plan.id)}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                  >
                    {subscribing === plan.id ? 'Procesando...' : 'Suscribirme'}
                  </button>
                </div>
              ))}
            </div>
            <p style={styles.footnote}>Precios en COP</p>
          </>
        )}
      </div>
    </div>
  )
}
