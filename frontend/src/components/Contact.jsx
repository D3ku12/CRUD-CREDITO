import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const styles = {
  section: {
    padding: '100px 24px',
    background: 'var(--bg2)',
  },
  container: {
    maxWidth: 640,
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
    marginBottom: 40,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    minHeight: 100,
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  btn: {
    padding: '14px 0',
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  success: {
    textAlign: 'center',
    color: 'var(--primary)',
    fontSize: 16,
    fontWeight: 600,
    marginTop: 16,
  },
}

export default function Contact() {
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const data = Object.fromEntries(fd)
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setSent(true)
    } catch {}
  }

  return (
    <section id="contacto" style={styles.section}>
      <div style={styles.container} data-reveal>
        <h2 style={styles.heading}>Contacto</h2>
        <p style={styles.subheading}>
          Cuéntanos de tu negocio y te contactamos en 24 horas
        </p>

        {sent ? (
          <p style={styles.success}>¡Mensaje enviado con éxito!</p>
        ) : (
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.row}>
              <input style={styles.input} name="nombre" placeholder="Nombre" required />
              <input style={styles.input} name="email" type="email" placeholder="Correo" required />
            </div>
            <input style={styles.input} name="negocio" placeholder="Nombre del negocio" />
            <textarea style={styles.textarea} name="mensaje" placeholder="Cuéntanos más..." required />
            <button style={styles.btn}>Enviar mensaje</button>
          </form>
        )}
      </div>
    </section>
  )
}
