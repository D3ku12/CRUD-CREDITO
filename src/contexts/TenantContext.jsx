import { createContext, useContext, useState, useEffect } from 'react'

const TenantContext = createContext(null)

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('tenant')

    if (!slug) {
      setLoading(false)
      return
    }

    fetch(`/api/tenants/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || !data.name) return
        setTenant(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
