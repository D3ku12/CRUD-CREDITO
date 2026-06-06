import { useState, useEffect, useCallback } from 'react'
import useAuth from '../hooks/useAuth'
import AdminSidebar from '../components/dashboard/AdminSidebar'
import Header from '../components/dashboard/Header'

const COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7']
const PLAN_LABELS = { basico: 'Básico', pro: 'Pro', empresarial: 'Empresarial' }
const STATUS_LABELS = { activo: 'Activo', pendiente: 'Pendiente', vencido: 'Vencido', cancelado: 'Cancelado' }
const LEAD_STATUS_LABELS = { nuevo: 'Nuevo', contactado: 'Contactado', convertido: 'Convertido', descartado: 'Descartado' }

const s = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg)',
  },
  mainArea: {
    flex: 1,
    marginLeft: 240,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    padding: '32px',
    maxWidth: 1200,
    width: '100%',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 24,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  kpiCard: {
    background: 'var(--bg2)',
    borderRadius: 16,
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 4,
  },
  kpiLabel: {
    fontSize: 13,
    color: 'var(--muted)',
    fontWeight: 500,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'var(--bg2)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    fontSize: 14,
    color: 'var(--text)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  badge: (bg, color) => ({
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: bg,
    color: color,
  }),
  actionBtn: (danger) => ({
    padding: '6px 14px',
    borderRadius: 8,
    background: danger ? 'rgba(231,76,60,0.15)' : 'rgba(29,158,117,0.15)',
    color: danger ? '#e74c3c' : 'var(--primary)',
    fontSize: 12,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginRight: 6,
    fontFamily: 'inherit',
  }),
  link: {
    color: 'var(--primary)',
    fontSize: 13,
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
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
    maxWidth: 560,
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
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: 80,
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
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
    flexWrap: 'wrap',
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
  toolbar: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    minWidth: 200,
    fontFamily: 'inherit',
  },
  filterSelect: {
    padding: '8px 14px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  pageBtn: (disabled) => ({
    padding: '8px 16px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.06)',
    color: disabled ? 'rgba(255,255,255,0.2)' : 'var(--text)',
    fontSize: 13,
    fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
  }),
  pageInfo: {
    fontSize: 13,
    color: 'var(--muted)',
  },
  totalBox: {
    background: 'var(--bg2)',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 20,
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    color: 'var(--muted)',
    fontWeight: 500,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--primary)',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 20,
  },
  detailItem: {
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: 'var(--text)',
    fontWeight: 500,
  },
  emptyState: {
    textAlign: 'center',
    color: 'var(--muted)',
    fontSize: 14,
    padding: '40px 0',
  },
  skeleton: {
    height: 20,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
    marginBottom: 12,
  },
}

