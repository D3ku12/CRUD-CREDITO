import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'

const PLANS = [
  { id: 'básico', name: 'Básico', price: '$89.000/mes' },
  { id: 'pro', name: 'Pro', price: '$179.000/mes', popular: true },
  { id: 'empresarial', name: 'Empresarial', price: '$320.000/mes' },
]

const MODALIDADES = ['Paga Diario', 'Semanal', 'Mensual', 'Microcrédito', 'Flex']

export default function Register() {
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('plan')?.toLowerCase() || ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    whatsapp: '+57 ',
    negocio: '',
    modalidad: '',
  })
  const [selectedPlan, setSelectedPlan] = useState(
    PLANS.find(p => p.id === preselected)?.id || ''
  )
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          whatsapp: form.whatsapp,
          negocio: form.negocio,
          modalidad: form.modalidad,
          plan: selectedPlan,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al registrarse')
        setLoading(false)
        return
      }

      localStorage.setItem('cc_token', data.token)
      navigate('/dashboard', { state: { welcome: true } })
    } catch {
      setError('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '80px 24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 520, padding: '40px 32px',
        borderRadius: 20, background: 'var(--bg2)',
        border: '1px solid var(--border)',
      }}>
        <Link to="/" style={{
          display: 'block', textAlign: 'center', marginBottom: 24,
        }}>
          <span style={{
            fontSize: 22, fontWeight: 800, fontFamily: "'Outfit', sans-serif",
            color: 'var(--text)',
          }}>
            Crediconfianza
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--primary)', display: 'inline-block',
              marginLeft: 6, verticalAlign: 'middle',
            }} />
          </span>
        </Link>

        <h1 style={{
          fontSize: 24, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
          textAlign: 'center', marginBottom: 8, color: 'var(--text)',
        }}>Crear tu cuenta</h1>
        <p style={{
          fontSize: 14, color: 'var(--muted)', textAlign: 'center',
          marginBottom: 32,
        }}>Empieza a digitalizar tu negocio de préstamos</p>

        {error && (
          <p style={{
            color: '#e74c3c', fontSize: 14, textAlign: 'center',
            marginBottom: 16, padding: '10px 16px',
            background: 'rgba(231,76,60,0.1)', borderRadius: 10,
          }}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input
                style={inputStyle}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input
                style={inputStyle}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Contraseña</label>
                <input
                  style={inputStyle}
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirmar</label>
                <input
                  style={inputStyle}
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>WhatsApp</label>
              <input
                style={inputStyle}
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="+57 300 123 4567"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Nombre del negocio</label>
              <input
                style={inputStyle}
                name="negocio"
                value={form.negocio}
                onChange={handleChange}
                placeholder="Ej: Créditos Rápidos SAS"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Modalidad principal</label>
              <select
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}
                name="modalidad"
                value={form.modalidad}
                onChange={handleChange}
                required
                defaultValue=""
              >
                <option value="" disabled>Selecciona una modalidad</option>
                {MODALIDADES.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: 13, fontWeight: 600, color: 'var(--muted)',
              marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>Plan (opcional)</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {PLANS.map(plan => (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 'var(--radius)',
                    border: selectedPlan === plan.id
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border)',
                    background: selectedPlan === plan.id
                      ? 'rgba(29,158,117,0.08)'
                      : 'rgba(255,255,255,0.03)',
                    color: selectedPlan === plan.id ? 'var(--primary)' : 'var(--muted)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    textAlign: 'center', position: 'relative',
                  }}
                >
                  {plan.popular && (
                    <span style={{
                      position: 'absolute', top: -8, left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.5px',
                      color: 'var(--primary)', whiteSpace: 'nowrap',
                    }}>POPULAR</span>
                  )}
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{plan.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{plan.price}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 'var(--radius)',
              background: loading ? 'var(--muted)' : 'var(--primary)',
              color: '#fff', fontSize: 16, fontWeight: 600,
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 24,
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>O regístrate con</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button
          onClick={() => window.location.href = '/api/auth/google'}
          style={{
            width: '100%', marginTop: 16, padding: '12px 0',
            borderRadius: 'var(--radius)',
            background: '#fff', color: '#333',
            fontSize: 15, fontWeight: 600,
            border: '1px solid #dadce0',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10, fontFamily: 'inherit',
          }}
        >
          <svg viewBox="0 0 48 48" width="20" height="20">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 019.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 000 24c0 3.77.87 7.35 2.56 10.56l7.98-5.97z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)', fontSize: 15, outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: 'var(--muted)', marginBottom: 6,
  letterSpacing: '0.5px', textTransform: 'uppercase',
}
