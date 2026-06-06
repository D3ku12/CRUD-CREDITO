import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const PLANS = [
  {
    name: 'Básico',
    price: '89.000',
    desc: 'Para negocios que inician su transformación digital',
    featured: false,
    features: [
      'Gestión de cartera',
      'Cobro manual',
      'Reportes básicos',
      '1 usuario',
    ],
  },
  {
    name: 'Pro',
    price: '179.000',
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
    name: 'Empresarial',
    price: '320.000',
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
  section: {
    padding: '100px 24px',
    background: 'var(--bg)',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  heading: {
    fontSize: 36,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    textAlign: 'center',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: 48,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    alignItems: 'start',
  },
  card: (featured) => ({
    padding: '32px 28px',
    borderRadius: 20,
    background: featured ? 'rgba(29,158,117,0.05)' : 'rgba(255,255,255,0.03)',
    border: featured
      ? '2px solid var(--primary)'
      : '1px solid rgba(255,255,255,0.06)',
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
  btn: (featured) => ({
    width: '100%',
    padding: '12px 0',
    borderRadius: 12,
    background: featured ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
    color: featured ? '#fff' : 'var(--text)',
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  }),
  footnote: {
    textAlign: 'center',
    fontSize: 13,
    color: 'var(--muted)',
    marginTop: 32,
  },
}

export default function Plans() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handlePlanClick = (planId) => {
    if (isAuthenticated) {
      navigate('/dashboard#suscripcion')
    } else {
      navigate(`/register?plan=${planId}`)
    }
  }

  return (
    <section id="planes" style={styles.section}>
      <div style={styles.container} data-reveal>
        <h2 style={styles.heading}>Planes</h2>
        <p style={styles.subheading}>
          Elige el plan ideal para tu negocio
        </p>

        <div style={styles.grid}>
          {PLANS.map((plan, i) => (
            <div key={i} style={styles.card(plan.featured)}>
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
              <button style={styles.btn(plan.featured)} onClick={() => handlePlanClick(plan.name.toLowerCase())}>
                Suscribirme
              </button>
            </div>
          ))}
        </div>

        <p style={styles.footnote}>
          Precios en COP · Onboarding gratis el primer mes
        </p>
      </div>
    </section>
  )
}
