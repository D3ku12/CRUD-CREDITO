const s = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'var(--bg2)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  left: { display: 'flex', alignItems: 'center', gap: 16 },
  avatar: (color) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: color || 'rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'Outfit', sans-serif",
    flexShrink: 0,
  }),
  name: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text)',
  },
  subtitle: {
    fontSize: 12,
    color: 'var(--muted)',
    marginTop: 1,
  },
  logoutBtn: {
    padding: '8px 18px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted)',
    fontSize: 13,
    fontWeight: 500,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
}

export default function Header({ userName, businessName, onLogout }) {
  const initial = (userName || 'U')[0].toUpperCase()
  return (
    <header style={s.header}>
      <div style={s.left}>
        <div style={s.avatar('var(--primary)')}>{initial}</div>
        <div>
          <div style={s.name}>{userName || 'Usuario'}</div>
          <div style={s.subtitle}>{businessName || 'Cargando...'}</div>
        </div>
      </div>
      <button style={s.logoutBtn} onClick={onLogout}>Cerrar sesión</button>
    </header>
  )
}
