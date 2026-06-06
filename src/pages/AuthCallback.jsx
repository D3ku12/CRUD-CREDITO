import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export default function AuthCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      navigate('/login?error=no_token')
      return
    }
    localStorage.setItem('cc_token', token)
    const decoded = decodeToken(token)
    if (decoded?.role === 'superadmin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }, [searchParams, navigate])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)',
      fontFamily: "'Outfit', sans-serif", fontSize: 18,
    }}>
      Iniciando sesión...
    </div>
  )
}
