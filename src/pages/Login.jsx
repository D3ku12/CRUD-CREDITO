import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg)',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: '40px 32px',
    borderRadius: 20,
    background: 'var(--bg2)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    textAlign: 'center',
    marginBottom: 8,
    color: 'var(--text)',
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: 32,
  },
  field: {
    marginBottom: 20,
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
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginTop: 8,
  },
  error: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      localStorage.setItem('cc_token', data.token)

      if (data.user.role === 'superadmin') {
        navigate('/admin')
      } else if (data.user.role === 'prestamista') {
        navigate('/dashboard')
      }
    } catch {
      setError('Error de conexión')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Crediconfianza</h1>
        <p style={styles.subtitle}>Inicia sesión en tu panel</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button style={styles.btn} type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  )
}
