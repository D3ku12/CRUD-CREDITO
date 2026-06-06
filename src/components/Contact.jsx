import { useState } from 'react'

const MODALIDADES = ['Paga Diario', 'Semanal', 'Mensual', 'Microcrédito', 'Flex']

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.target)
    const data = Object.fromEntries(fd)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSent(true)
      }
    } catch {}
    setLoading(false)
  }

  return (
    <section id="contacto" style={{
      padding: '100px 24px', background: 'var(--bg2)',
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }} data-reveal>
        <h2 style={{
          fontSize: 36, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
          textAlign: 'center', marginBottom: 12,
        }}>Solicita información</h2>
        <p style={{
          fontSize: 16, color: 'var(--muted)',
          textAlign: 'center', marginBottom: 40,
        }}>
          Cuéntanos de tu negocio y te contactamos en 24 horas
        </p>

        {sent ? (
          <div style={{
            textAlign: 'center', padding: 40,
            background: 'rgba(29,158,117,0.06)',
            borderRadius: 20, border: '1px solid rgba(29,158,117,0.15)',
          }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>✓</span>
            <p style={{ color: 'var(--primary)', fontSize: 18, fontWeight: 600, margin: 0 }}>
              ¡Mensaje enviado con éxito!
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>
              Te contactaremos en las próximas 24 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <input
              name="negocio"
              placeholder="Nombre del negocio"
              required
              style={inputStyle}
            />
            <input
              name="nombre"
              placeholder="Tu nombre completo"
              required
              style={inputStyle}
            />
            <input
              name="whatsapp"
              type="tel"
              placeholder="WhatsApp (+57 XXX XXX XXXX)"
              defaultValue="+57 "
              required
              style={inputStyle}
            />
            <select
              name="modalidad"
              required
              style={selectStyle}
              defaultValue=""
            >
              <option value="" disabled>Modalidad principal</option>
              {MODALIDADES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 0', borderRadius: 'var(--radius)',
                background: loading ? 'var(--muted)' : 'var(--primary)',
                color: '#fff', fontSize: 16, fontWeight: 600,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s', marginTop: 4,
              }}
            >
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)', fontSize: 15, outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
}
