import { useState, useEffect } from 'react'

const PLANS = [
  { id: 'basico', name: 'Básico', price: '89.000', amount: 8900000, featured: false, color: '#1D9E75', features: ['Gestión de cartera', 'Cobro manual', 'Reportes básicos', '1 usuario'] },
  { id: 'pro', name: 'Pro', price: '179.000', amount: 17900000, featured: true, color: '#185FA5', features: ['Cobro automático WhatsApp', 'Cartera en tiempo real', 'Reportes avanzados', '5 usuarios', 'Personalización de marca', 'Soporte prioritario'] },
  { id: 'empresarial', name: 'Empresarial', price: '320.000', amount: 32000000, featured: false, color: '#BA7517', features: ['Todo lo de Pro', 'Usuarios ilimitados', 'API de integración', 'Documentos PDF automáticos', 'Gerente de cuenta dedicado', 'Onboarding personalizado'] },
]

const BADGE_COLORS = {
  basico: '#1D9E75',
  pro: '#185FA5',
  empresarial: '#BA7517',
  ninguno: '#7AA898',
}

const s = {
  card: {
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 32,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  welcomeRow: { display: 'flex', alignItems: 'center', gap: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Outfit', sans-serif",
    flexShrink: 0,
  },
  greeting: { fontSize: 22, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)' },
  businessName: { fontSize: 14, color: 'var(--muted)', marginTop: 2 },
  badge: (color) => ({
    display: 'inline-block',
    padding: '4px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    background: `${color}20`,
    color,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginTop: 8,
  }),
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 },
  statCard: {
    padding: '20px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
  },
  statValue: { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'var(--muted)', letterSpacing: '0.3px' },
  banner: {
    marginTop: 24,
    padding: '24px',
    borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(29,158,117,0.12), rgba(29,158,117,0.04))',
    border: '1px solid rgba(29,158,117,0.2)',
    textAlign: 'center',
  },
  bannerTitle: { fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 6 },
  bannerText: { fontSize: 14, color: 'var(--muted)', marginBottom: 20, maxWidth: 500, margin: '0 auto 20px' },
  plansGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 },
  planCard: (feat) => ({
    padding: '24px 20px',
    borderRadius: 16,
    background: feat ? 'rgba(29,158,117,0.05)' : 'rgba(255,255,255,0.03)',
    border: feat ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
    position: 'relative',
  }),
  badgePill: {
    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
    padding: '4px 18px', borderRadius: 20, background: 'var(--primary)', color: '#fff',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap',
  },
  planName: { fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 4, color: 'var(--text)' },
  price: { fontSize: 28, fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--primary)', marginBottom: 2 },
  priceLabel: { fontSize: 12, color: 'var(--muted)', marginBottom: 12 },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 6 },
  featureItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)' },
  check: { width: 16, height: 16, borderRadius: '50%', background: 'rgba(29,158,117,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)', fontSize: 11, fontWeight: 700 },
  subBtn: (feat) => ({
    width: '100%', padding: '10px 0', borderRadius: 10,
    background: feat ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
    color: feat ? '#fff' : 'var(--text)', fontSize: 14, fontWeight: 600,
    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  }),
}

export default function SectionInicio({ user, subscription, loading, onSubscribe, onNavigate }) {
  const hasPlan = subscription?.plan && subscription?.plan !== 'ninguno' && subscription?.estado === 'activo'
  const planKey = hasPlan ? subscription.plan?.toLowerCase() : 'ninguno'
  const badgeColor = BADGE_COLORS[planKey] || '#7AA898'
  const planName = subscription?.plan || 'Sin plan'

  const estadoColor = hasPlan ? 'var(--primary)' : (subscription?.estado === 'vencido' ? '#e74c3c' : 'var(--muted)')
  const estadoText = hasPlan ? 'Activa' : (subscription?.estado === 'vencido' ? 'Vencida' : 'Sin plan')
  const diasRestantes = subscription?.diasRestantes ?? '—'
  const fechaPago = subscription?.fechaVencimiento
    ? new Date(subscription.fechaVencimiento).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div>
      <div style={s.card}>
        <div style={s.welcomeRow}>
          <div style={s.avatar}>{(user?.name || 'U')[0].toUpperCase()}</div>
          <div>
            <div style={s.greeting}>Hola, {user?.name || 'Usuario'} 👋</div>
            <div style={s.businessName}>{user?.businessName || ''}</div>
            <span style={s.badge(badgeColor)}>{planName}</span>
          </div>
        </div>
      </div>

      <div style={s.statGrid}>
        <div style={s.statCard}>
          <div style={{ ...s.statValue, color: estadoColor }}>{estadoText}</div>
          <div style={s.statLabel}>Estado suscripción</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{diasRestantes === '—' ? '—' : `${diasRestantes} días`}</div>
          <div style={s.statLabel}>Días restantes</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{fechaPago}</div>
          <div style={s.statLabel}>Próximo pago</div>
        </div>
      </div>

      {!hasPlan && (
        <div style={s.banner}>
          <div style={s.bannerTitle}>🚀 Activa tu plan para acceder a Crediconfianza</div>
          <div style={s.bannerText}>
            Elige el plan ideal para tu negocio y comienza a gestionar tu cartera de créditos de forma inteligente.
          </div>
          <div style={s.plansGrid}>
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
                <button style={s.subBtn(plan.featured)} onClick={() => onSubscribe(plan.id)}>
                  Suscribirme
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
