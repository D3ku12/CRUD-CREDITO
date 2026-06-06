import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1100,
    margin: '0 auto 32px',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
  },
  logoutBtn: {
    padding: '8px 20px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted)',
    fontSize: 14,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
  },
  addBtn: {
    padding: '10px 24px',
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginBottom: 24,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'var(--bg2)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  td: {
    padding: '14px 20px',
    fontSize: 14,
    color: 'var(--text)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  activeBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  actionBtn: (danger) => ({
    padding: '6px 16px',
    borderRadius: 8,
    background: danger ? 'rgba(231,76,60,0.15)' : 'rgba(29,158,117,0.15)',
    color: danger ? '#e74c3c' : 'var(--primary)',
    fontSize: 13,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  }),
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    width: '100%',
    maxWidth: 480,
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: '32px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
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
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    cursor: 'pointer',
  },
  modalActions: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  },
  saveBtn: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 12,
    background: 'var(--primary)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text)',
    fontSize: 15,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
  },
}

export default function Admin() {
  const { user, logout } = useAuth()
  const [lenders, setLenders] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', plan: 'Básico' })

  const token = localStorage.getItem('cc_token')

  function loadLenders() {
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        const stored = JSON.parse(localStorage.getItem('cc_lenders') || '[]')
        setLenders(stored)
      })
  }

  useEffect(() => {
    loadLenders()
  }, [])

  async function handleToggle(lender) {
    const updated = lenders.map((l) =>
      l.id === lender.id ? { ...l, active: !l.active } : l
    )
    setLenders(updated)
    localStorage.setItem('cc_lenders', JSON.stringify(updated))
  }

  async function handleCreate(e) {
    e.preventDefault()
    const newLender = {
      id: String(Date.now()),
      ...form,
      role: 'prestamista',
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [...lenders, newLender]
    setLenders(updated)
    localStorage.setItem('cc_lenders', JSON.stringify(updated))
    setShowModal(false)
    setForm({ name: '', email: '', password: '', plan: 'Básico' })
  }

  if (!user) return null

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Panel Admin</h1>
        <button style={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={styles.container}>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          + Nuevo prestamista
        </button>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Plan</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Registro</th>
              <th style={styles.th}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {lenders.map((l) => (
              <tr key={l.id}>
                <td style={styles.td}>{l.name}</td>
                <td style={styles.td}>{l.email}</td>
                <td style={styles.td}>{l.plan}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.activeBadge,
                      background: l.active
                        ? 'rgba(29,158,117,0.15)'
                        : 'rgba(231,76,60,0.15)',
                      color: l.active ? 'var(--primary)' : '#e74c3c',
                    }}
                  >
                    {l.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={styles.td}>{l.createdAt}</td>
                <td style={styles.td}>
                  <button
                    style={styles.actionBtn(l.active)}
                    onClick={() => handleToggle(l)}
                  >
                    {l.active ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
            {lenders.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={6}>
                  No hay prestamistas registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Nuevo prestamista</h2>
            <form onSubmit={handleCreate}>
              <div style={styles.field}>
                <label style={styles.label}>Nombre</label>
                <input
                  style={styles.input}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Password temporal</label>
                <input
                  style={styles.input}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Plan</label>
                <select
                  style={styles.select}
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                >
                  <option value="Básico">Básico</option>
                  <option value="Pro">Pro</option>
                  <option value="Empresarial">Empresarial</option>
                </select>
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.saveBtn}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
