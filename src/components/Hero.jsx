import { useNavigate } from 'react-router-dom'
import WhiteLabelDemo from './WhiteLabelDemo'

export default function Hero() {
  const navigate = useNavigate()

  const scrollToHow = () => {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '120px 24px 80px',
      background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(29,158,117,0.06) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto', width: '100%',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64,
        alignItems: 'center', position: 'relative', zIndex: 1,
      }}>
        <div>
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 20,
            background: 'rgba(29,158,117,0.12)', color: 'var(--primary)',
            fontSize: 13, fontWeight: 600, letterSpacing: '0.5px',
            textTransform: 'uppercase', marginBottom: 20,
          }}>Para prestamistas colombianos</span>

          <h1 style={{
            fontSize: 52, fontWeight: 800,
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.1, marginBottom: 20,
          }}>
            Digitaliza tu negocio de{' '}
            <span style={{ color: 'var(--primary)' }}>préstamos hoy</span>
          </h1>

          <p style={{
            fontSize: 17, color: 'var(--muted)',
            lineHeight: 1.7, marginBottom: 12, maxWidth: 480,
          }}>
            La plataforma que los prestamistas colombianos usan para cobrar{' '}
            <strong style={{ color: 'var(--text)' }}>paga diario</strong>,
            semanal o mensual — todo con tu propia marca.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '14px 36px', borderRadius: 'var(--radius)',
                background: 'var(--primary)', color: '#fff',
                fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              Solicitar demo gratis →
            </button>
            <button
              onClick={scrollToHow}
              style={{
                padding: '14px 36px', borderRadius: 'var(--radius)',
                background: 'transparent', color: 'var(--text)',
                fontSize: 16, fontWeight: 500, border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.target.style.borderColor = 'var(--muted)'}
              onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
            >
              Ver cómo funciona
            </button>
          </div>

          <div style={{
            display: 'flex', gap: 20, flexWrap: 'wrap',
            fontSize: 13, color: 'var(--muted)',
          }}>
            {['Sin contrato', 'Setup en 24h', 'Tu marca propia'].map((item, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--primary)', fontSize: 14 }}>✓</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <WhiteLabelDemo />
      </div>
    </section>
  )
}
