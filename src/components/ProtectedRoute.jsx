import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (role && user.role !== role) {
    const redirect = user.role === 'superadmin' ? '/admin' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}
