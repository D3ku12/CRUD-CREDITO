const PLANS = [
  { id: 'basico', name: 'Básico', price: '89.000', amount: 8900000, featured: false, features: ['Gestión de cartera', 'Cobro manual', 'Reportes básicos', '1 usuario'] },
  { id: 'pro', name: 'Pro', price: '179.000', amount: 17900000, featured: true, features: ['Cobro automático WhatsApp', 'Cartera en tiempo real', 'Reportes avanzados', '5 usuarios', 'Personalización de marca', 'Soporte prioritario'] },
  { id: 'empresarial', name: 'Empresarial', price: '320.000', amount: 32000000, featured: false, features: ['Todo lo de Pro', 'Usuarios ilimitados', 'API de integración', 'Documentos PDF automáticos', 'Gerente de cuenta dedicado', 'Onboarding personalizado'] },
]

const s = {
  card: {
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 32,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  planHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  planTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)' },
  planPrice: { fontSize: 32, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--primary)' },
  planPriceLabel: { fontSize: 13, color: 'var(--muted)' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  infoRow: { padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },
  infoLabel: { fontSize: 12, color: 'var(--muted)', letterSpacing: '0.3px', marginBottom: 4 },
  infoValue: { fontSize: 15, fontWeight: 600, color: 'var(--text)' },
  progressSection: { marginBottom: 24 },
  progressLabel: { fontSize: 13, color: 'var(--muted)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' },
  progressBar: { width: '100%', height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  progressFill: (pct) => ({ width: `${Math.min(pct, 100)}%`, height: '100%', borderRadius: 4, background: 'var(--primary)', transition: 'width 0.5s ease' }),
  renewBtn: {
    padding: '12px 32px', borderRadius: 12, background: 'var(--primary)',
    color: '#fff', fontSize: 15, fontWeight: 600, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  heading: { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 6 },
  subheading: { fontSize: 14, color: 'var(--muted)', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' },
  planCard: (feat) => ({
    padding: '28px 24px', borderRadius: 20,
    background: feat ? 'rgba(29,158,117,0.05)' : 'rgba(255,255,255,0.03)',
    border: feat ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
  }),
  badgePill: {
    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
    padding: '4px 18px', borderRadius: 20, background: 'var(--primary)', color: '#fff',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  planName: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 4, color: 'var(--text)' },
  price: { fontSize: 36, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--primary)', marginBottom: 4 },
  priceLabel: { fontSize: 14, color: 'var(--muted)', marginBottom: 16 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 8 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)' },
  check: { width: 18, height: 18, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)', fontSize: 12, fontWeight: 700 },
  btn: (feat) => ({
    width: '100%', padding: '12px 0', borderRadius: 12,
    background: feat ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
    color: feat ? '#fff' : 'var(--text)', fontSize: 15, fontWeight: 600,
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  }),
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14, marginTop: 24 },
  th: { textAlign: 'left', padding: '10px 12px', color: 'var(--muted)', fontWeight: 500, fontSize: 12, letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  td: { padding: '10px 12px', color: 'var(--text)', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  statusBadge: (status) => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: 12,
    fontSize: 12, fontWeight: 600, background: status === 'exitoso' || status === 'activo' ? 'rgba(29,158,117,0.12)' : 'rgba(255,255,255,0.06)',
    color: status === 'exitoso' || status === 'activo' ? 'var(--primary)' : 'var(--muted)',
  }),
}

const dummyHistory = [
  { fecha: new Date(Date.now() - 25 * 86400000).toLocaleDateString('es-CO'), plan: 'Pro', monto: '$179.000', estado: 'activo' },
]

export default function SectionSuscripcion({ subscription, loading, onSubscribe, subscribing }) {
  const hasPlan = subscription?.plan && subscription?.plan !== 'ninguno' && subscription?.estado === 'activo'

  if (loading) {
    return (
      <div style={s.card}>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Cargando información de suscripción...</div>
      </div>
    )
  }

  if (hasPlan) {
    const fechaInicio = subscription?.fechaCreacion
      ? new Date(subscription.fechaCreacion).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—'
    const fechaVenc = subscription?.fechaVencimiento
      ? new Date(subscription.fechaVencimiento).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—'
    const diasTotal = 30
    const diasUsados = Math.max(0, diasTotal - (subscription?.diasRestantes || 0))
    const progreso = (diasUsados / diasTotal) * 100

    return (
      <div style={s.card}>
        <div style={s.planHeader}>
          <div>
            <div style={s.planTitle}>Plan {subscription.plan}</div>
            <div style={s.planPriceLabel}>Suscripción activa</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={s.planPrice}>${PLANS.find(p => p.name === subscription.plan)?.price || ''}</div>
            <div style={s.planPriceLabel}>/mes</div>
          </div>
        </div>

        <div style={s.infoGrid}>
          <div style={s.infoRow}>
            <div style={s.infoLabel}>Fecha de inicio</div>
            <div style={s.infoValue}>{fechaInicio}</div>
          </div>
          <div style={s.infoRow}>
            <div style={s.infoLabel}>Fecha de vencimiento</div>
            <div style={s.infoValue}>{fechaVenc}</div>
          </div>
        </div>

        <div style={s.progressSection}>
          <div style={s.progressLabel}>
            <span>{diasUsados} días usados</span>
            <span>{subscription?.diasRestantes || 0} días restantes</span>
          </div>
          <div style={s.progressBar}>
            <div style={s.progressFill(progreso)} />
          </div>
        </div>

        <button style={s.renewBtn} onClick={() => onSubscribe(subscription?.planId || 'pro')}>
          Renovar plan
        </button>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Fecha</th>
              <th style={s.th}>Plan</th>
              <th style={s.th}>Monto</th>
              <th style={s.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {dummyHistory.map((h, i) => (
              <tr key={i}>
                <td style={s.td}>{h.fecha}</td>
                <td style={s.td}>{h.plan}</td>
                <td style={s.td}>{h.monto}</td>
                <td style={s.td}><span style={s.statusBadge(h.estado)}>{h.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div style={s.card}>
      <h2 style={s.heading}>Elige tu plan</h2>
      <p style={s.subheading}>Aún no tienes un plan activo. Selecciona el que mejor se adapte a tu negocio.</p>

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
            <button
              style={s.btn(plan.featured)}
              onClick={() => onSubscribe(plan.id)}
              disabled={subscribing === plan.id}
            >
              {subscribing === plan.id ? 'Procesando...' : 'Suscribirme'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
