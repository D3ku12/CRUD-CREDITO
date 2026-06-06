import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const LINKS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Planes', href: '#planes' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleAnchor = (href) => {
    setOpen(false)
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '12px 24px',
      background: scrolled ? 'rgba(13,31,26,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{
          fontSize: 20, fontWeight: 800,
          fontFamily: "'Outfit', sans-serif",
          color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          Crediconfianza
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--primary)', display: 'inline-block',
          }} />
        </Link>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 24,
          }} className="nav-links">
            {LINKS.map((l, i) => (
              <span
                key={i}
                onClick={() => handleAnchor(l.href)}
                style={{
                  fontSize: 14, color: 'var(--muted)', cursor: 'pointer',
                  transition: 'color 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted)'}
              >{l.label}</span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="nav-actions">
            {isAuthenticated ? (
              <>
                <span style={{
                  fontSize: 14, color: 'var(--text)', fontWeight: 500,
                  maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{user?.name || 'Usuario'}</span>
                <Link to="/dashboard" style={{
                  padding: '8px 20px', borderRadius: 'var(--radius)',
                  background: 'var(--primary)', color: '#fff',
                  fontSize: 14, fontWeight: 600,
                }}>Mi panel</Link>
                <button
                  onClick={logout}
                  style={{
                    padding: '8px 18px', borderRadius: 'var(--radius)',
                    background: 'rgba(255,255,255,0.06)', color: 'var(--muted)',
                    fontSize: 13, fontWeight: 500, border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '8px 20px', borderRadius: 'var(--radius)',
                  background: 'rgba(255,255,255,0.06)', color: 'var(--text)',
                  fontSize: 14, fontWeight: 500,
                }}>Iniciar sesión</Link>
                <Link to="/register" style={{
                  padding: '8px 20px', borderRadius: 'var(--radius)',
                  background: 'var(--primary)', color: '#fff',
                  fontSize: 14, fontWeight: 600,
                }}>Comenzar gratis</Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            style={{
              display: 'none', background: 'none', border: 'none',
              color: 'var(--text)', fontSize: 24, cursor: 'pointer',
              padding: 4,
            }}
            className="hamburger"
            aria-label="Menú"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div style={{
          display: 'none', flexDirection: 'column', gap: 12,
          padding: '16px 0', marginTop: 12,
          borderTop: '1px solid var(--border)',
        }} className="mobile-menu">
          {LINKS.map((l, i) => (
            <span
              key={i}
              onClick={() => handleAnchor(l.href)}
              style={{ fontSize: 15, color: 'var(--muted)', cursor: 'pointer', padding: '4px 0' }}
            >{l.label}</span>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {isAuthenticated ? (
              <>
                <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, textAlign: 'center' }}>
                  {user?.name || 'Usuario'}
                </div>
                <Link to="/dashboard" style={{
                  padding: '10px 0', borderRadius: 'var(--radius)',
                  background: 'var(--primary)', color: '#fff',
                  fontSize: 15, fontWeight: 600, textAlign: 'center',
                }}>Mi panel</Link>
                <button
                  onClick={logout}
                  style={{
                    padding: '10px 0', borderRadius: 'var(--radius)',
                    background: 'rgba(255,255,255,0.06)', color: 'var(--muted)',
                    fontSize: 14, fontWeight: 500, border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  padding: '10px 0', borderRadius: 'var(--radius)',
                  background: 'rgba(255,255,255,0.06)', color: 'var(--text)',
                  fontSize: 15, fontWeight: 500, textAlign: 'center',
                }}>Iniciar sesión</Link>
                <Link to="/register" style={{
                  padding: '10px 0', borderRadius: 'var(--radius)',
                  background: 'var(--primary)', color: '#fff',
                  fontSize: 15, fontWeight: 600, textAlign: 'center',
                }}>Comenzar gratis</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none !important; }
          .hamburger { display: block !important; }
          .mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
