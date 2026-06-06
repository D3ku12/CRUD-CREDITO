import { useState } from 'react'

const COLORS = ['#1D9E75', '#185FA5', '#BA7517', '#993556', '#534AB7']
const MODALIDADES = [
  { value: 'diario', label: 'Paga Diario' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'microcredito', label: 'Microcrédito' },
  { value: 'flex', label: 'Flex' },
]

const s = {
  card: {
    background: 'var(--bg2)',
    borderRadius: 20,
    padding: 32,
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 24,
  },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' },
  field: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.5px', textTransform: 'uppercase' },
  input: {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)', fontSize: 15, outline: 'none', fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--text)', fontSize: 15, outline: 'none', cursor: 'pointer', fontFamily: 'inherit',
  },
  charCount: { fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginTop: 4 },
  swatchRow: { display: 'flex', gap: 10, marginTop: 4, alignItems: 'center' },
  swatchBtn: (c, active) => ({
    width: 32, height: 32, borderRadius: '50%',
    border: active ? '3px solid var(--text)' : '3px solid transparent',
    backgroundColor: c, cursor: 'pointer', transition: 'all 0.2s',
    transform: active ? 'scale(1.15)' : 'scale(1)',
    flexShrink: 0,
  }),
  colorPicker: {
    width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)',
    cursor: 'pointer', padding: 0, overflow: 'hidden', flexShrink: 0,
  },
  saveBtn: {
    padding: '12px 32px', borderRadius: 12, background: 'var(--primary)',
    color: '#fff', fontSize: 15, fontWeight: 600, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.2s',
  },
  saveBtnDisabled: {
    padding: '12px 32px', borderRadius: 12, background: 'rgba(255,255,255,0.06)',
    color: 'var(--muted)', fontSize: 15, fontWeight: 600, border: 'none',
    cursor: 'not-allowed', fontFamily: 'inherit',
  },
  savedIndicator: {
    display: 'inline-block', marginLeft: 12, fontSize: 14, fontWeight: 600,
    color: 'var(--primary)',
  },
  previewSection: {},
  previewLabel: { fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 12, letterSpacing: '0.5px', textTransform: 'uppercase' },
  previewCard: {
    borderRadius: 16, padding: 28, background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', gap: 20,
  },
  iconCircle: (c) => ({
    width: 56, height: 56, borderRadius: '50%', backgroundColor: c,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0,
    fontFamily: "'Outfit', sans-serif",
  }),
  brandName: { fontSize: 20, fontWeight: 700, fontFamily: "'Outfit', sans-serif", color: 'var(--text)', marginBottom: 6 },
  brandPill: (c) => ({
    display: 'inline-block', padding: '3px 12px', borderRadius: 20,
    fontSize: 12, fontWeight: 600, color: '#fff', backgroundColor: c, letterSpacing: '0.3px',
  }),
  slogan: { fontSize: 13, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' },
  powered: { display: 'block', fontSize: 11, color: 'var(--muted)', marginTop: 12, letterSpacing: '0.3px' },
  linkSection: { marginTop: 20 },
  linkBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '12px 16px', borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontSize: 13, color: 'var(--muted)', wordBreak: 'break-all',
  },
  copyBtn: {
    padding: '8px 18px', borderRadius: 10, background: 'rgba(29,158,117,0.12)',
    color: 'var(--primary)', fontSize: 13, fontWeight: 600,
    border: '1px solid rgba(29,158,117,0.25)', cursor: 'pointer',
    fontFamily: 'inherit', whiteSpace: 'nowrap',
  },
}

export default function SectionMiMarca({
  brandName, setBrandName,
  brandColor, setBrandColor,
  brandModality, setBrandModality,
  brandSlogan, setBrandSlogan,
  saved, saving,
  subscription, handleSaveBrand,
}) {
  const [copied, setCopied] = useState(false)
  const initial = brandName ? brandName.trim()[0].toUpperCase() : '?'
  const tenantLink = subscription?.tenantSlug
    ? `${window.location.origin}/?tenant=${subscription.tenantSlug}`
    : null

  const handleCopyLink = () => {
    if (!tenantLink) return
    navigator.clipboard.writeText(tenantLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = tenantLink
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={s.card}>
      <div style={s.grid}>
        <form onSubmit={handleSaveBrand}>
          <div style={s.field}>
            <label style={s.label}>Nombre del negocio</label>
            <input
              style={s.input}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ej: Mi Crédito"
              maxLength={100}
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Color principal</label>
            <div style={s.swatchRow}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  style={s.swatchBtn(c, brandColor === c)}
                  onClick={() => setBrandColor(c)}
                  aria-label={c}
                />
              ))}
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                style={s.colorPicker}
                title="Color personalizado"
              />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Modalidad</label>
            <select
              style={s.select}
              value={brandModality}
              onChange={(e) => setBrandModality(e.target.value)}
            >
              {MODALIDADES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div style={s.field}>
            <label style={s.label}>Eslogan</label>
            <input
              style={s.input}
              value={brandSlogan}
              onChange={(e) => setBrandSlogan(e.target.value)}
              placeholder="Tu eslogan aquí"
              maxLength={100}
            />
            <div style={s.charCount}>{brandSlogan.length}/100</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              type="submit"
              style={saving ? s.saveBtnDisabled : s.saveBtn}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            {saved && <span style={s.savedIndicator}>✓ Guardado</span>}
          </div>
        </form>

        <div style={s.previewSection}>
          <div style={s.previewLabel}>Vista previa en vivo</div>
          <div style={s.previewCard}>
            <div style={s.iconCircle(brandColor)}>{initial}</div>
            <div>
              <div style={s.brandName}>{brandName || 'Tu marca'}</div>
              <span style={s.brandPill(brandColor)}>
                {MODALIDADES.find(m => m.value === brandModality)?.label || brandModality}
              </span>
              {brandSlogan && <div style={s.slogan}>"{brandSlogan}"</div>}
              <small style={s.powered}>Powered by Crediconfianza</small>
            </div>
          </div>

          {tenantLink && (
            <div style={s.linkSection}>
              <div style={s.label}>Tu link personalizado</div>
              <div style={s.linkBox}>
                <span style={{ flex: 1 }}>{tenantLink}</span>
                <button style={s.copyBtn} onClick={handleCopyLink} type="button">
                  {copied ? '✓ ¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