function formatCurrency(amount) {
  return '$' + (amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function statusBadge(status, type = 'subscription') {
  const map = type === 'lead'
    ? { nuevo: ['rgba(29,158,117,0.12)', 'var(--primary)'], contactado: ['rgba(26,115,232,0.12)', '#1a73e8'], convertido: ['rgba(29,158,117,0.2)', '#1D9E75'], descartado: ['rgba(231,76,60,0.12)', '#e74c3c'] }
    : { activo: ['rgba(29,158,117,0.15)', 'var(--primary)'], pendiente: ['rgba(243,156,18,0.15)', '#f39c12'], vencido: ['rgba(231,76,60,0.15)', '#e74c3c'], cancelado: ['rgba(255,255,255,0.08)', 'var(--muted)'] }
  const colors = map[status] || ['rgba(255,255,255,0.06)', 'var(--muted)']
  return <span style={s.badge(colors[0], colors[1])}>{(STATUS_LABELS[status] || LEAD_STATUS_LABELS[status] || status)}</span>
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function Admin() {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('inicio')
  const token = localStorage.getItem('cc_token')

  const api = useCallback((path, opts = {}) =>
    fetch(path, { ...opts, headers: { ...opts.headers, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }),
    [token]
  )

  // ---- Inicio ----
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  function loadStats() {
    api('/api/admin/stats').then(r => r.ok && r.json()).then(d => d?.data && setStats(d.data))
    api('/api/admin/recent').then(r => r.ok && r.json()).then(d => d?.data && setRecent(d.data))
  }

  // ---- Prestamistas ----
  const [lenders, setLenders] = useState([])
  const [lendersTotal, setLendersTotal] = useState(0)
  const [lendersPage, setLendersPage] = useState(0)
  const [lendersSearch, setLendersSearch] = useState('')
  const [lendersFilterPlan, setLendersFilterPlan] = useState('')
  const [lendersFilterStatus, setLendersFilterStatus] = useState('')
  const [showLenderModal, setShowLenderModal] = useState(false)
  const [editingLender, setEditingLender] = useState(null)
  const [showDetailLender, setShowDetailLender] = useState(null)
  const [lenderForm, setLenderForm] = useState({ full_name: '', email: '', password: '', phone: '', business_name: '', modality: 'diario' })
  const [creating, setCreating] = useState(false)
  const LENDERS_PER_PAGE = 20

  function loadLenders() {
    let url = `/api/admin/users?limit=${LENDERS_PER_PAGE}&offset=${lendersPage * LENDERS_PER_PAGE}`
    if (lendersSearch) url += `&search=${encodeURIComponent(lendersSearch)}`
    if (lendersFilterPlan) url += `&plan=${lendersFilterPlan}`
    if (lendersFilterStatus) url += `&subscription_status=${lendersFilterStatus}`
    api(url).then(r => r.ok && r.json()).then(d => {
      if (d?.data) { setLenders(d.data); setLendersTotal(d.total || d.data.length) }
    })
  }

  // ---- Leads ----
  const [leads, setLeads] = useState([])
  const [leadsTotal, setLeadsTotal] = useState(0)
  const [leadsFilter, setLeadsFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)
  const [leadNotes, setLeadNotes] = useState('')

  function loadLeads() {
    let url = '/api/leads?limit=100'
    if (leadsFilter) url += `&status=${leadsFilter}`
    api(url).then(r => r.ok && r.json()).then(d => {
      if (d?.data) { setLeads(d.data); setLeadsTotal(d.total || d.data.length) }
    })
  }

  // ---- Marcas ----
  const [tenants, setTenants] = useState([])
  const [showTenantModal, setShowTenantModal] = useState(false)
  const [editingTenant, setEditingTenant] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [tenantForm, setTenantForm] = useState({ business_name: '', primary_color: '#1D9E75', modality: '', slogan: '' })

  function loadTenants() {
    api('/api/tenants').then(r => r.ok && r.json()).then(d => d?.data && setTenants(d.data))
  }

  // ---- Pagos ----
  const [subscriptions, setSubscriptions] = useState([])
  const [subsTotal, setSubsTotal] = useState(0)
  const [subsTotalRecaudado, setSubsTotalRecaudado] = useState(0)
  const [subsFilter, setSubsFilter] = useState('')
  const [subsPage, setSubsPage] = useState(0)
  const SUBS_PER_PAGE = 20

  function loadSubscriptions() {
    let url = `/api/admin/subscriptions?limit=${SUBS_PER_PAGE}&offset=${subsPage * SUBS_PER_PAGE}`
    if (subsFilter) url += `&status=${subsFilter}`
    api(url).then(r => r.ok && r.json()).then(d => {
      if (d?.data) { setSubscriptions(d.data); setSubsTotal(d.total || d.data.length); setSubsTotalRecaudado(d.totalRecaudado || 0) }
    })
  }

  // ---- Inicialización ----
  useEffect(() => {
    if (user?.role !== 'superadmin') return
    loadStats()
    loadLenders()
    loadLeads()
    loadTenants()
    loadSubscriptions()
  }, [user])

  useEffect(() => { if (user?.role === 'superadmin') loadLenders() }, [lendersPage, lendersSearch, lendersFilterPlan, lendersFilterStatus])
  useEffect(() => { if (user?.role === 'superadmin') loadLeads() }, [leadsFilter])
  useEffect(() => { if (user?.role === 'superadmin') loadSubscriptions() }, [subsFilter, subsPage])

  // ---- Handlers Prestamistas ----
  async function handleCreateLender(e) {
    e.preventDefault()
    setCreating(true)
    await api('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(lenderForm),
    })
    loadLenders()
    loadTenants()
    setCreating(false)
    setShowLenderModal(false)
    setEditingLender(null)
    setLenderForm({ full_name: '', email: '', password: '', phone: '', business_name: '', modality: 'diario' })
  }

  async function handleToggle(lender) {
    await api(`/api/admin/users/${lender.id}/toggle`, { method: 'PUT' })
    loadLenders()
  }

  function openEditLender(lender) {
    setEditingLender(lender)
    setLenderForm({
      full_name: lender.full_name || '',
      email: lender.email || '',
      password: '',
      phone: lender.phone || '',
      business_name: lender.business_name || '',
      modality: lender.modality || 'diario',
    })
    setShowLenderModal(true)
  }

  async function openDetailLender(lender) {
    const r = await api(`/api/admin/users/${lender.id}`)
    if (r.ok) {
      const d = await r.json()
      setShowDetailLender(d.data)
    }
  }

  function handleConvertLead(lead) {
    setLenderForm({
      full_name: lead.owner_name || '',
      email: '',
      password: '',
      phone: lead.whatsapp || '',
      business_name: lead.business_name || '',
      modality: lead.modality || 'diario',
    })
    setEditingLender(null)
    setShowLenderModal(true)
    setSelectedLead(null)
  }

  // ---- Handlers Leads ----
  async function handleUpdateLead(lead, updates) {
    const r = await api(`/api/leads/${lead.id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    if (r.ok) {
      const d = await r.json()
      if (selectedLead?.id === lead.id) setSelectedLead(d.data)
      loadLeads()
    }
  }

  // ---- Handlers Marcas ----
  function openEditTenant(t) {
    setEditingTenant(t)
    setTenantForm({
      business_name: t.business_name || t.name || '',
      primary_color: t.primary_color || t.color || '#1D9E75',
      modality: t.modality || '',
      slogan: t.slogan || '',
    })
    setShowTenantModal(true)
  }

  function openCreateTenant() {
    setEditingTenant(null)
    setTenantForm({ business_name: '', primary_color: '#1D9E75', modality: '', slogan: '' })
    setShowTenantModal(true)
  }

  async function handleSaveTenant(e) {
    e.preventDefault()
    if (editingTenant) {
      const slug = editingTenant.slug
      await api(`/api/tenants/${slug}`, {
        method: 'PUT',
        body: JSON.stringify({ name: tenantForm.business_name, color: tenantForm.primary_color, modality: tenantForm.modality, slogan: tenantForm.slogan }),
      }).catch(() => {})
    } else {
      const slug = slugify(tenantForm.business_name)
      await api('/api/tenants', {
        method: 'POST',
        body: JSON.stringify({ slug, name: tenantForm.business_name, modality: tenantForm.modality, slogan: tenantForm.slogan, color: tenantForm.primary_color }),
      }).catch(() => {})
    }
    loadTenants()
    setShowTenantModal(false)
  }

  async function handleDeleteTenant(slug) {
    await api(`/api/tenants/${slug}`, { method: 'DELETE' }).catch(() => {})
    loadTenants()
    setConfirmDelete(null)
  }

  if (!user || user.role !== 'superadmin') return null

  const renderInicio = () => (
    <>
      <div style={s.kpiGrid}>
        <div style={s.kpiCard}>
          <div style={s.kpiValue}>{stats?.totalUsers || 0}</div>
          <div style={s.kpiLabel}>Prestamistas Registrados</div>
        </div>
        <div style={s.kpiCard}>
          <div style={s.kpiValue}>{stats?.activeSubscriptions || 0}</div>
          <div style={s.kpiLabel}>Suscripciones Activas</div>
        </div>
        <div style={s.kpiCard}>
          <div style={s.kpiValue}>{formatCurrency(stats?.mrr || 0)}</div>
          <div style={s.kpiLabel}>MRR (COP)</div>
        </div>
        <div style={s.kpiCard}>
          <div style={s.kpiValue}>{stats?.leadsThisWeek || 0}</div>
          <div style={s.kpiLabel}>Leads Nuevos Esta Semana</div>
        </div>
      </div>

      <h2 style={{ ...s.sectionTitle, fontSize: 18, marginBottom: 16 }}>Actividad Reciente</h2>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Tipo</th>
            <th style={s.th}>Nombre</th>
            <th style={s.th}>Detalle</th>
            <th style={s.th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((item, i) => (
            <tr key={`${item.type}-${item.id}-${i}`}>
              <td style={s.td}>
                <span style={s.badge(item.type === 'usuario' ? 'rgba(29,158,117,0.12)' : 'rgba(26,115,232,0.12)', item.type === 'usuario' ? 'var(--primary)' : '#1a73e8')}>
                  {item.type === 'usuario' ? 'Usuario' : 'Lead'}
                </span>
              </td>
              <td style={s.td}>{item.title}</td>
              <td style={s.td}>{item.subtitle || '-'}</td>
              <td style={s.td}>{formatDate(item.created_at)}</td>
            </tr>
          ))}
          {recent.length === 0 && (
            <tr><td style={s.td} colSpan={4}><div style={s.emptyState}>Sin actividad reciente</div></td></tr>
          )}
        </tbody>
      </table>
    </>
  )

  const renderPrestamistas = () => (
    <>
      <div style={s.toolbar}>
        <input style={s.searchInput} placeholder="Buscar por nombre o email..." value={lendersSearch} onChange={e => { setLendersSearch(e.target.value); setLendersPage(0) }} />
        <select style={s.filterSelect} value={lendersFilterPlan} onChange={e => { setLendersFilterPlan(e.target.value); setLendersPage(0) }}>
          <option value="">Todos los planes</option>
          <option value="basico">Básico</option>
          <option value="pro">Pro</option>
          <option value="empresarial">Empresarial</option>
        </select>
        <select style={s.filterSelect} value={lendersFilterStatus} onChange={e => { setLendersFilterStatus(e.target.value); setLendersPage(0) }}>
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="vencido">Vencido</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button style={{ ...s.saveBtn, flex: 'none', padding: '10px 24px' }} onClick={() => { setEditingLender(null); setLenderForm({ full_name: '', email: '', password: '', phone: '', business_name: '', modality: 'diario' }); setShowLenderModal(true) }}>
          + Nuevo Prestamista
        </button>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Nombre</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>WhatsApp</th>
            <th style={s.th}>Plan</th>
            <th style={s.th}>Estado</th>
            <th style={s.th}>Registro</th>
            <th style={s.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lenders.map((l) => (
            <tr key={l.id}>
              <td style={s.td}>{l.full_name}</td>
              <td style={s.td}>{l.email}</td>
              <td style={s.td}>{l.phone || '-'}</td>
              <td style={s.td}>{l.plan ? PLAN_LABELS[l.plan] : 'Sin plan'}</td>
              <td style={s.td}>{l.subscription_status ? statusBadge(l.subscription_status) : <span style={{ color: 'var(--muted)', fontSize: 13 }}>Inactivo</span>}</td>
              <td style={s.td}>{formatDate(l.created_at)}</td>
              <td style={s.td}>
                <button style={s.actionBtn(!l.is_active)} onClick={() => handleToggle(l)}>{l.is_active ? 'Desactivar' : 'Activar'}</button>
                <button style={s.actionBtn(false)} onClick={() => openDetailLender(l)}>Detalle</button>
                <button style={s.link} onClick={() => openEditLender(l)}>Editar</button>
              </td>
            </tr>
          ))}
          {lenders.length === 0 && (
            <tr><td style={s.td} colSpan={7}><div style={s.emptyState}>No hay prestamistas registrados</div></td></tr>
          )}
        </tbody>
      </table>

      {lendersTotal > LENDERS_PER_PAGE && (
        <div style={s.pagination}>
          <button style={s.pageBtn(lendersPage === 0)} disabled={lendersPage === 0} onClick={() => setLendersPage(p => p - 1)}>Anterior</button>
          <span style={s.pageInfo}>Página {lendersPage + 1} de {Math.ceil(lendersTotal / LENDERS_PER_PAGE)}</span>
          <button style={s.pageBtn((lendersPage + 1) * LENDERS_PER_PAGE >= lendersTotal)} disabled={(lendersPage + 1) * LENDERS_PER_PAGE >= lendersTotal} onClick={() => setLendersPage(p => p + 1)}>Siguiente</button>
        </div>
      )}
    </>
  )

  const renderLeads = () => (
    <>
      <div style={s.toolbar}>
        <select style={s.filterSelect} value={leadsFilter} onChange={e => setLeadsFilter(e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevo</option>
          <option value="contactado">Contactado</option>
          <option value="convertido">Convertido</option>
          <option value="descartado">Descartado</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{leadsTotal} leads</span>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Negocio</th>
            <th style={s.th}>Nombre</th>
            <th style={s.th}>WhatsApp</th>
            <th style={s.th}>Modalidad</th>
            <th style={s.th}>Estado</th>
            <th style={s.th}>Fecha</th>
            <th style={s.th}>Notas</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} onClick={() => { setSelectedLead(lead); setLeadNotes(lead.notes || '') }} style={{ cursor: 'pointer' }}>
              <td style={s.td}>{lead.business_name || '-'}</td>
              <td style={s.td}>{lead.owner_name}</td>
              <td style={s.td}>{lead.whatsapp}</td>
              <td style={s.td}>{lead.modality || '-'}</td>
              <td style={s.td}>{statusBadge(lead.status, 'lead')}</td>
              <td style={s.td}>{formatDate(lead.created_at)}</td>
              <td style={{ ...s.td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.notes || '-'}</td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr><td style={s.td} colSpan={7}><div style={s.emptyState}>No hay leads</div></td></tr>
          )}
        </tbody>
      </table>
    </>
  )

  const renderMarcas = () => (
    <>
      <div style={s.toolbar}>
        <button style={{ ...s.saveBtn, flex: 'none', padding: '10px 24px' }} onClick={openCreateTenant}>+ Nueva Marca</button>
      </div>
      <div style={s.cards}>
        {tenants.map((t) => (
          <div key={t.slug || t.id} style={s.card}>
            <div style={{ ...s.cardName, color: t.primary_color || t.color || 'var(--text)' }}>{t.business_name || t.name}</div>
            {t.modality && (
              <span style={{ ...s.cardModality, background: `${t.primary_color || t.color || '#1D9E75'}22`, color: t.primary_color || t.color || '#1D9E75' }}>{t.modality}</span>
            )}
            {t.slogan && <div style={s.cardSlogan}>{t.slogan}</div>}
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
              {t.full_name || t.email ? `${t.full_name || ''} ${t.email ? `(${t.email})` : ''}` : ''}
            </div>
            <div style={s.cardActions}>
              <button style={s.actionBtn(false)} onClick={() => openEditTenant(t)}>Editar</button>
              <button style={s.actionBtn(true)} onClick={() => setConfirmDelete(t.slug)}>Eliminar</button>
              <a style={s.link} href={`/?tenant=${t.slug}`} target="_blank" rel="noopener noreferrer">Ver landing</a>
            </div>
          </div>
        ))}
        {tenants.length === 0 && (
          <p style={{ color: 'var(--muted)', gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>No hay marcas configuradas</p>
        )}
      </div>
    </>
  )

  const renderPagos = () => (
    <>
      <div style={s.totalBox}>
        <span style={s.totalLabel}>Total Recaudado</span>
        <span style={s.totalValue}>{formatCurrency(subsTotalRecaudado)} COP</span>
      </div>

      <div style={s.toolbar}>
        <select style={s.filterSelect} value={subsFilter} onChange={e => { setSubsFilter(e.target.value); setSubsPage(0) }}>
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="vencido">Vencido</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Usuario</th>
            <th style={s.th}>Plan</th>
            <th style={s.th}>Monto</th>
            <th style={s.th}>Estado</th>
            <th style={s.th}>Referencia Wompi</th>
            <th style={s.th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id}>
              <td style={s.td}>{sub.full_name}<br /><span style={{ fontSize: 12, color: 'var(--muted)' }}>{sub.email}</span></td>
              <td style={s.td}>{PLAN_LABELS[sub.plan] || sub.plan}</td>
              <td style={s.td}>{formatCurrency(sub.amount_cop)}</td>
              <td style={s.td}>{statusBadge(sub.status)}</td>
              <td style={{ ...s.td, fontSize: 12, fontFamily: 'monospace' }}>{sub.wompi_reference || '-'}</td>
              <td style={s.td}>{formatDate(sub.created_at)}</td>
            </tr>
          ))}
          {subscriptions.length === 0 && (
            <tr><td style={s.td} colSpan={6}><div style={s.emptyState}>No hay pagos registrados</div></td></tr>
          )}
        </tbody>
      </table>

      {subsTotal > SUBS_PER_PAGE && (
        <div style={s.pagination}>
          <button style={s.pageBtn(subsPage === 0)} disabled={subsPage === 0} onClick={() => setSubsPage(p => p - 1)}>Anterior</button>
          <span style={s.pageInfo}>Página {subsPage + 1} de {Math.ceil(subsTotal / SUBS_PER_PAGE)}</span>
          <button style={s.pageBtn((subsPage + 1) * SUBS_PER_PAGE >= subsTotal)} disabled={(subsPage + 1) * SUBS_PER_PAGE >= subsTotal} onClick={() => setSubsPage(p => p + 1)}>Siguiente</button>
        </div>
      )}
    </>
  )

  const renderConfig = () => (
    <div style={{ maxWidth: 600 }}>
      <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
        Configuración del sistema. Las variables de entorno se gestionan desde el servidor.
      </p>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>Variable</th>
            <th style={s.th}>Valor</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['WOMPI_PUBLIC_KEY', (process.env.WOMPI_PUBLIC_KEY || 'No configurada').substring(0, 20) + '...'],
            ['FRONTEND_URL', process.env.FRONTEND_URL || 'http://localhost:3000'],
            ['SMTP', process.env.SMTP_HOST ? 'Configurado' : 'No configurado'],
            ['JWT_SECRET', process.env.JWT_SECRET ? 'Configurado' : 'No configurado'],
          ].map(([k, v]) => (
            <tr key={k}>
              <td style={s.td}><code style={{ fontSize: 13 }}>{k}</code></td>
              <td style={s.td}><span style={{ color: 'var(--muted)', fontSize: 13 }}>{v}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio': return renderInicio()
      case 'prestamistas': return renderPrestamistas()
      case 'leads': return renderLeads()
      case 'marcas': return renderMarcas()
      case 'pagos': return renderPagos()
      case 'config': return renderConfig()
      default: return null
    }
  }

  const SECTION_TITLES = {
    inicio: 'Inicio',
    prestamistas: 'Prestamistas',
    leads: 'Leads',
    marcas: 'Marcas',
    pagos: 'Pagos',
    config: 'Configuración',
  }

  return (
    <div style={s.layout}>
      <AdminSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div style={s.mainArea} className="main-content">
        <Header
          userName={user.name || 'Admin'}
          businessName="Panel de Administración"
          onLogout={logout}
        />
        <main style={s.content}>
          <h1 style={s.sectionTitle}>{SECTION_TITLES[activeSection]}</h1>
          {renderContent()}
        </main>
      </div>

      {/* Modal Prestamista */}
      {showLenderModal && (
        <div style={s.overlay} onClick={() => setShowLenderModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingLender ? 'Editar Prestamista' : 'Nuevo Prestamista'}</h2>
            <form onSubmit={handleCreateLender}>
              <div style={s.field}>
                <label style={s.label}>Nombre Completo</label>
                <input style={s.input} value={lenderForm.full_name} onChange={e => setLenderForm({ ...lenderForm, full_name: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email</label>
                <input style={s.input} type="email" value={lenderForm.email} onChange={e => setLenderForm({ ...lenderForm, email: e.target.value })} required={!editingLender} />
                {editingLender && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Dejar en blanco para mantener el actual</span>}
              </div>
              <div style={s.field}>
                <label style={s.label}>{editingLender ? 'Nueva Password (dejar en blanco para mantener)' : 'Password Temporal'}</label>
                <input style={s.input} type="text" value={lenderForm.password} onChange={e => setLenderForm({ ...lenderForm, password: e.target.value })} required={!editingLender} />
              </div>
              <div style={s.field}>
                <label style={s.label}>WhatsApp</label>
                <input style={s.input} value={lenderForm.phone} onChange={e => setLenderForm({ ...lenderForm, phone: e.target.value })} placeholder="+57..." />
              </div>
              <div style={s.field}>
                <label style={s.label}>Nombre del Negocio</label>
                <input style={s.input} value={lenderForm.business_name} onChange={e => setLenderForm({ ...lenderForm, business_name: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Modalidad</label>
                <select style={s.select} value={lenderForm.modality} onChange={e => setLenderForm({ ...lenderForm, modality: e.target.value })}>
                  <option value="diario">Paga Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="flex">Microcrédito</option>
                </select>
              </div>
              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowLenderModal(false)}>Cancelar</button>
                <button type="submit" style={s.saveBtn} disabled={creating}>{creating ? 'Guardando...' : (editingLender ? 'Guardar Cambios' : 'Crear Prestamista')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalle Prestamista */}
      {showDetailLender && (
        <div style={s.overlay} onClick={() => setShowDetailLender(null)}>
          <div style={{ ...s.modal, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Detalle del Prestamista</h2>
            <div style={s.detailGrid}>
              <div style={s.detailItem}><div style={s.detailLabel}>Nombre</div><div style={s.detailValue}>{showDetailLender.full_name}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Email</div><div style={s.detailValue}>{showDetailLender.email}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>WhatsApp</div><div style={s.detailValue}>{showDetailLender.phone || '-'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Negocio</div><div style={s.detailValue}>{showDetailLender.business_name || '-'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Slug</div><div style={s.detailValue}>{showDetailLender.tenant_slug || '-'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Modalidad</div><div style={s.detailValue}>{showDetailLender.modality || '-'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Estado</div><div style={s.detailValue}>{showDetailLender.is_active ? 'Activo' : 'Inactivo'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Registro</div><div style={s.detailValue}>{formatDate(showDetailLender.created_at)}</div></div>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 12, marginTop: 8 }}>Historial de Pagos</h3>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Plan</th>
                  <th style={s.th}>Monto</th>
                  <th style={s.th}>Estado</th>
                  <th style={s.th}>Referencia</th>
                  <th style={s.th}>Inicio</th>
                  <th style={s.th}>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {(showDetailLender.payments || []).map(p => (
                  <tr key={p.id}>
                    <td style={s.td}>{PLAN_LABELS[p.plan] || p.plan}</td>
                    <td style={s.td}>{formatCurrency(p.amount_cop)}</td>
                    <td style={s.td}>{statusBadge(p.status)}</td>
                    <td style={{ ...s.td, fontSize: 11, fontFamily: 'monospace' }}>{p.wompi_reference || '-'}</td>
                    <td style={s.td}>{formatDate(p.starts_at)}</td>
                    <td style={s.td}>{formatDate(p.expires_at)}</td>
                  </tr>
                ))}
                {(!showDetailLender.payments || showDetailLender.payments.length === 0) && (
                  <tr><td style={s.td} colSpan={6}><div style={s.emptyState}>Sin pagos registrados</div></td></tr>
                )}
              </tbody>
            </table>
            <div style={s.modalActions}>
              <button type="button" style={s.cancelBtn} onClick={() => setShowDetailLender(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lead */}
      {selectedLead && (
        <div style={s.overlay} onClick={() => setSelectedLead(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Detalle del Lead</h2>
            <div style={s.detailGrid}>
              <div style={s.detailItem}><div style={s.detailLabel}>Negocio</div><div style={s.detailValue}>{selectedLead.business_name || '-'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Nombre</div><div style={s.detailValue}>{selectedLead.owner_name}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>WhatsApp</div><div style={s.detailValue}>{selectedLead.whatsapp}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Modalidad</div><div style={s.detailValue}>{selectedLead.modality || '-'}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Estado</div><div style={s.detailValue}>{statusBadge(selectedLead.status, 'lead')}</div></div>
              <div style={s.detailItem}><div style={s.detailLabel}>Fecha</div><div style={s.detailValue}>{formatDate(selectedLead.created_at)}</div></div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Notas</label>
              <textarea style={s.textarea} value={leadNotes} onChange={e => setLeadNotes(e.target.value)} placeholder="Agregar notas..." />
              <button style={{ ...s.saveBtn, padding: '8px 16px', fontSize: 13, marginTop: 8 }} onClick={() => handleUpdateLead(selectedLead, { notes: leadNotes })}>
                Guardar Notas
              </button>
            </div>
            <div style={s.field}>
              <label style={s.label}>Cambiar Estado</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['nuevo', 'contactado', 'convertido', 'descartado'].map(st => (
                  <button key={st} style={{
                    ...s.badge(
                      selectedLead.status === st ? 'rgba(29,158,117,0.2)' : 'rgba(255,255,255,0.06)',
                      selectedLead.status === st ? 'var(--primary)' : 'var(--muted)'
                    ),
                    cursor: 'pointer',
                    border: selectedLead.status === st ? '1px solid var(--primary)' : '1px solid transparent',
                    fontFamily: 'inherit',
                    fontSize: 12,
                  }} onClick={() => handleUpdateLead(selectedLead, { status: st })}>
                    {LEAD_STATUS_LABELS[st]}
                  </button>
                ))}
              </div>
            </div>
            {selectedLead.status !== 'convertido' && (
              <button style={{ ...s.saveBtn, marginTop: 8 }} onClick={() => handleConvertLead(selectedLead)}>
                Convertir a Prestamista
              </button>
            )}
            <div style={s.modalActions}>
              <button type="button" style={s.cancelBtn} onClick={() => setSelectedLead(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Marca */}
      {showTenantModal && (
        <div style={s.overlay} onClick={() => setShowTenantModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editingTenant ? 'Editar Marca' : 'Nueva Marca'}</h2>
            <form onSubmit={handleSaveTenant}>
              <div style={s.field}>
                <label style={s.label}>Nombre del Negocio</label>
                <input style={s.input} value={tenantForm.business_name} onChange={e => setTenantForm({ ...tenantForm, business_name: e.target.value })} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Color Principal</label>
                <input style={{ ...s.input, padding: 6, height: 44 }} type="color" value={tenantForm.primary_color} onChange={e => setTenantForm({ ...tenantForm, primary_color: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Modalidad</label>
                <select style={s.select} value={tenantForm.modality} onChange={e => setTenantForm({ ...tenantForm, modality: e.target.value })}>
                  <option value="">Seleccionar</option>
                  <option value="diario">Paga Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="flex">Microcrédito</option>
                </select>
              </div>
              <div style={s.field}>
                <label style={s.label}>Eslogan</label>
                <input style={s.input} value={tenantForm.slogan} onChange={e => setTenantForm({ ...tenantForm, slogan: e.target.value })} />
              </div>
              <div style={{
                background: 'var(--bg)', borderRadius: 12, padding: 20, textAlign: 'center',
                marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: tenantForm.primary_color, marginBottom: 4 }}>
                  {tenantForm.business_name || 'Vista previa'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{tenantForm.slogan}</div>
                {tenantForm.modality && (
                  <span style={{
                    display: 'inline-block', padding: '3px 14px', borderRadius: 20, fontSize: 12,
                    fontWeight: 600, background: `${tenantForm.primary_color}22`, color: tenantForm.primary_color
                  }}>
                    {tenantForm.modality === 'diario' ? 'Paga Diario' : tenantForm.modality === 'flex' ? 'Microcrédito' : tenantForm.modality.charAt(0).toUpperCase() + tenantForm.modality.slice(1)}
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

      {/* Confirmación Eliminar */}
      {confirmDelete && (
        <div style={s.confirmOverlay} onClick={() => setConfirmDelete(null)}>
          <div style={s.confirmBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Outfit', sans-serif", marginBottom: 12 }}>¿Eliminar marca?</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ ...s.cancelBtn, flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button style={{ ...s.saveBtn, flex: 1, background: '#e74c3c' }} onClick={() => handleDeleteTenant(confirmDelete)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; padding-bottom: 70px; }
        }
      `}</style>
    </div>
  )
}
