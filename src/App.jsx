import { Routes, Route } from 'react-router-dom'
import { TenantProvider } from './contexts/TenantContext'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Landing from './pages/Landing'

export default function App() {
  console.log('[App] rendering')
  return (
    <TenantProvider>
      <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="superadmin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="prestamista">
                <Dashboard />
              </ProtectedRoute>
            }
          />
      </Routes>
    </TenantProvider>
  )
}
