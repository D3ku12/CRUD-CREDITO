const VALUE_CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Cobro automático',
    desc: 'Alertas WhatsApp el día del pago para que nunca se te pase una cuota.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Cartera en tiempo real',
    desc: 'Mora, saldos y vencimientos siempre visibles en un solo panel.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Tu marca propia',
    desc: 'Logo y colores de tu negocio en toda la plataforma.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'Documentos PDF',
    desc: 'Paz y salvos y extractos en un clic para tus clientes.',
  },
]

const STEPS = [
  'Configuras tu marca',
  'Cargas tus clientes',
  'Empiezas a cobrar',
]

const styles = {
  section: {
    padding: '100px 24px',
    background: 'var(--bg2)',
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
    marginBottom: 56,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 64,
  },
  card: {
    padding: '28px 24px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 600,
    margin: '12px 0 6px',
    fontFamily: "'Outfit', sans-serif",
  },
  cardDesc: {
    fontSize: 14,
    color: 'var(--muted)',
    lineHeight: 1.6,
  },
  stepsRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
  },
  arrow: {
    color: 'var(--muted)',
    fontSize: 18,
    margin: '0 4px',
  },
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" style={styles.section}>
      <div style={styles.container} data-reveal>
        <h2 style={styles.heading}>¿Cómo funciona?</h2>
        <p style={styles.subheading}>
          Todo lo que necesitas para gestionar tu cartera de crédito
        </p>

        <div style={styles.grid}>
          {VALUE_CARDS.map((card, i) => (
            <div key={i} style={styles.card}>
              {card.icon}
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <div key={i} style={styles.step}>
              <span style={styles.stepNum}>{i + 1}</span>
              <span style={styles.stepLabel}>{step}</span>
              {i < STEPS.length - 1 && (
                <span style={styles.arrow}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
