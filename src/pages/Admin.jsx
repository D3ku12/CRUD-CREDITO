import { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'

const s = {
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
  tabs: {
    display: 'flex',
    gap: 0,
    marginBottom: 32,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tab: (active) => ({
    padding: '12px 28px',
    fontSize: 15,
    fontWeight: 600,
    color: active ? 'var(--primary)' : 'var(--muted)',
    background: 'none',
    border: 'none',
    borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
    cursor: 'pointer',
    transition: '0.2s',
  }),
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
  badge: {
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
    marginRight: 8,
  }),
  link: {
    color: 'var(--primary)',
    fontSize: 13,
    textDecoration: 'underline',
  },
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
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 32,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 24,
  },
  field: { marginBottom: 16 },
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
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: 8,
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16,
  },
  card: {
    background: 'var(--bg2)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  cardName: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    marginBottom: 4,
  },
  cardModality: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
  },
  cardSlogan: {
    fontSize: 13,
    color: 'var(--muted)',
    marginBottom: 16,
  },
  cardActions: {
    display: 'flex',
    gap: 8,
  },
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
  },
  confirmBox: {
    background: 'var(--bg2)',
    borderRadius: 16,
    padding: 32,
    maxWidth: 400,
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.08)',
  },
}

export default function Admin() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState('lenders')
  const [lenders, setLenders] = useState([])
  const [tenants, setTenants] = useState([])
  const [showLenderModal, setShowLenderModal] = useState(false)
  const [showTenantModal, setShowTenantModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [lenderForm, setLenderForm] = useState({ name: '', email: '', password: '', plan: 'Básico', modality: 'Paga Diario' })
  const [tenantForm, setTenantForm] = useState({ name: '', color: '#1D9E75', modality: '', slogan: '' })
  const [creating, setCreating] = useState(false)

  const token = localStorage.getItem('cc_token')
  const api = (path, opts = {}) =>
    fetch(path, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } })

  function loadTenants() {
    api('/api/tenants').then((r) => r.ok && r.json()).then(setTenants)
  }

  useEffect(() => {
    if (user?.role === 'superadmin') loadTenants()
  }, [user])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cc_lenders') || '[]')
    setLenders(stored)
  }, [])

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleCreateLender(e) {
    e.preventDefault()
    const newLender = {
      id: String(Date.now()),
      name: lenderForm.name,
      email: lenderForm.email,
      password: lenderForm.password,
      plan: lenderForm.plan,
      role: 'prestamista',
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [...lenders, newLender]
    setLenders(updated)
    localStorage.setItem('cc_lenders', JSON.stringify(updated))

    const slug = slugify(lenderForm.name)
    await api('/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ slug, name: lenderForm.name, modality: lenderForm.modality, slogan: '', color: '#1D9E75' }),
    })
    loadTenants()
    setShowLenderModal(false)
    setLenderForm({ name: '', email: '', password: '', plan: 'Básico', modality: 'Paga Diario' })
  }

  function handleToggle(lender) {
    const updated = lenders.map((l) => (l.id === lender.id ? { ...l, active: !l.active } : l))
    setLenders(updated)
    localStorage.setItem('cc_lenders', JSON.stringify(updated))
  }

  function openEditTenant(t) {
    setEditingTenant(t)
    setTenantForm({ name: t.name, color: t.color, modality: t.modality, slogan: t.slogan })
    setShowTenantModal(true)
  }

  function openCreateTenant() {
    setEditingTenant(null)
    setTenantForm({ name: '', color: '#1D9E75', modality: '', slogan: '' })
    setShowTenantModal(true)
  }

  async function handleSaveTenant(e) {
    e.preventDefault()
    if (editingTenant) {
      await api(`/api/tenants/${editingTenant.slug}`, {
        method: 'PUT',
        body: JSON.stringify(tenantForm),
      })
    } else {
      const slug = slugify(tenantForm.name)
      await api('/api/tenants', {
        method: 'POST',
        body: JSON.stringify({ slug, ...tenantForm }),
      })
    }
    loadTenants()
    setShowTenantModal(false)
  }

  async function handleDeleteTenant(slug) {
    await api(`/api/tenants/${slug}`, { method: 'DELETE' })
    loadTenants()
    setConfirmDelete(null)
  }

  if (!user) return null

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Panel Admin</h1>
        <button style={s.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </div>

      <div style={s.container}>
        <div style={s.tabs}>
          <button style={s.tab(tab === 'lenders')} onClick={() => setTab('lenders')}>Prestamistas</button>
          <button style={s.tab(tab === 'brands')} onClick={() => setTab('brands')}>Configuración de marcas</button>
        </div>

        {tab === 'lenders' && (
          <>
            <button style={s.addBtn} onClick={() => setShowLenderModal(true)}>+ Nuevo prestamista</button>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Nombre</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Plan</th>
                  <th style={s.th}>Estado</th>
                  <th style={s.th}>Registro</th>
                  <th style={s.th}>Landing</th>
                  <th style={s.th}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {lenders.map((l) => (
                  <tr key={l.id}>
                    <td style={s.td}>{l.name}</td>
                    <td style={s.td}>{l.email}</td>
                    <td style={s.td}>{l.plan}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: l.active ? 'rgba(29,158,117,0.15)' : 'rgba(231,76,60,0.15)', color: l.active ? 'var(--primary)' : '#e74c3c' }}>
                        {l.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={s.td}>{l.createdAt}</td>
                    <td style={s.td}>
                      {l.name && (
                        <a style={s.link} href={`/?tenant=${slugify(l.name)}`} target="_blank" rel="noopener noreferrer">
                          Ver landing
                        </a>
                      )}
                    </td>
                    <td style={s.td}>
                      <button style={s.actionBtn(l.active)} onClick={() => handleToggle(l)}>
                        {l.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
                {lenders.length === 0 && (
                  <tr>
                    <td style={s.td} colSpan={7}>No hay prestamistas registrados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {tab === 'brands' && (
          <>
            <button style={s.addBtn} onClick={openCreateTenant}>+ Nueva marca</button>
            {creating && <p style={{ color: 'var(--muted)', marginBottom: 16 }}>Creando...</p>}
            <div style={s.cards}>
              {tenants.map((t) => (
                <div key={t.slug} style={s.card}>
                  <div style={{ ...s.cardName, color: t.color }}>{t.name}</div>
                  {t.modality && (
                    <span style={{ ...s.cardModality, background: `${t.color}22`, color: t.color }}>{t.modality}</span>
                  )}
                  {t.slogan && <div style={s.cardSlogan}>{t.slogan}</div>}
                  <div style={s.cardActions}>
                    <button style={s.actionBtn(false)} onClick={() => openEditTenant(t)}>Editar</button>
                    <button style={s.actionBtn(true)} onClick={() => setConfirmDelete(t.slug)}>Eliminar</button>
                    <a style={s.link} href={`/?tenant=${t.slug}`} target="_blank" rel="noopener noreferrer">Preview</a>
                  </div>
                </div>
              ))}
              {tenants.length === 0 && (
                <p style={{ color: 'var(--muted)', gridColumn: '1 / -1' }}>No hay marcas configuradas</p>
              )}
            </div>
          </>
        )}
      </div>

      {showLenderModal && (
        <div style={s.overlay} onClick={() => setShowLenderModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Nuevo prestamista</h2>
            <form onSubmit={handleCreateLender}>
              <div style={s.field}>
                <label style={s.label}>Nombre</label>
                <input style={s.input} value={lenderForm.name} onChange={(e) => setLenderForm({ ...lenderForm, name: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" value={lenderForm.email} onChange={(e) => setLenderForm({ ...lenderForm, email: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Password temporal</label>
                <input style={s.input} value={lenderForm.password} onChange={(e) => setLenderForm({ ...lenderForm, password: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Plan</label>
                <select style={s.select} value={lenderForm.plan} onChange={(e) => setLenderForm({ ...lenderForm, plan: e.target.value })}>
                  <option value="Básico">Básico</option>
                  <option value="Pro">Pro</option>
                  <option value="Empresarial">Empresarial</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Modalidad del tenant</label>
                <select style={s.select} value={lenderForm.modality} onChange={(e) => setLenderForm({ ...lenderForm, modality: e.target.value })}>
                  <option value="Paga Diario">Paga Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Microcrédito">Microcrédito</option>
                </select>
              </div>
              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowLenderModal(false)}>Cancelar</button>
                <button type="submit" style={s.saveBtn}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTenantModal && (
        <div style={s.overlay} onClick={() => setShowTenantModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingTenant ? 'Editar marca' : 'Nueva marca'}</h2>
            <form onSubmit={handleSaveTenant}>
              <div style={s.field}>
                <label style={s.label}>Nombre</label>
                <input style={s.input} value={tenantForm.name} onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Color</label>
                <input style={{ ...s.input, padding: 6, height: 44 }} type="color" value={tenantForm.color} onChange={(e) => setTenantForm({ ...tenantForm, color: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Modalidad</label>
                <select style={s.select} value={tenantForm.modality} onChange={(e) => setTenantForm({ ...tenantForm, modality: e.target.value })}>
                  <option value="">Seleccionar</option>
                  <option value="Paga Diario">Paga Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Microcrédito">Microcrédito</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Eslogan</label>
                <input style={s.input} value={tenantForm.slogan} onChange={(e) => setTenantForm({ ...tenantForm, slogan: e.target.value })} />
              </div>
              <div style={{ ...s.preview, background: 'var(--bg)', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: tenantForm.color, marginBottom: 4 }}>{tenantForm.name || 'Vista previa'}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{tenantForm.slogan}</div>
                {tenantForm.modality && (
                  <span style={{ display: 'inline-block', padding: '3px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${tenantForm.color}22`, color: tenantForm.color }}>
                    {tenantForm.modality}
                  </span>
                )}
              </div>
              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowTenantModal(false)}>Cancelar</button>
                <button type="submit" style={s.saveBtn}>{editingTenant ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={s.confirmOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={s.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>¿Eliminar marca?</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ ...s.cancelBtn, flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button style={{ ...s.saveBtn, flex: 1, background: '#e74c3c' }} onClick={() => handleDeleteTenant(confirmDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
