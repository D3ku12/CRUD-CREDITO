import { createContext, useContext, useState, useEffect } from 'react'

const TenantContext = createContext(null)

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('tenant')

    if (!slug || slug.length < 2 || slug.length > 50 || !/^[a-z0-9-]+$/.test(slug)) {
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        const res = await fetch(`/api/tenants/${slug}`)
        if (!res.ok) {
          setTenant(null)
          setLoading(false)
          return
        }
        const data = await res.json()
        if (!data || !data.name) {
          setTenant(null)
          setLoading(false)
          return
        }
        setTenant(data)
        setLoading(false)
      } catch (err) {
        console.warn('[TenantContext] fetch failed:', err.message)
        setTenant(null)
        setLoading(false)
      }
    })()
  }, [])

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  return useContext(TenantContext)
}
