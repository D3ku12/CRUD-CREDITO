import WhiteLabelDemo from './WhiteLabelDemo'

const styles = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: '80px 24px',
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 64,
    alignItems: 'center',
  },
  tag: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: 20,
    background: 'rgba(29,158,117,0.12)',
    color: 'var(--primary)',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  heading: {
    fontSize: 52,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    lineHeight: 1.1,
    marginBottom: 20,
  },
  highlight: {
    color: 'var(--primary)',
  },
  sub: {
    fontSize: 17,
    color: 'var(--muted)',
    lineHeight: 1.7,
    marginBottom: 32,
    maxWidth: 480,
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 36px',
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
}

export default function Hero() {
  const scrollToPlans = () => {
    document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div>
          <span style={styles.tag}>Plataforma White Label</span>
          <h1 style={styles.heading}>
            Tu propia plataforma de{' '}
            <span style={styles.highlight}>crédito confiable</span>
          </h1>
          <p style={styles.sub}>
            Gestiona tu cartera, cobra automáticamente y ofrece crédito
            con tu marca. Sin invertir en desarrollo.
          </p>
          <button style={styles.cta} onClick={scrollToPlans}>
            Ver planes →
          </button>
        </div>
        <WhiteLabelDemo />
      </div>
    </section>
  )
}
