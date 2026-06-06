const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: '16px 24px',
    background: 'rgba(13,31,26,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--primary)',
  },
  links: {
    display: 'flex',
    gap: 24,
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: 'var(--muted)',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
}

const LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Planes', href: '#planes' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <span style={styles.logo}>Crediconfianza</span>
        <div style={styles.links}>
          {LINKS.map((l, i) => (
            <a key={i} href={l.href} style={styles.link}>{l.label}</a>
          ))}
        </div>
      </div>
    </nav>
  )
}
