import { useState } from 'react'
import useAuth from '../hooks/useAuth'

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
    maxWidth: 800,
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
    maxWidth: 800,
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
  section: {
    marginTop: 32,
    padding: 32,
    background: 'var(--bg2)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--muted)',
    marginBottom: 6,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    cursor: 'pointer',
  },
  swatchRow: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  },
  swatchBtn: (c, active) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: active ? '3px solid var(--text)' : '3px solid transparent',
    backgroundColor: c,
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s',
    transform: active ? 'scale(1.15)' : 'scale(1)',
  }),
  saveBtn: {
    padding: '12px 32px',
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginTop: 8,
  },
  linkBtn: {
    display: 'inline-block',
    padding: '12px 32px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text)',
    fontSize: 15,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    textDecoration: 'none',
    marginTop: 8,
  },
}

const COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7']

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [brandName, setBrandName] = useState('')
  const [brandColor, setBrandColor] = useState(COLORS[0])
  const [saved, setSaved] = useState(false)

  function handleSaveBrand(e) {
    e.preventDefault()
    localStorage.setItem('cc_brand', JSON.stringify({ name: brandName, color: brandColor }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!user) return null

  const nextPayment = new Date()
  nextPayment.setDate(nextPayment.getDate() + 30)
  const nextPaymentStr = nextPayment.toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mi Dashboard</h1>
        <button style={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Resumen de tu cuenta</h2>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Negocio</span>
            <span style={styles.infoValue}>{user.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Plan activo</span>
            <span style={styles.infoValue}>Pro</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Estado</span>
            <span style={{ ...styles.infoValue, color: 'var(--primary)' }}>Activo</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Próximo pago</span>
            <span style={styles.infoValue}>{nextPaymentStr}</span>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Configurar mi marca</h2>
          <form onSubmit={handleSaveBrand}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre del negocio</label>
              <input
                style={styles.input}
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ej: Mi Crédito"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Color de marca</label>
              <div style={styles.swatchRow}>
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    style={styles.swatchBtn(c, brandColor === c)}
                    onClick={() => setBrandColor(c)}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
            <button type="submit" style={styles.saveBtn}>
              {saved ? '✓ Guardado' : 'Guardar'}
            </button>
          </form>
        </div>

        <a
          href="https://credialiado.digital"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...styles.linkBtn, display: 'inline-block', marginTop: 16 }}
        >
          Ir a Crediconfianza
        </a>
      </div>
    </div>
  )
}
