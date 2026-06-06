const s = {
  card: {
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 40,
    border: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
    maxWidth: 600,
    margin: '0 auto',
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 36,
    fontWeight: 800,
    color: '#fff',
    fontFamily: "'Outfit', sans-serif",
    margin: '0 auto 24px',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--muted)',
    marginBottom: 28,
    lineHeight: 1.6,
  },
  bigBtn: {
    display: 'inline-block',
    padding: '16px 48px',
    borderRadius: 14,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: "'Outfit', sans-serif",
    transition: 'opacity 0.2s',
  },
  bigBtnDisabled: {
    display: 'inline-block',
    padding: '16px 48px',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted)',
    fontSize: 17,
    fontWeight: 700,
    border: 'none',
    cursor: 'not-allowed',
    fontFamily: "'Outfit', sans-serif",
  },
  instructions: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13,
    color: 'var(--muted)',
    lineHeight: 1.6,
  },
  ctaText: {
    marginTop: 16,
    fontSize: 14,
    color: 'var(--muted)',
  },
  ctaLink: {
    color: 'var(--primary)',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: 14,
    fontFamily: 'inherit',
    textDecoration: 'underline',
  },
}

export default function SectionMiPlataforma({ hasPlan, onNavigate }) {
  return (
    <div style={s.card}>
      <div style={s.logoIcon}>C</div>
      <h2 style={s.title}>Crediconfianza</h2>
      <p style={s.subtitle}>
        Tu plataforma de gestión de créditos está lista
      </p>

      {hasPlan ? (
        <>
          <a
            href="https://credialiado.digital"
            target="_blank"
            rel="noopener noreferrer"
            style={s.bigBtn}
          >
            Abrir Crediconfianza →
          </a>
          <div style={s.instructions}>
            📌 Usa el mismo email y contraseña con que te registraste aquí
          </div>
        </>
      ) : (
        <>
          <div style={s.bigBtnDisabled} title="Activa un plan para acceder">
            🔒 Abrir Crediconfianza
          </div>
          <div style={s.ctaText}>
            Activa un plan para acceder a la plataforma.{' '}
            <button style={s.ctaLink} onClick={() => onNavigate('suscripcion')}>
              Ir a suscripción →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
