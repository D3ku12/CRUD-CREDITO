import { useState, useEffect, useRef } from 'react'

const COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7']
const MODALIDADES = ['Paga Diario', 'Semanal', 'Microcrédito', 'Flex']
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const styles = {
  wrapper: {
    background: 'linear-gradient(135deg, #0a1f17 0%, #0d2b1f 100%)',
    border: '1px solid rgba(29,158,117,0.25)',
    borderRadius: 24,
    padding: 32,
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
    transition: 'border-color 0.2s',
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
    appearance: 'none',
  },
  swatchBtn: (c, active) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: active ? '3px solid var(--text)' : '3px solid transparent',
    backgroundColor: c,
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s',
    transform: active ? 'scale(1.15)' : 'scale(1)',
  }),
  previewCard: {
    marginTop: 28,
    borderRadius: 20,
    padding: 24,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: (color) => ({
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  }),
  info: { flex: 1 },
  name: {
    fontSize: 18,
    fontWeight: 700,
    fontFamily: "'Outfit', sans-serif",
    color: 'var(--text)',
    marginBottom: 4,
  },
  pill: (color) => ({
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
    backgroundColor: color,
    letterSpacing: '0.3px',
  }),
  powered: {
    display: 'block',
    fontSize: 11,
    color: 'var(--muted)',
    marginTop: 8,
    letterSpacing: '0.3px',
  },
}

export default function WhiteLabelDemo() {
  const [nombre, setNombre] = useState('')
  const [modalidad, setModalidad] = useState(MODALIDADES[0])
  const [color, setColor] = useState(COLORS[0])
  const isAutocompleting = useRef(false)

  useEffect(() => {
    if (isAutocompleting.current) {
      isAutocompleting.current = false
      return
    }
    if (!nombre.trim()) return
    const timer = setTimeout(() => {
      const slug = nombre.toLowerCase().replace(/\s+/g, '-')
      fetch(`${API}/api/tenants/${slug}`)
        .then(res => {
          if (!res.ok) throw new Error()
          return res.json()
        })
        .then(data => {
          isAutocompleting.current = true
          setNombre(data.name)
          setModalidad(data.modality)
          setColor(data.color)
        })
        .catch(() => {})
    }, 400)
    return () => clearTimeout(timer)
  }, [nombre])

  const initial = nombre.trim() ? nombre.trim()[0].toUpperCase() : '?'

  return (
    <div style={styles.wrapper}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={styles.label}>Nombre del negocio</label>
          <input
            style={styles.input}
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Ej: Mi Crédito"
          />
        </div>
        <div>
          <label style={styles.label}>Modalidad</label>
          <select
            style={styles.select}
            value={modalidad}
            onChange={e => setModalidad(e.target.value)}
          >
            {MODALIDADES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.label}>Color de marca</label>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            {COLORS.map(c => (
              <button
                key={c}
                style={styles.swatchBtn(c, color === c)}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>
      </div>

      <div style={styles.previewCard}>
        <div style={styles.iconCircle(color)}>{initial}</div>
        <div style={styles.info}>
          <div style={styles.name}>{nombre || 'Tu marca'}</div>
          <span style={styles.pill(color)}>{modalidad}</span>
          <small style={styles.powered}>Powered by Crediconfianza</small>
        </div>
      </div>
    </div>
  )
}
