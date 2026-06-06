const SECTIONS = [
  { key: 'inicio', label: 'Inicio', icon: '🏠' },
  { key: 'marca', label: 'Mi Marca', icon: '🎨' },
  { key: 'suscripcion', label: 'Suscripción', icon: '💳' },
  { key: 'plataforma', label: 'Mi Plataforma', icon: '⚡' },
]

const s = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 240,
    height: '100vh',
    background: 'var(--bg2)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50,
  },
  logo: {
    padding: '24px 20px 20px',
    fontSize: 18,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--primary)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  nav: {
    flex: 1,
    padding: '12px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  item: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--primary)' : 'var(--muted)',
    background: active ? 'rgba(29,158,117,0.08)' : 'transparent',
    borderRight: active ? '3px solid var(--primary)' : '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  }),
  itemIcon: { fontSize: 16, width: 20, textAlign: 'center' },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--bg2)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'none',
    zIndex: 50,
    padding: '6px 0',
    justifyContent: 'space-around',
  },
  bottomItem: (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '6px 12px',
    fontSize: 11,
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--primary)' : 'var(--muted)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),
  bottomIcon: { fontSize: 18 },
}

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <>
      <aside style={s.sidebar} className="sidebar-desktop">
        <div style={s.logo}>Crediconfianza</div>
        <nav style={s.nav}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              style={s.item(activeSection === sec.key)}
              onClick={() => onNavigate(sec.key)}
            >
              <span style={s.itemIcon}>{sec.icon}</span>
              {sec.label}
            </button>
          ))}
        </nav>
      </aside>

      <nav style={s.bottomNav} className="bottom-nav-mobile">
        {SECTIONS.map((sec) => (
          <button
            key={sec.key}
            style={s.bottomItem(activeSection === sec.key)}
            onClick={() => onNavigate(sec.key)}
          >
            <span style={s.bottomIcon}>{sec.icon}</span>
            {sec.label}
          </button>
        ))}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .bottom-nav-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
